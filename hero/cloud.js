// The Supabase publishable key identifies this public web client. RLS in the
// database migration, not this key, protects every family's saved game.
const SUPABASE_URL = 'https://fdcwhspwiadxkfcvoocm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkY3doc3B3aWFkeGtmY3Zvb2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNDA5OTQsImV4cCI6MjEwNDkxNjk5NH0.MxROhViIke7pQi4QrDqqQ4n5Drb38jcQgm6f3YLBXgI';
const SESSION_KEY = 'hero-islands-parent-session-v1';
const VERIFIER_KEY = 'hero-islands-parent-pkce-v1';
const OWNER_KEY = 'hero-islands-save-owner-v1';
const DIRTY_KEY = 'hero-islands-cloud-pending-v1';
let changeVersion = 0;
export function hasPendingChanges() { return localStorage.getItem(DIRTY_KEY) !== null; }
export function acceptCloudCopy() { localStorage.removeItem(DIRTY_KEY); }
export function canImportDevice() { const owner = localStorage.getItem(OWNER_KEY); return !owner || owner === session?.user?.id; }

let session = null;
let queuedState = null;
let syncTimer = null;
let statusListener = () => {};
let readyOwner = null;
let revision;
let generation = 0;
let writeChain = Promise.resolve();

function resetSync() { generation++; readyOwner = null; revision = undefined; queuedState = null; clearTimeout(syncTimer); }
function base64url(bytes) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }

function headers(token = session?.access_token) {
  return { apikey: SUPABASE_KEY, Authorization: `Bearer ${token || SUPABASE_KEY}`, 'Content-Type': 'application/json' };
}
function setStatus(status) { statusListener(status); }
function validSession(value) { return value && typeof value.access_token === 'string' && typeof value.refresh_token === 'string'; }
function storeSession(value) { session = value; localStorage.setItem(SESSION_KEY, JSON.stringify(value)); }

async function authRequest(path, body) {
  const response = await fetch(`${SUPABASE_URL}${path}`, { method: 'POST', headers: headers(SUPABASE_KEY), body: JSON.stringify(body) });
  if (!response.ok) throw Object.assign(new Error((await response.json().catch(() => ({}))).msg || 'Unable to contact the account service.'), { status: response.status });
  return response.json();
}
async function refreshSession() {
  const epoch = generation, current = session;
  const data = await authRequest('/auth/v1/token?grant_type=refresh_token', { refresh_token: current.refresh_token });
  if (epoch !== generation || session !== current) throw new Error('Account changed.');
  storeSession(data);
}
async function loadUser() {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: headers() });
  if (!response.ok) throw Object.assign(new Error('Your sign-in link has expired. Please request a new one.'), { status: response.status });
  return response.json();
}

export function onCloudStatus(listener) { statusListener = listener; }
export function account() { return session?.user || null; }
export async function restoreSession() {
  resetSync();
  const epoch = generation;
  session = null;
  const fragment = new URLSearchParams(location.hash.slice(1));
  const url = new URL(location.href);
  if (fragment.has('access_token') || fragment.has('refresh_token')) {
    history.replaceState({}, document.title, `${location.pathname}${location.search}`);
    setStatus('error');
    return null;
  }
  try {
    if (url.searchParams.has('code')) {
      const code = url.searchParams.get('code');
      url.searchParams.delete('code');
      history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
      const pending = JSON.parse(localStorage.getItem(VERIFIER_KEY) || 'null');
      localStorage.removeItem(VERIFIER_KEY);
      if (!pending || typeof pending.verifier !== 'string' || Date.now() - pending.created > 3600000) throw new Error('Request a new sign-in link in this browser.');
      const data = await authRequest('/auth/v1/token?grant_type=pkce', { auth_code: code, code_verifier: pending.verifier });
      if (epoch !== generation) return null;
      if (!validSession(data)) throw new Error('Invalid sign-in response.');
      session = data;
    } else {
      const saved = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      if (validSession(saved)) session = saved;
    }
    if (!session) return null;
    const payload = JSON.parse(atob(session.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp || payload.exp * 1000 < Date.now() + 60_000) await refreshSession();
    const user = await loadUser();
    if (epoch !== generation) return null;
    session.user = user; storeSession(session); return session.user;
  } catch (error) {
    if (epoch !== generation) return null;
    if (session?.user && (error instanceof TypeError || error.status >= 500)) { setStatus('offline'); return session.user; }
    await signOut(); setStatus('error'); return null;
  }
}
export async function requestMagicLink(email) {
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid parent email address.');
  const verifier = base64url(crypto.getRandomValues(new Uint8Array(32)));
  const challenge = base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
  localStorage.setItem(VERIFIER_KEY, JSON.stringify({ verifier, created: Date.now() }));
  try {
    await authRequest(`/auth/v1/otp?redirect_to=${encodeURIComponent(`${location.origin}${location.pathname}`)}`, { email, create_user: true, code_challenge: challenge, code_challenge_method: 's256' });
  } catch (error) { localStorage.removeItem(VERIFIER_KEY); throw error; }
}
export async function loadSave() {
  if (!session) return null;
  resetSync();
  const epoch = generation;
  setStatus('syncing');
  const owner = encodeURIComponent(session.user.id);
  const response = await fetch(`${SUPABASE_URL}/rest/v1/hero_islands_saves?select=state,updated_at&owner_id=eq.${owner}&limit=1`, { headers: headers() });
  if (!response.ok) throw new Error('Cloud save could not be read.');
  const [row] = await response.json();
  if (epoch !== generation) throw new Error('Account changed. Reload before syncing.');
  revision = row?.updated_at || null;
  if (row && !row.updated_at) throw new Error('Cloud save version is missing.');
  return row || null;
}
export function completeCloudLoad(usingRemote = false) {
  if (!session?.user || revision === undefined) throw new Error('Cloud save has not finished loading.');
  const previousOwner = localStorage.getItem(OWNER_KEY);
  if (!usingRemote && previousOwner && previousOwner !== session.user.id) throw new Error('This device has another family’s progress. Use a fresh browser profile to start this family’s cloud save.');
  localStorage.setItem(OWNER_KEY, session.user.id);
  readyOwner = session.user.id;
  setStatus('saved');
}
export function saveNow(state) {
  if (!readyOwner || readyOwner !== session?.user?.id) return Promise.reject(new Error('Cloud save is not ready. Reload to safely reconnect.'));
  const snapshot = structuredClone(state), owner = readyOwner, epoch = generation, version = changeVersion;
  const operation = async () => {
    if (epoch !== generation || owner !== readyOwner) throw new Error('Account changed. Reload before syncing.');
    setStatus('syncing');
    const filter = revision ? `?owner_id=eq.${encodeURIComponent(owner)}&updated_at=eq.${encodeURIComponent(revision)}` : '';
    const response = await fetch(`${SUPABASE_URL}/rest/v1/hero_islands_saves${filter}`, {
      method: revision ? 'PATCH' : 'POST', headers: { ...headers(), Prefer: 'return=representation' },
      body: JSON.stringify(revision ? { state: snapshot } : { owner_id: owner, state: snapshot }),
    });
    if (epoch !== generation) throw new Error('Account changed. Reload before syncing.');
    const rows = response.ok ? await response.json() : [];
    if (epoch !== generation) throw new Error('Account changed. Reload before syncing.');
    if (!response.ok || !Array.isArray(rows) || rows.length !== 1 || !rows[0].updated_at) {
      resetSync(); setStatus('error');
      throw new Error('Cloud save could not be updated or changed on another device. Your device copy is safe. Reload to reconnect.');
    }
    revision = rows[0].updated_at;
    if (version === changeVersion) localStorage.removeItem(DIRTY_KEY);
    setStatus('saved'); return true;
  };
  const result = writeChain.then(operation).catch(error => { if (epoch === generation) { resetSync(); setStatus(navigator.onLine ? 'error' : 'offline'); } throw error; });
  writeChain = result.catch(() => {});
  return result;
}
export function queueSave(state) {
  changeVersion++;
  localStorage.setItem(DIRTY_KEY, JSON.stringify({ owner: localStorage.getItem(OWNER_KEY), revision: revision || null }));
  if (!readyOwner || readyOwner !== session?.user?.id) return;
  queuedState = structuredClone(state); clearTimeout(syncTimer);
  syncTimer = setTimeout(() => { const snapshot = queuedState; queuedState = null; if (snapshot) saveNow(snapshot).catch(() => {}); }, 900);
}
export async function signOut() {
  resetSync();
  if (session) fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: headers() }).catch(() => {});
  session = null; localStorage.removeItem(SESSION_KEY); localStorage.removeItem(VERIFIER_KEY); setStatus('local');
}
