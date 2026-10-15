// Cloud saves for every game on this site (Supabase). Each game keeps its save in localStorage as the working
// copy; this module signs the browser in anonymously, pulls the newer copy at start-up and pushes changes in the
// background. All games share one origin, so one anonymous account covers all of them.
//
//   const cloud = await import('/save.js');
//   if (await cloud.pull('my-game', 'my.localStorage.key')) { /* the server copy was newer: reload the save */ }
//   ...after writing the save to localStorage:  cloud.touch('my-game', 'my.localStorage.key');
//
// Accounts (used by the lobby's account panel): a guest is an anonymous user; signUp turns the guest into an
// email + password account in place (same user id, so the saves stay); logIn / logOut switch accounts and swap the
// games' local saves; resetPassword mails a link back to the lobby, where setPassword finishes it.
const SB_URL = 'https://usoavddhglpbdpwwxium.supabase.co';
const SB_KEY = 'sb_publishable_HbbsnjG0GTwzfRgKyx1Aqg__JUOb24B';   // publishable: safe in the browser, rows are protected by RLS
const SESS = 'cloud.session.v1', KEYS = 'cloud.keys.v1', MAX = 200000, tKey = (k) => k + '__t';
const SITE = 'https://ywchen0711.github.io/';
const ls = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
  del: (k) => { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } } };
const knownKeys = () => { try { return JSON.parse(ls.get(KEYS)) || {}; } catch (e) { return {}; } };   // game -> localStorage key

let session = null, signing = null;
const queue = {};          // game -> localKey waiting to upload
let timer = null;
export let state = 'idle'; // idle | synced | offline | error
function setState(s, detail) { state = s; try { dispatchEvent(new CustomEvent('cloudsave', { detail: { state: s, detail } })); } catch (e) { /* ignore */ } }

class AuthError extends Error { constructor(m, code) { super(m); this.code = code; } }
async function call(path, body, method = 'POST', token) {
  const r = await fetch(SB_URL + '/auth/v1/' + path, { method, headers: { apikey: SB_KEY, 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new AuthError(d.msg || d.error_description || d.message || 'auth ' + r.status, d.error_code || d.error || String(r.status));
  return d;
}
function keep(d, user) {
  const u = user || d.user;
  d.expires_at = d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600);
  const s = { access_token: d.access_token, refresh_token: d.refresh_token, expires_at: d.expires_at, user: { id: u.id, email: u.email || null, anon: !u.email } };
  ls.set(SESS, JSON.stringify(s)); session = s;
  return s;
}
async function auth(path, body) {
  const d = await call(path, body);
  if (!d.access_token) throw new AuthError('no session', 'no_session');
  return keep(d);
}
async function getSession() {
  if (session && session.expires_at * 1000 > Date.now() + 60000) return session;
  if (signing) return signing;
  signing = (async () => {
    let s = null; try { s = JSON.parse(ls.get(SESS)); } catch (e) { /* ignore */ }
    if (s && s.expires_at * 1000 > Date.now() + 60000) return s;
    if (s && s.refresh_token) { try { return await auth('token?grant_type=refresh_token', { refresh_token: s.refresh_token }); } catch (e) { if (!/invalid|not found|revoked/i.test(e.message)) throw e; } }
    return auth('signup', { data: {} });                       // anonymous sign-in
  })();
  try { session = await signing; return session; } finally { signing = null; }
}
async function rest(path, opt = {}) {
  const s = await getSession();
  return fetch(SB_URL + '/rest/v1/' + path, { ...opt, headers: { apikey: SB_KEY, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json', ...(opt.headers || {}) } });
}

// pull: true when the server copy was newer and has been written into localStorage (the game should reload it)
export async function pull(game, localKey, timeoutMs = 4000) {
  const keys = knownKeys(); if (keys[game] !== localKey) { keys[game] = localKey; ls.set(KEYS, JSON.stringify(keys)); }
  try {
    const r = await Promise.race([rest(`game_saves?game=eq.${encodeURIComponent(game)}&select=data,updated_at`), new Promise((_, no) => setTimeout(() => no(new Error('timeout')), timeoutMs))]);
    if (!r.ok) throw new Error('pull ' + r.status);
    const rows = await r.json(), row = rows[0];
    const localT = Number(ls.get(tKey(localKey)) || 0), local = ls.get(localKey);
    if (row && Date.parse(row.updated_at) > localT) {
      ls.set(localKey, JSON.stringify(row.data)); ls.set(tKey(localKey), String(Date.parse(row.updated_at)));
      setState('synced'); return true;
    }
    if (local && (!row || localT > Date.parse(row.updated_at))) { if (!localT) ls.set(tKey(localKey), String(Date.now())); await upload(game, localKey); }
    else setState('synced');
    return false;
  } catch (e) { setState('offline', e.message); return false; }
}
// touch: call right after the game wrote its save to localStorage
export function touch(game, localKey, delay = 2500) {
  ls.set(tKey(localKey), String(Date.now()));
  queue[game] = localKey;
  clearTimeout(timer); timer = setTimeout(flush, delay);
}
async function upload(game, localKey, keepalive = false) {
  const raw = ls.get(localKey); if (!raw || raw.length > MAX) return;
  const t = Number(ls.get(tKey(localKey)) || Date.now());
  const s = keepalive ? session : await getSession(); if (!s) return;
  const body = JSON.stringify({ user_id: s.user.id, game, data: JSON.parse(raw), updated_at: new Date(t).toISOString() });
  const r = await fetch(SB_URL + '/rest/v1/game_saves?on_conflict=user_id,game', { method: 'POST', keepalive, body,
    headers: { apikey: SB_KEY, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' } });
  if (!r.ok) throw new Error('push ' + r.status);
  setState('synced');
}
export async function flush(keepalive = false) {
  clearTimeout(timer);
  const jobs = Object.entries(queue); for (const [g] of jobs) delete queue[g];
  for (const [game, key] of jobs) { try { await upload(game, key, keepalive); } catch (e) { queue[game] = key; setState('offline', e.message); timer = setTimeout(flush, 15000); } }
}
// leaving the page: send what is waiting
addEventListener('pagehide', () => { if (Object.keys(queue).length) flush(true); });
document.addEventListener('visibilitychange', () => { if (document.hidden && Object.keys(queue).length) flush(true); });
export const userId = () => session?.user?.id || null;

// ------------------------------------------------------------------ accounts
// account(): { id, email, anon } for the signed-in user (a guest is anon), or null before the first sign-in
export function account() { try { const x = session || JSON.parse(ls.get(SESS)); return x && x.user ? { ...x.user, anon: !x.user.email } : null; } catch (e) { return null; } }
export async function ensure() { try { return (await getSession()).user; } catch (e) { return null; } }
// Swap the local copies of every known game's save to the new account's: the server copy wins; a guest's progress
// is uploaded to the account when the account has none for that game; otherwise the other account's copy is removed.
async function switchSaves(keepGuest) {
  const keys = knownKeys();
  const r = await rest('game_saves?select=game,data,updated_at'); if (!r.ok) throw new AuthError('saves ' + r.status, 'saves');
  const rows = Object.fromEntries((await r.json()).map((x) => [x.game, x]));
  for (const [game, key] of Object.entries(keys)) {
    const row = rows[game];
    if (row) { ls.set(key, JSON.stringify(row.data)); ls.set(tKey(key), String(Date.parse(row.updated_at))); }
    else if (keepGuest && ls.get(key)) { if (!ls.get(tKey(key))) ls.set(tKey(key), String(Date.now())); await upload(game, key); }
    else { ls.del(key); ls.del(tKey(key)); }
  }
  setState('synced');
}
function clearSaves() { for (const key of Object.values(knownKeys())) { ls.del(key); ls.del(tKey(key)); } }
// signUp: the guest becomes an email + password account (no confirmation email); saves stay with it
export async function signUp(email, password) {
  await flush();
  const s = await getSession();
  if (!s.user.email) {
    const u = await call('user', { email, password }, 'PUT', s.access_token);
    if (u.email) { await refreshNow(); return account(); }
  }
  const wasGuest = !s.user.email;
  await auth('signup', { email, password });
  await switchSaves(wasGuest);
  return account();
}
export async function logIn(email, password) {
  await flush();
  const before = account();
  await auth('token?grant_type=password', { email, password });
  await switchSaves(!before || !before.email);
  return account();
}
// logOut: leaves this browser as a new guest with empty saves (the account keeps its saves on the server)
export async function logOut() {
  await flush();
  const s = session || (() => { try { return JSON.parse(ls.get(SESS)); } catch (e) { return null; } })();
  if (s && s.access_token) { try { await call('logout', null, 'POST', s.access_token); } catch (e) { /* already gone */ } }
  ls.del(SESS); session = null; clearSaves();
  return ensure();
}
export async function resetPassword(email, redirect = SITE) { await call('recover?redirect_to=' + encodeURIComponent(redirect), { email }); }
export async function setPassword(password) { const s = await getSession(); await call('user', { password }, 'PUT', s.access_token); }
async function refreshNow() { const s = session || JSON.parse(ls.get(SESS)); return auth('token?grant_type=refresh_token', { refresh_token: s.refresh_token }); }
// The password-reset link comes back as #access_token=…&type=recovery: sign in with it, then ask for a new password.
// Returns 'recovery' | 'error:<message>' | null.
export async function fromLink(hash = location.hash) {
  const q = new URLSearchParams(hash.replace(/^#/, ''));
  if (q.get('error_description') || q.get('error')) return 'error:' + (q.get('error_description') || q.get('error'));
  if (!q.get('access_token')) return null;
  await flush();
  const before = account();
  const u = await call('user', null, 'GET', q.get('access_token'));
  keep({ access_token: q.get('access_token'), refresh_token: q.get('refresh_token'), expires_at: Number(q.get('expires_at')) || 0, expires_in: Number(q.get('expires_in')) || 3600 }, u);
  if (!before || before.id !== u.id) await switchSaves(!before || !before.email);
  return q.get('type') === 'recovery' ? 'recovery' : 'signed-in';
}
