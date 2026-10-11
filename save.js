// Cloud saves for every game on this site (Supabase). Each game keeps its save in localStorage as the working
// copy; this module signs the browser in anonymously, pulls the newer copy at start-up and pushes changes in the
// background. All games share one origin, so one anonymous account covers all of them.
//
//   const cloud = await import('/save.js');
//   if (await cloud.pull('my-game', 'my.localStorage.key')) { /* the server copy was newer: reload the save */ }
//   ...after writing the save to localStorage:  cloud.touch('my-game', 'my.localStorage.key');
const SB_URL = 'https://usoavddhglpbdpwwxium.supabase.co';
const SB_KEY = 'sb_publishable_HbbsnjG0GTwzfRgKyx1Aqg__JUOb24B';   // publishable: safe in the browser, rows are protected by RLS
const SESS = 'cloud.session.v1', MAX = 200000, tKey = (k) => k + '__t';
const ls = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } } };

let session = null, signing = null;
const queue = {};          // game -> localKey waiting to upload
let timer = null;
export let state = 'idle'; // idle | synced | offline | error
function setState(s, detail) { state = s; try { dispatchEvent(new CustomEvent('cloudsave', { detail: { state: s, detail } })); } catch (e) { /* ignore */ } }

async function auth(path, body) {
  const r = await fetch(SB_URL + '/auth/v1/' + path, { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.access_token) throw new Error(d.msg || d.error_description || d.message || 'auth ' + r.status);
  d.expires_at = d.expires_at || Math.floor(Date.now() / 1000) + (d.expires_in || 3600);
  ls.set(SESS, JSON.stringify({ access_token: d.access_token, refresh_token: d.refresh_token, expires_at: d.expires_at, user: { id: d.user.id } }));
  return JSON.parse(ls.get(SESS));
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
