export const CLUB_TARGETS = { learning: 6, play: 4 };

function count(value, maximum) {
  return Number.isSafeInteger(value) && value >= 0 ? Math.min(value, maximum) : 0;
}

export function normalizeClub(raw) {
  return { learning: count(raw?.learning, CLUB_TARGETS.learning), play: count(raw?.play, CLUB_TARGETS.play) };
}

export function normalizeArcade(raw) {
  return Object.fromEntries(['boat', 'pet'].map(type => [type, {
    best: count(raw?.[type]?.best, 1000),
    plays: count(raw?.[type]?.plays, Number.MAX_SAFE_INTEGER),
  }]));
}

export function recordArcade(state, profileId, result) {
  const profile = Array.isArray(state?.profiles) ? state.profiles.find(p => p?.id === profileId) : null;
  if (!profile || !['boat', 'pet'].includes(result?.type) || !Number.isInteger(result.score) || result.score < 0 || result.score > 1000) return false;
  profile.arcade = normalizeArcade(profile.arcade);
  const record = profile.arcade[result.type];
  record.best = Math.max(record.best, result.score);
  record.plays = Math.min(record.plays + 1, Number.MAX_SAFE_INTEGER);
  state.familyClub = normalizeClub(state.familyClub);
  state.familyClub.play = Math.min(state.familyClub.play + 1, CLUB_TARGETS.play);
  return true;
}

export function recordLearning(state, profileId) {
  if (!Array.isArray(state?.profiles) || !state.profiles.some(p => p?.id === profileId)) return false;
  state.familyClub = normalizeClub(state.familyClub);
  state.familyClub.learning = Math.min(state.familyClub.learning + 1, CLUB_TARGETS.learning);
  return true;
}

export function clubProgress(state) {
  const progress = normalizeClub(state?.familyClub);
  return { ...progress, restored: progress.learning === CLUB_TARGETS.learning && progress.play === CLUB_TARGETS.play };
}
