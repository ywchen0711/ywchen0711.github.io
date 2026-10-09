/*
 * The game list. To add a game: add an entry here and put a 16:9 picture in thumbs/ (960x540 is nice).
 *   id        short name, used in the address (#play/id) and for favorites / recently played
 *   url       where the game lives (a path on this site, like /my-game/, or a full https:// address)
 *   genres    any of: rpg, platformer, horror, strategy, sports, action, puzzle (see GENRES in app.js)
 *   devices   'keyboard' and/or 'touch'
 *   players   e.g. '1' or '1-2'
 *   added     'YYYY-MM-DD' — games added in the last 7 days get a NEW badge
 *   title / tagline / about / controls — { zh: '...', en: '...' }
 */
window.GAMES = [
  {
    id: 'rpg',
    url: '/josh-jasper-rpg/',
    thumb: 'thumbs/rpg.jpg',
    color: '#5aa8f0',
    genres: ['rpg'],
    devices: ['keyboard', 'touch'],
    players: '1',
    added: '2026-10-09',
    title:    { zh: 'Josh & Jasper 大冒險', en: 'Josh & Jasper RPG' },
    tagline:  { zh: '郊狼獎盃不見了！和弟弟、柴犬麻糬還有好朋友們一起把它找回來。', en: 'The Coyote Cup is missing! Team up with your brother, a shiba pup and friends to get it back.' },
    about:    { zh: '回合制 RPG。走遍 Carmel Valley 社區、Sage Canyon 小學、峽谷步道和浣熊洞窟，收集夥伴、道具和技能，打倒浣熊大王。第一章完整版，中英文都能玩。',
                en: 'A turn-based RPG. Explore Carmel Valley, Sage Canyon School, the canyon trail and the raccoon cave, gather friends, items and skills, and defeat the Raccoon King. Chapter 1 is complete, in Chinese and English.' },
    controls: { zh: '方向鍵移動 · Z 確定／對話 · X 取消 · C 選單', en: 'Arrows move · Z confirm/talk · X cancel · C menu' }
  },
  {
    id: 'coyote',
    url: '/josh-and-jasper/',
    thumb: 'thumbs/coyote.jpg',
    color: '#e8a040',
    genres: ['platformer', 'action'],
    devices: ['keyboard'],
    players: '1-2',
    added: '2026-10-02',
    title:    { zh: 'Josh & Jasper：郊狼小徑', en: 'Josh & Jasper: Coyote Trail' },
    tagline:  { zh: '兄弟倆的橫向捲軸冒險，可以兩個人一起玩！', en: 'A side-scrolling adventure for two brothers. Play together!' },
    about:    { zh: '在 Sage Canyon 小學和峽谷裡跑跳、爬梯子、丟東西，躲開刺蝟和老鷹。一個人玩或兩個人同一台電腦一起玩。',
                en: 'Run, jump, climb and throw your way through Sage Canyon School and the canyon. Play solo, or two players on one keyboard.' },
    controls: { zh: 'Josh：A/D 移動 W 跳 F 丟 · Jasper：← → 移動 ↑ 跳 / 丟', en: 'Josh: A/D move, W jump, F throw · Jasper: ←/→ move, ↑ jump, / throw' }
  },
  {
    id: 'hush',
    url: '/hush/',
    thumb: 'thumbs/hush.jpg',
    color: '#8a7a5a',
    genres: ['horror', 'puzzle'],
    devices: ['keyboard'],
    players: '1',
    added: '2026-10-04',
    title:    { zh: 'HUSH 噤聲', en: 'HUSH' },
    tagline:  { zh: '五十個房間，屋子裡有東西在聽。戴上耳機。', en: 'Fifty rooms. Something in this house is listening. Wear headphones.' },
    about:    { zh: '第一人稱密室逃脫恐怖遊戲。每次的房間都不一樣，每種怪物都有自己的規則，要靠聽聲音和反應才能活著出去。建議用電腦和耳機玩。',
                en: 'A first-person escape horror game. The rooms change every run and every creature has its own rules: listen carefully and react fast. Best on a computer with headphones.' },
    controls: { zh: 'WASD 移動 · 滑鼠看 · Shift 跑 · C 蹲 · E 使用／躲 · F 手電筒', en: 'WASD move · mouse look · Shift run · C crouch · E use/hide · F flashlight' }
  },
  {
    id: 'sango',
    url: '/Sango/',
    thumb: 'thumbs/sango.jpg',
    color: '#c84a3a',
    genres: ['strategy', 'action'],
    devices: ['keyboard', 'touch'],
    players: '1',
    added: '2026-09-20',
    title:    { zh: '三國志 霸王之路', en: 'Three Kingdoms: Path of the Hegemon' },
    tagline:  { zh: '建立你的武將，帶兵出征，一路打到虎牢關！', en: 'Create your general, lead your army and fight all the way to Hulao Pass!' },
    about:    { zh: '霸王的大陸風格的三國戰爭遊戲。分配能力、招募士兵、在酒館找夥伴，用戰術和必殺技贏得一場場會戰，還能探索洞窟和迷宮。',
                en: 'A Three Kingdoms war game in the style of the classic. Build your general, recruit soldiers and companions, and win battles with tactics and special moves. Explore caves and mazes too.' },
    controls: { zh: '滑鼠點選 · 戰鬥中用按鈕下指令', en: 'Click to play · use the buttons to give orders in battle' }
  },
  {
    id: 'baseball',
    url: '/game/',
    thumb: 'thumbs/baseball.jpg',
    color: '#2e9a3e',
    genres: ['sports', 'strategy'],
    devices: ['keyboard', 'touch'],
    players: '1',
    added: '2026-09-01',
    title:    { zh: '像素職棒模擬', en: 'Pixel Baseball Sim' },
    tagline:  { zh: '能力值驅動的職棒比賽模擬，看你的球隊一球一球打下去。', en: 'A stat-driven pro baseball simulator. Watch your team play it out pitch by pitch.' },
    about:    { zh: '每位球員都有自己的能力值，比賽一球一球模擬，有文字轉播、比賽數據和球員名單。可以調整速度或直接模擬到結束。',
                en: 'Every player has their own ratings and every pitch is simulated, with play-by-play, box scores and rosters. Change the speed or sim straight to the end.' },
    controls: { zh: '滑鼠點選「開始比賽」', en: 'Click "Start game"' }
  }
];
