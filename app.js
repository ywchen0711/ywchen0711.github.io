/*
 * The lobby: lists the games from games.js, remembers favorites / recently played / play counts on this device,
 * and plays a game inside the page with a "back to lobby" button.
 * Address: #game/<id> shows a game's details, #play/<id> plays it (so the browser's back button returns to the lobby).
 */
(function () {
  'use strict';
  var GAMES = window.GAMES || [];
  var SITE = 'https://ywchen0711.github.io';
  var GENRES = ['rpg', 'platformer', 'action', 'horror', 'puzzle', 'strategy', 'sports', 'learning'];
  var GENRE_COLOR = { rpg: '#5b5bd6', platformer: '#e8913a', action: '#e0565b', horror: '#7a6a8a', puzzle: '#2aa3a3', strategy: '#c0533a', sports: '#2e9a3e', learning: '#2f6fde' };
  var AVATAR_COLORS = ['#5b5bd6', '#12b76a', '#ff5c86', '#f59e0b', '#06b6d4', '#8b5cf6', '#ef4444', '#64748b'];

  var TEXT = {
    zh: {
      brand: '像素遊樂場', search: '搜尋遊戲…', lang: 'EN', recent: '繼續玩', favorites: '我的最愛', all: '所有遊戲', nothing: '找不到遊戲 😢',
      footer: '由 ywchen0711 製作的瀏覽器遊戲', howto: '怎麼玩：', play: '開始玩', newtab: '在新分頁開啟', back: '回到大廳',
      reload: '重新載入', fullscreen: '全螢幕', yourName: '你的名字', save: '好了！', guest: '玩家', isNew: '新遊戲！',
      featured: '精選遊戲', lab: '小遊戲實驗室', labNote: '早期的小實驗，簡單但好玩！', played: '玩過 {n} 次', never: '還沒玩過', lastPlayed: '上次玩：{d}', players: '{n} 人',
      today: '今天', daysAgo: '{n} 天前', touch: '手機可玩', keyboard: '鍵盤', resultsFor: '「{q}」的搜尋結果', everything: '全部',
      genre: { rpg: 'RPG', platformer: '平台跳躍', action: '動作', horror: '恐怖', puzzle: '解謎', strategy: '策略', sports: '運動', learning: '學習' },
      hi: '嗨，{name}！'
    },
    en: {
      brand: 'Pixel Playground', search: 'Search games…', lang: '中文', recent: 'Continue playing', favorites: 'Favorites', all: 'All games', nothing: 'No games found 😢',
      footer: 'Browser games made by ywchen0711', howto: 'How to play:', play: 'Play', newtab: 'Open in new tab', back: 'Lobby',
      reload: 'Reload', fullscreen: 'Fullscreen', yourName: 'Your name', save: 'Done!', guest: 'Player', isNew: 'NEW!',
      featured: 'Featured', lab: 'Mini-Game Lab', labNote: 'Early little experiments. Simple, but fun!', played: 'Played {n}×', never: 'Not played yet', lastPlayed: 'Last played: {d}', players: '{n} players',
      today: 'today', daysAgo: '{n} days ago', touch: 'Touch OK', keyboard: 'Keyboard', resultsFor: 'Results for "{q}"', everything: 'All',
      genre: { rpg: 'RPG', platformer: 'Platformer', action: 'Action', horror: 'Horror', puzzle: 'Puzzle', strategy: 'Strategy', sports: 'Sports', learning: 'Learning' },
      hi: 'Hi, {name}!'
    }
  };

  // ---------- saved on this device ----------
  function load(k, d) { try { var v = localStorage.getItem('hub.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem('hub.' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  var state = {
    lang: load('lang', /^zh/i.test(navigator.language || 'zh') ? 'zh' : 'en'),
    name: load('name', ''), color: load('color', AVATAR_COLORS[0]),
    favs: load('favs', []), recent: load('recent', []), plays: load('plays', {}),
    genre: 'all', q: ''
  };

  var $ = function (id) { return document.getElementById(id); };
  function t(key, vars) {
    var v = key.split('.').reduce(function (o, k) { return o && o[k]; }, TEXT[state.lang]);
    if (v == null) v = key;
    return String(v).replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? vars[k] : m; });
  }
  function L(obj) { return obj ? obj[state.lang] || obj.zh || obj.en : ''; }
  function byId(id) { return GAMES.filter(function (g) { return g.id === id; })[0]; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function isNew(g) { return g.added && (Date.now() - Date.parse(g.added)) / 864e5 < 7; }
  function gameUrl(g) {                                // on the real site paths work as-is; elsewhere (testing) point at the site
    if (/^https?:/.test(g.url)) return g.url;
    var u = location.hostname === 'ywchen0711.github.io' ? g.url : SITE + g.url;
    return u + (u.indexOf('?') < 0 ? '?' : '&') + '_=' + Date.now();   // skip the browser's cached page so updates show at once
  }
  function ago(ts) { var d = Math.floor((Date.now() - ts) / 864e5); return d < 1 ? t('today') : t('daysAgo', { n: d }); }

  // ---------- drawing the lobby ----------
  function card(g) {
    var fav = state.favs.indexOf(g.id) >= 0, n = state.plays[g.id] || 0;
    return '<article class="card" tabindex="0" data-open="' + g.id + '" style="--c:' + g.color + '">' +
      '<div class="thumb">' + art(g) + '<div class="go"><span></span></div>' +
      (isNew(g) ? '<span class="new">' + t('isNew') + '</span>' : '') +
      '<button class="heart' + (fav ? ' on' : '') + '" data-fav="' + g.id + '" aria-label="favorite" type="button">' + (fav ? '♥' : '♡') + '</button></div>' +
      '<div class="meta"><h4>' + esc(L(g.title)) + '</h4><div class="line">' +
      g.genres.slice(0, 2).map(function (x) { return '<span class="tag" style="--c:' + GENRE_COLOR[x] + '">' + t('genre.' + x) + '</span>'; }).join('') +
      '<span>' + (n ? t('played', { n: n }) : '') + '</span></div></div></article>';
  }
  // a picture, or for lab games a colorful tile with a big icon
  function art(g) {
    return g.thumb ? '<img src="' + g.thumb + '" alt="" loading="lazy">' : '<div class="icon-art" style="--c:' + g.color + '"><span>' + g.icon + '</span></div>';
  }
  function matches(g) {
    if (state.genre !== 'all' && g.genres.indexOf(state.genre) < 0) return false;
    if (!state.q) return true;
    var hay = [g.title.zh, g.title.en, g.tagline.zh, g.tagline.en, g.genres.map(function (x) { return TEXT.zh.genre[x] + ' ' + TEXT.en.genre[x]; }).join(' ')].join(' ').toLowerCase();
    return state.q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
  }
  function renderStatic() {
    document.documentElement.lang = state.lang === 'zh' ? 'zh-Hant' : 'en';
    document.title = t('brand') + ' · ' + (state.lang === 'zh' ? 'Pixel Playground' : '像素遊樂場');
    document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = t(el.getAttribute('data-t')); });
    document.querySelectorAll('[data-title]').forEach(function (el) { el.title = t(el.getAttribute('data-title')); el.setAttribute('aria-label', el.title); });
    $('q').placeholder = t('search');
    $('lang').textContent = t('lang');
    $('myname').textContent = state.name || t('guest');
    var av = $('avatar'); av.textContent = (state.name || t('guest')).trim().charAt(0).toUpperCase(); av.style.background = state.color;
  }
  function renderChips() {
    var used = GENRES.filter(function (x) { return GAMES.some(function (g) { return g.genres.indexOf(x) >= 0; }); });
    $('chips').innerHTML = ['all'].concat(used).map(function (x) {
      return '<button type="button" data-genre="' + x + '" class="' + (state.genre === x ? 'on' : '') + '">' + (x === 'all' ? t('everything') : t('genre.' + x)) + '</button>';
    }).join('');
  }
  function renderRows() {
    var list = GAMES.filter(matches), main = state.q ? list : list.filter(function (g) { return !g.lab; }), lab = list.filter(function (g) { return g.lab; });
    $('grid').innerHTML = main.map(card).join('');
    $('empty').hidden = list.length > 0;
    $('row-lab').hidden = !lab.length || !!state.q;
    $('lab').innerHTML = lab.map(card).join('');
    $('all-title').textContent = state.q ? t('resultsFor', { q: state.q }) : state.genre === 'all' ? t('all') : t('genre.' + state.genre);
    var recent = state.recent.map(function (r) { return byId(r.id); }).filter(Boolean);
    $('row-recent').hidden = !recent.length || !!state.q;
    $('recent').innerHTML = recent.map(card).join('');
    var favs = state.favs.map(byId).filter(Boolean);
    $('row-fav').hidden = !favs.length || !!state.q;
    $('favs').innerHTML = favs.map(card).join('');
  }

  // featured banner: the newest games take turns
  var heroIdx = 0, heroTimer = null;
  function renderHero() {
    var list = GAMES.filter(function (g) { return !g.lab; }).sort(function (a, b) { return (b.added || '').localeCompare(a.added || ''); }).slice(0, 4);
    $('hero').innerHTML = list.map(function (g, i) {
      return '<div class="slide' + (i === heroIdx ? ' on' : '') + '" style="--c:' + g.color + '"><div class="art"><img src="' + g.thumb + '" alt=""></div>' +
        '<div class="info"><span class="badge">' + (isNew(g) ? t('isNew') : t('featured')) + '</span><h1>' + esc(L(g.title)) + '</h1><p>' + esc(L(g.tagline)) + '</p>' +
        '<button class="play big" type="button" data-play="' + g.id + '">' + t('play') + '</button></div></div>';
    }).join('') + '<div class="dots">' + list.map(function (g, i) { return '<button type="button" data-dot="' + i + '" class="' + (i === heroIdx ? 'on' : '') + '" aria-label="' + esc(L(g.title)) + '"></button>'; }).join('') + '</div>';
    clearInterval(heroTimer);
    heroTimer = setInterval(function () { if (!document.hidden && $('player').hidden) showSlide((heroIdx + 1) % list.length); }, 6500);
  }
  function showSlide(i) {
    heroIdx = i;
    document.querySelectorAll('.slide').forEach(function (s, k) { s.classList.toggle('on', k === i); });
    document.querySelectorAll('.dots button').forEach(function (s, k) { s.classList.toggle('on', k === i); });
  }
  function renderAll() { renderStatic(); renderHero(); renderChips(); renderRows(); }

  // ---------- details ----------
  function openDetails(g) {
    $('m-art').style.backgroundImage = g.thumb ? 'url(' + g.thumb + ')' : 'none';
    $('m-art').innerHTML = g.thumb ? '' : art(g);
    $('m-title').textContent = L(g.title);
    $('m-tags').innerHTML = g.genres.map(function (x) { return '<span class="tag" style="--c:' + GENRE_COLOR[x] + '">' + t('genre.' + x) + '</span>'; }).join('') +
      '<span class="tag">' + t('players', { n: g.players }) + '</span>' +
      '<span class="tag">' + (g.devices.indexOf('touch') >= 0 ? t('touch') : t('keyboard')) + '</span>';
    $('m-about').textContent = L(g.about);
    $('m-controls').textContent = L(g.controls);
    $('m-play').textContent = t('play'); $('m-play').setAttribute('data-play', g.id);
    var fav = state.favs.indexOf(g.id) >= 0;
    $('m-fav').textContent = fav ? '♥' : '♡'; $('m-fav').className = 'heart' + (fav ? ' on' : ''); $('m-fav').setAttribute('data-fav', g.id);
    $('m-tab').href = gameUrl(g);
    var n = state.plays[g.id] || 0, last = state.recent.filter(function (r) { return r.id === g.id; })[0];
    $('m-stat').textContent = (n ? t('played', { n: n }) : t('never')) + (last ? ' · ' + t('lastPlayed', { d: ago(last.t) }) : '');
    $('modal').hidden = false;
    $('m-play').focus();
  }

  // ---------- playing ----------
  var playing = null, openedFromLobby = false;
  function startGame(g) {
    playing = g;
    $('modal').hidden = true;
    state.plays[g.id] = (state.plays[g.id] || 0) + 1; save('plays', state.plays);
    state.recent = [{ id: g.id, t: Date.now() }].concat(state.recent.filter(function (r) { return r.id !== g.id; })).slice(0, 8); save('recent', state.recent);
    $('now').textContent = L(g.title);
    var f = $('frame');
    f.src = gameUrl(g);
    $('player').hidden = false;
    document.body.style.overflow = 'hidden';
    $('back').focus();
  }
  function stopGame() {
    if (!playing) return;
    playing = null;
    $('frame').src = 'about:blank';                    // stops the game's music and timers
    $('player').hidden = true;
    document.body.style.overflow = '';
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    renderRows();
  }
  $('frame').addEventListener('load', function () { try { if (playing) $('frame').contentWindow.focus(); } catch (e) { /* other site */ } });

  // ---------- the address decides what is on screen ----------
  function route() {
    var m = /^#(play|game)\/([\w-]+)/.exec(location.hash), g = m && byId(m[2]);
    if (g && m[1] === 'play') { if (!playing || playing.id !== g.id) startGame(g); return; }
    stopGame();
    if (g && m[1] === 'game') openDetails(g); else $('modal').hidden = true;
  }
  function go(hash) { openedFromLobby = true; location.hash = hash; }
  function home() {
    if (openedFromLobby && history.length > 1) { openedFromLobby = false; history.back(); }
    else location.hash = '';
  }
  window.addEventListener('hashchange', route);

  // ---------- clicks ----------
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-fav],[data-play],[data-open],[data-genre],[data-dot],[data-home]');
    if (!el) return;
    if (el.hasAttribute('data-fav')) {
      e.stopPropagation();
      var id = el.getAttribute('data-fav'), i = state.favs.indexOf(id);
      if (i >= 0) state.favs.splice(i, 1); else state.favs.unshift(id);
      save('favs', state.favs); renderRows();
      if (!$('modal').hidden) openDetails(byId(id));
    } else if (el.hasAttribute('data-play')) go('#play/' + el.getAttribute('data-play'));
    else if (el.hasAttribute('data-open')) go('#game/' + el.getAttribute('data-open'));
    else if (el.hasAttribute('data-genre')) { state.genre = el.getAttribute('data-genre'); renderChips(); renderRows(); }
    else if (el.hasAttribute('data-dot')) showSlide(+el.getAttribute('data-dot'));
    else if (el.hasAttribute('data-home')) { e.preventDefault(); location.hash = ''; window.scrollTo(0, 0); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.matches && e.target.matches('.card')) go('#game/' + e.target.getAttribute('data-open'));
    if (e.key === 'Escape' && !$('modal').hidden) home();
  });
  $('modal').addEventListener('click', function (e) { if (e.target === $('modal')) home(); });
  $('modal-x').addEventListener('click', home);
  $('back').addEventListener('click', home);
  $('reload').addEventListener('click', function () { if (playing) $('frame').src = gameUrl(playing); });
  $('full').addEventListener('click', function () {
    if (document.fullscreenElement) document.exitFullscreen(); else $('player').requestFullscreen().catch(function () {});
  });
  $('q').addEventListener('input', function () { state.q = this.value.trim(); renderRows(); });
  $('lang').addEventListener('click', function () { state.lang = state.lang === 'zh' ? 'en' : 'zh'; save('lang', state.lang); renderAll(); if (playing) $('now').textContent = L(playing.title); });

  // ---------- your name and avatar color ----------
  $('me').addEventListener('click', function () {
    $('nameinput').value = state.name;
    $('colors').innerHTML = AVATAR_COLORS.map(function (c) { return '<button type="button" data-color="' + c + '" style="background:' + c + '" class="' + (c === state.color ? 'on' : '') + '" aria-label="' + c + '"></button>'; }).join('');
    $('namebox').hidden = false; $('nameinput').focus();
  });
  $('colors').addEventListener('click', function (e) {
    var c = e.target.getAttribute('data-color'); if (!c) return;
    state.color = c; this.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b === e.target); });
  });
  $('nameform').addEventListener('submit', function (e) {
    e.preventDefault();
    state.name = $('nameinput').value.trim().slice(0, 16); save('name', state.name); save('color', state.color);
    $('namebox').hidden = true; renderStatic();
  });
  $('namebox').addEventListener('click', function (e) { if (e.target === $('namebox')) $('namebox').hidden = true; });

  renderAll();
  route();
})();
