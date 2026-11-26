const MATCHES_KEY = 'ltw_bongda_matches';

export function loadSaved() {
  try {
    const saved = window.localStorage.getItem(MATCHES_KEY);
    if (saved === null) return null;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveMatches(matches) {
  try {
    window.localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  } catch {
    return false;
  }
  return true;
}
