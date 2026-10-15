// The lobby's account button and panel: log in / sign up with email + password (no confirmation email),
// forgot password (a reset link mailed back to this page), change password, switch account, log out.
import * as cloud from './save.js?v=3';

const TEXT = {
  zh: {
    login: '登入', guest: '訪客', loginTitle: '登入帳號', signupTitle: '建立帳號', forgotTitle: '忘記密碼', accountTitle: '我的帳號', newpwTitle: '設定新密碼',
    email: 'Email', password: '密碼', password2: '再輸入一次密碼', newPassword: '新密碼', doLogin: '登入', doSignup: '建立帳號', doForgot: '寄出重設密碼信', doNewpw: '更新密碼',
    toSignup: '還沒有帳號？建立一個', toLogin: '已經有帳號？登入', toForgot: '忘記密碼？', changePw: '變更密碼', switchAcct: '切換帳號', logout: '登出', cancel: '取消', close: '關閉',
    loginNote: '登入後，這台裝置的遊戲進度會換成帳號裡的進度。',
    signupNote: '不用收信驗證。這個 Email 用來在忘記密碼時寄重設信。現在這台裝置的遊戲進度會直接存進新帳號。',
    forgotNote: '輸入註冊時的 Email，我們會寄一封重設密碼的信給你，點信裡的連結回到這裡設定新密碼。',
    accountNote: '遊戲進度會自動存到這個帳號，在別台裝置登入同一個帳號就能接著玩。',
    guestNote: '你現在是訪客：進度只存在這個瀏覽器裡。登入或建立帳號，就能在每台裝置接著玩。',
    logoutAsk: '登出後，這台裝置會變回訪客，畫面上的遊戲進度會清掉；進度仍保存在帳號裡，重新登入就會回來。確定要登出嗎？',
    mismatch: '兩次輸入的密碼不一樣', short: '密碼至少要 6 個字', badEmail: 'Email 格式不對',
    sent: '已寄出！請到 {e} 收信（也看看垃圾郵件匣）。', pwDone: '密碼已更新！', welcome: '登入成功：{e}', created: '帳號建立好了：{e}', loggedOut: '已登出',
    linkBad: '重設密碼的連結無效或已過期，請重新寄一次。',
    err: { invalid_credentials: 'Email 或密碼錯誤', user_already_exists: '這個 Email 已經註冊過了，請直接登入', email_exists: '這個 Email 已經註冊過了，請直接登入', weak_password: '密碼至少要 6 個字',
      email_address_invalid: 'Email 格式不對', validation_failed: 'Email 或密碼格式不對', over_email_send_rate_limit: '寄信太頻繁了，請過一陣子再試', over_request_rate_limit: '嘗試太多次了，請稍後再試',
      same_password: '新密碼不能和舊密碼一樣', email_address_not_authorized: '目前的寄信服務無法寄到這個 Email（請網站管理者設定 SMTP）', network: '連不上伺服器，請檢查網路' }
  },
  en: {
    login: 'Log in', guest: 'Guest', loginTitle: 'Log in', signupTitle: 'Create an account', forgotTitle: 'Forgot password', accountTitle: 'My account', newpwTitle: 'Set a new password',
    email: 'Email', password: 'Password', password2: 'Password again', newPassword: 'New password', doLogin: 'Log in', doSignup: 'Create account', doForgot: 'Send reset email', doNewpw: 'Update password',
    toSignup: 'No account yet? Create one', toLogin: 'Already have an account? Log in', toForgot: 'Forgot password?', changePw: 'Change password', switchAcct: 'Switch account', logout: 'Log out', cancel: 'Cancel', close: 'Close',
    loginNote: "After logging in, this device's game progress is replaced by the account's progress.",
    signupNote: "No confirmation email needed. The email is used to send a reset link if you forget your password. This device's current game progress goes straight into the new account.",
    forgotNote: "Enter the email you signed up with. We'll send a reset link; open it to come back here and choose a new password.",
    accountNote: 'Your game progress is saved to this account automatically. Log in on another device to keep playing there.',
    guestNote: 'You are a guest: progress is only kept in this browser. Log in or create an account to continue on any device.',
    logoutAsk: 'After logging out this device becomes a guest and the game progress shown here is cleared. It stays saved in your account and comes back when you log in again. Log out?',
    mismatch: "The passwords don't match", short: 'The password needs at least 6 characters', badEmail: "That email doesn't look right",
    sent: 'Sent! Check {e} (and the spam folder).', pwDone: 'Password updated!', welcome: 'Logged in: {e}', created: 'Account created: {e}', loggedOut: 'Logged out',
    linkBad: 'The reset link is invalid or has expired. Please send a new one.',
    err: { invalid_credentials: 'Wrong email or password', user_already_exists: 'This email already has an account. Please log in', email_exists: 'This email already has an account. Please log in', weak_password: 'The password needs at least 6 characters',
      email_address_invalid: "That email doesn't look right", validation_failed: 'Please check the email and password', over_email_send_rate_limit: 'Too many emails. Please try again later', over_request_rate_limit: 'Too many tries. Please try again later',
      same_password: 'The new password must be different', email_address_not_authorized: "The mail service can't send to this address yet (the site owner needs to set up SMTP)", network: "Can't reach the server. Check your connection" }
  }
};
const lang = () => { try { return JSON.parse(localStorage.getItem('hub.lang')) === 'en' ? 'en' : 'zh'; } catch (e) { return 'zh'; } };
const T = (k, v) => String(TEXT[lang()][k] ?? k).replace(/\{(\w+)\}/g, (m, x) => (v && v[x] != null ? v[x] : m));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const errText = (e) => (e instanceof TypeError ? TEXT[lang()].err.network : TEXT[lang()].err[e.code] || e.message);
const okEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// ---------- the header button ----------
const btn = document.createElement('button');
btn.type = 'button'; btn.id = 'acct'; btn.className = 'pill acct';
document.getElementById('me').before(btn);
function renderBtn() {
  const a = cloud.account();
  btn.classList.toggle('in', !!(a && a.email));
  btn.textContent = a && a.email ? '☁️ ' + a.email.split('@')[0] : '🔑 ' + T('login');
  btn.title = a && a.email ? a.email : T('guestNote');
}

// ---------- the panel ----------
const box = document.createElement('div');
box.className = 'modal'; box.id = 'acctbox'; box.hidden = true;
box.innerHTML = '<form class="sheet small acctsheet" novalidate></form>';
document.body.appendChild(box);
const form = box.querySelector('form');
let view = 'login', msg = null, busy = false, email = '';

const field = (name, type, label, auto) => `<label class="af"><span>${T(label)}</span><input name="${name}" type="${type}" autocomplete="${auto}" ${name === 'email' ? `value="${esc(email)}"` : ''} required></label>`;
const link = (to, label) => `<button type="button" class="alink" data-to="${to}">${T(label)}</button>`;
function render() {
  const a = cloud.account();
  let h = '';
  if (view === 'account' && a && a.email) {
    h = `<h3>${T('accountTitle')}</h3><p class="acct-id">☁️ <b>${esc(a.email)}</b></p><p class="anote">${T('accountNote')}</p>
      <div class="acol"><button type="button" class="pill" data-to="newpw">🔒 ${T('changePw')}</button>
      <button type="button" class="pill" data-act="switch">🔄 ${T('switchAcct')}</button>
      <button type="button" class="pill danger" data-act="logout">🚪 ${T('logout')}</button></div>`;
  } else if (view === 'signup') {
    h = `<h3>${T('signupTitle')}</h3>${field('email', 'email', 'email', 'email')}${field('pw', 'password', 'password', 'new-password')}${field('pw2', 'password', 'password2', 'new-password')}
      <p class="anote">${T('signupNote')}</p><button class="play" type="submit">${T('doSignup')}</button><div class="alinks">${link('login', 'toLogin')}</div>`;
  } else if (view === 'forgot') {
    h = `<h3>${T('forgotTitle')}</h3><p class="anote">${T('forgotNote')}</p>${field('email', 'email', 'email', 'email')}
      <button class="play" type="submit">${T('doForgot')}</button><div class="alinks">${link('login', 'toLogin')}</div>`;
  } else if (view === 'newpw') {
    h = `<h3>${T('newpwTitle')}</h3>${a && a.email ? `<p class="acct-id">☁️ <b>${esc(a.email)}</b></p>` : ''}${field('pw', 'password', 'newPassword', 'new-password')}${field('pw2', 'password', 'password2', 'new-password')}
      <button class="play" type="submit">${T('doNewpw')}</button><div class="alinks">${a && a.email ? link('account', 'cancel') : ''}</div>`;
  } else {
    view = 'login';
    h = `<h3>${T('loginTitle')}</h3>${a && a.email ? '' : `<p class="anote">${T('guestNote')}</p>`}${field('email', 'email', 'email', 'username')}${field('pw', 'password', 'password', 'current-password')}
      <p class="anote">${T('loginNote')}</p><button class="play" type="submit">${T('doLogin')}</button>
      <div class="alinks">${link('forgot', 'toForgot')}${link('signup', 'toSignup')}</div>`;
  }
  form.innerHTML = `<button type="button" class="x" data-act="close" aria-label="${T('close')}">×</button>${h}` + (msg ? `<p class="amsg ${msg.ok ? 'ok' : 'bad'}">${esc(msg.text)}</p>` : '');
  form.querySelectorAll('button').forEach((b) => { if (b.dataset.act !== 'close') b.disabled = busy; });
}
function open(v, m = null) {
  const a = cloud.account();
  view = v || (a && a.email ? 'account' : 'login'); msg = m; box.hidden = false; render();
  const first = form.querySelector('input'); if (first) first.focus();
}
const close = () => { box.hidden = true; msg = null; };
async function run(fn) {
  busy = true; msg = null; render();
  try { await fn(); } catch (e) { msg = { ok: false, text: errText(e) }; }
  busy = false; render(); renderBtn();
}

form.addEventListener('submit', (e) => {
  e.preventDefault(); if (busy) return;
  const v = (n) => (form.elements[n] ? form.elements[n].value : '');
  if (form.elements.email) email = v('email').trim();
  const bad = (k) => { msg = { ok: false, text: T(k) }; render(); };
  if (form.elements.email && !okEmail(email)) return bad('badEmail');
  if (form.elements.pw && v('pw').length < 6) return bad('short');
  if (form.elements.pw2 && v('pw') !== v('pw2')) return bad('mismatch');
  const pw = v('pw');                      // read now: run() redraws the form (and its inputs) before the request
  if (view === 'login') run(async () => { const a = await cloud.logIn(email, pw); view = 'account'; msg = { ok: true, text: T('welcome', { e: a.email }) }; });
  else if (view === 'signup') run(async () => { const a = await cloud.signUp(email, pw); view = 'account'; msg = { ok: true, text: T('created', { e: a.email }) }; });
  else if (view === 'forgot') run(async () => { await cloud.resetPassword(email, location.origin + location.pathname); msg = { ok: true, text: T('sent', { e: email }) }; });
  else if (view === 'newpw') run(async () => { await cloud.setPassword(pw); view = 'account'; msg = { ok: true, text: T('pwDone') }; });
});
form.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b || busy) return;
  if (b.dataset.to) { view = b.dataset.to; msg = null; render(); const f = form.querySelector('input'); if (f) f.focus(); }
  else if (b.dataset.act === 'close') close();
  else if (b.dataset.act === 'logout' && confirm(T('logoutAsk'))) run(async () => { await cloud.logOut(); view = 'login'; msg = { ok: true, text: T('loggedOut') }; });
  else if (b.dataset.act === 'switch' && confirm(T('logoutAsk'))) run(async () => { await cloud.logOut(); view = 'login'; });
});
box.addEventListener('click', (e) => { if (e.target === box && !busy) close(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !box.hidden && !busy) close(); });
btn.addEventListener('click', () => open());
document.getElementById('lang').addEventListener('click', () => { renderBtn(); if (!box.hidden) render(); });

// ---------- coming back from the password-reset email ----------
renderBtn();
if (/access_token=|error_description=/.test(location.hash)) {
  const hash = location.hash;
  history.replaceState(null, '', location.pathname + location.search);
  cloud.fromLink(hash).then((r) => {
    renderBtn();
    if (r === 'recovery') open('newpw');
    else if (r && r.startsWith('error:')) open('forgot', { ok: false, text: T('linkBad') });
    else if (r) open('account');
  }).catch((e) => open('forgot', { ok: false, text: errText(e) }));
}
window.__acct = { open, cloud };
