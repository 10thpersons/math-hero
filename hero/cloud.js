// The Supabase publishable key identifies this public web client. RLS in the
// database migration, not this key, protects every family's saved game.
const SUPABASE_URL = 'https://fdcwhspwiadxkfcvoocm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkY3doc3B3aWFkeGtmY3Zvb2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNDA5OTQsImV4cCI6MjEwNDkxNjk5NH0.MxROhViIke7pQi4QrDqqQ4n5Drb38jcQgm6f3YLBXgI';
const SESSION_KEY = 'hero-islands-parent-session-v1';

let session = null;
let queuedState = null;
let syncTimer = null;
let statusListener = () => {};

function headers(token = session?.access_token) {
  return { apikey: SUPABASE_KEY, Authorization: `Bearer ${token || SUPABASE_KEY}`, 'Content-Type': 'application/json' };
}
function setStatus(status) { statusListener(status); }
function validSession(value) { return value && typeof value.access_token === 'string' && typeof value.refresh_token === 'string'; }
function storeSession(value) { session = value; localStorage.setItem(SESSION_KEY, JSON.stringify(value)); }

async function authRequest(path, body) {
  const response = await fetch(`${SUPABASE_URL}${path}`, { method: 'POST', headers: headers(SUPABASE_KEY), body: JSON.stringify(body) });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).msg || 'Unable to contact the account service.');
  return response.json();
}
async function refreshSession() {
  const data = await authRequest('/auth/v1/token?grant_type=refresh_token', { refresh_token: session.refresh_token });
  storeSession(data);
}
async function loadUser() {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: headers() });
  if (!response.ok) throw new Error('Your sign-in link has expired. Please request a new one.');
  return response.json();
}

export function onCloudStatus(listener) { statusListener = listener; }
export function account() { return session?.user || null; }
export async function restoreSession() {
  const fragment = new URLSearchParams(location.hash.slice(1));
  if (fragment.get('access_token') && fragment.get('refresh_token')) {
    storeSession({ access_token: fragment.get('access_token'), refresh_token: fragment.get('refresh_token') });
    history.replaceState({}, document.title, `${location.pathname}${location.search}`);
  } else {
    try { const saved = JSON.parse(localStorage.getItem(SESSION_KEY)); if (validSession(saved)) session = saved; } catch { /* No previous session. */ }
  }
  if (!session) return null;
  try {
    const payload = JSON.parse(atob(session.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp || payload.exp * 1000 < Date.now() + 60_000) await refreshSession();
    session.user = await loadUser(); storeSession(session); return session.user;
  } catch { await signOut(); return null; }
}
export async function requestMagicLink(email) {
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid parent email address.');
  await authRequest('/auth/v1/otp', { email, create_user: true, redirect_to: `${location.origin}${location.pathname}` });
}
export async function loadSave() {
  if (!session) return null;
  setStatus('syncing');
  const owner = encodeURIComponent(session.user.id);
  const response = await fetch(`${SUPABASE_URL}/rest/v1/hero_islands_saves?select=state,updated_at&owner_id=eq.${owner}&limit=1`, { headers: headers() });
  if (!response.ok) throw new Error('Cloud save could not be read.');
  const [row] = await response.json(); setStatus('saved'); return row || null;
}
export async function saveNow(state) {
  if (!session) return false;
  setStatus('syncing');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/hero_islands_saves?on_conflict=owner_id`, {
    method: 'POST', headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({ owner_id: session.user.id, state }),
  });
  if (!response.ok) { setStatus('error'); throw new Error('Cloud save could not be updated. Your device copy is still safe.'); }
  queuedState = null; setStatus('saved'); return true;
}
export function queueSave(state) {
  if (!session) return;
  queuedState = state; clearTimeout(syncTimer);
  syncTimer = setTimeout(() => { if (queuedState) saveNow(queuedState).catch(() => {}); }, 900);
}
export async function signOut() {
  clearTimeout(syncTimer);
  if (session) fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: headers() }).catch(() => {});
  session = null; localStorage.removeItem(SESSION_KEY); setStatus('local');
}
