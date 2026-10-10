/*
 * The game list. To add a game: add an entry here and put a 16:9 picture in thumbs/ (960x540 is nice).
 *   id        short name, used in the address (#play/id) and for favorites / recently played
 *   url       where the game lives (a path on this site, like /my-game/, or a full https:// address)
 *   genres    any of: rpg, platformer, horror, strategy, sports, action, puzzle, learning (see GENRES in app.js)
 *   devices   'keyboard' and/or 'touch'
 *   players   e.g. '1' or '1-2'
 *   added     'YYYY-MM-DD' — games added in the last 7 days get a NEW badge
 *   title / tagline / about / controls — { zh: '...', en: '...' }
 *   lab: true + icon: '🎮'  — a small experiment: shown in the "Mini-Game Lab" row with a colorful icon instead of a picture
 */
window.GAMES = [
  {
    id: 'coaster',
    url: '/coaster-builder/',
    thumb: 'thumbs/coaster.jpg?v=1',
    color: '#3a7aff',
    genres: ['sim', 'learning'],
    devices: ['keyboard', 'touch'],
    players: '1',
    added: '2026-10-10',
    title:    { zh: '雲霄飛車設計師', en: 'Coaster Builder' },
    tagline:  { zh: '一段一段蓋出自己的 3D 雲霄飛車，再坐上去試乘：迴圈、失重、G 力都照物理算。', en: 'Build your own 3D roller coaster piece by piece, then ride it: loops, airtime and G-forces follow real physics.' },
    about:    { zh: '從車站出發，用直線、上下坡、彎道、迴圈、加速器、煞車和鏈條爬坡蓋軌道，最後接回車站（也可以按「自動接回車站」）。試乘時車子照能量和摩擦力跑，爬不上去就會卡住；可以切換車頭視角。結束後會算出刺激度、強度、噁心度，坐在前面的四位超級玩家 Josh Chen（愛速度）、Jasper Chen（愛翻轉）、Jeff Chen（愛失重）、Erin Lai（愛舒服）會大叫、給星星和評語，完成他們的挑戰還能拿徽章。',
                en: 'Start at the station and lay straights, slopes, turns, loops, boosters, brakes and chain lifts, then connect back to the station (or press Auto-finish). The test ride runs on energy and friction, so a train can get stuck on a hill; try the front-seat view. Afterwards you get excitement, intensity and nausea, and the four super users in the front cars, Josh Chen (speed), Jasper Chen (loops), Jeff Chen (airtime) and Erin Lai (smooth rides), shout, give stars and comments. Beat their challenges for badges.' },
    controls: { zh: '點軌道按鈕蓋軌道 · 拖曳轉視角、滾輪縮放 · Backspace 拆掉上一段 · Enter 試乘', en: 'Click the track buttons to build · drag to look, wheel to zoom · Backspace removes the last piece · Enter rides' }
  },
  {
    id: 'fruits',
    url: '/find-the-fruits/',
    thumb: 'thumbs/find-the-fruits.jpg?v=1',
    color: '#ff5a7a',
    genres: ['platformer', 'puzzle'],
    devices: ['keyboard', 'touch'],
    players: '1',
    added: '2026-10-10',
    title:    { zh: '尋找水果！', en: 'Find the Fruits!' },
    tagline:  { zh: '像 Roblox 的尋寶遊戲：在六個 3D 世界找出 40 顆水果和 10 種速食，每個都有徽章。', en: 'A Roblox-style treasure hunt: find 40 fruits and 10 fast foods across six 3D worlds and earn a badge for each.' },
    about:    { zh: '從水果廣場出發，穿過傳送門到熱帶島嶼、冰雪山峰、糖果廚房、天空神殿和藏著速食的速食街。有的水果就在眼前，有的要爬梯子、跑酷（岩漿、會消失的方塊、移動平台、旋轉棒、滑溜的冰），有的要解謎：找鑰匙、破解密碼、按對按鈕順序、趕在限時的門關上前衝進去，或發現假牆和看不見的路。難度從簡單到不可能，圖鑑裡每顆水果都有提示，進度會自動存檔。可以選 Josh、Jasper、Jeff、Erin 或 Noob 當角色。',
                en: 'Start in Fruit Plaza and take the portals to Tropical Island, Frosty Peaks, Candy Kitchen, Sky Temple and Fast Food Street, where fast foods hide instead of fruit. Some fruits sit in plain sight; others need climbing and parkour (lava, vanishing blocks, moving platforms, spinning bars, slippery ice) or a puzzle: a key, a secret code, a colour sequence, a timed door, fake walls and invisible paths. Difficulty runs from Easy to Impossible, the Fruit Book has a hint for every fruit, and progress saves automatically. Play as Josh, Jasper, Jeff, Erin or a Noob.' },
    controls: { zh: 'WASD / 方向鍵移動 · 空白鍵跳 · 拖曳或 Q / E 轉視角 · B 圖鑑 · 手機：搖桿、跳躍鍵、⟲ ⟳ 轉視角按鈕', en: 'WASD / arrows to move · Space to jump · drag or Q / E to look · B for the book · phone: stick, jump and ⟲ ⟳ camera buttons' }
  },
  {
    id: 'soccer',
    url: '/pixel-soccer/',
    thumb: 'thumbs/soccer.jpg?v=1',
    color: '#2e9a3e',
    genres: ['sports', 'strategy'],
    devices: ['keyboard', 'touch'],
    players: '1',
    added: '2026-10-10',
    title:    { zh: '像素足球', en: 'Pixel Soccer' },
    tagline:  { zh: '全自動足球模擬：11 人制，也有小朋友的 9、7、6、5 人制，每波進攻都畫出戰術。', en: 'An automatic soccer sim: 11v11 plus youth 9v9, 7v7, 6v6 and 5v5, with every attack’s tactic drawn out.' },
    about:    { zh: '依球員能力一波一波模擬比賽：11 人制有越位、黃紅牌和傷停補時；兒童賽制有建構線、不能頭球、小球門和輪流上場。每次進攻都會跑一套戰術（短傳推進、邊路傳中、直塞、撞牆、反擊、轉移、個人突破、角球……），畫在戰術板上，還有兩隊的陣型。Josh Chen、Jasper Chen、Jeff Chen、Erin Lai 四位超級球員每場都在，隨機分到不同球隊和位置。',
                en: 'Matches are simulated attack by attack from player ratings: 11v11 has offside, cards and stoppage time; the youth formats have the build-out line, no heading, small goals and rolling subs. Every attack runs a tactic (build-up, wing play, through ball, one-two, counter, switch, solo dribble, corners…) drawn on the playbook with both formations. Josh Chen, Jasper Chen, Jeff Chen and Erin Lai play in every match on random teams and positions.' },
    controls: { zh: '選賽制 · 點「開球」· 空白鍵暫停 · 可調速度或直接模擬到結束', en: 'Pick a format · click "Kick off" · Space to pause · change the speed or sim to the end' }
  },
  {
    id: 'sdtycoon',
    url: '/sd-tycoon/',
    thumb: 'thumbs/sdtycoon.jpg?v=1',
    color: '#ff8a3a',
    genres: ['board', 'strategy'],
    devices: ['keyboard', 'touch'],
    players: '2-4',
    added: '2026-10-10',
    title:    { zh: '聖地牙哥大亨', en: 'San Diego Tycoon' },
    tagline:  { zh: '以聖地牙哥為主題的地產大亨桌遊：買下拉霍亞、在煤氣燈街區蓋旅館！', en: 'A property-trading board game around San Diego: buy La Jolla and build hotels in the Gaslamp!' },
    about:    { zh: '40 格的聖地牙哥地圖：22 個社區分成 8 個顏色組，還有電車、海岸通勤列車、太平洋衝浪者號和機場，加上衝浪卡、塔可卡和「5 號公路塞車」。買地收租、湊齊整組蓋房子和旅館、抵押、拍賣、交易，一直玩到只剩一個人（或 20、40 回合）。2–4 人，每位都可以是真人或電腦。',
                en: 'A 40-space San Diego board: 22 neighborhoods in 8 color groups, the Trolley, Coaster, Pacific Surfliner and the Airport, Surf and Taco cards, and I-5 traffic. Buy, collect rent, complete color groups to build houses and hotels, mortgage, auction and trade until one player is left (or after 20 or 40 rounds). 2–4 players, each a person or the computer.' },
    controls: { zh: '滑鼠或觸控：點按鈕擲骰子、買地、結束回合 · 點格子看地契、蓋房子', en: 'Mouse or touch: buttons to roll, buy and end your turn · click a space for its deed and to build' }
  },
  {
    id: 'moto',
    url: '/moto-rush/',
    thumb: 'thumbs/moto.jpg?v=1',
    color: '#e02828',
    genres: ['racing', 'sports'],
    devices: ['keyboard', 'touch'],
    players: '1',
    added: '2026-10-10',
    title:    { zh: 'Moto Rush 像素機車大賽', en: 'Moto Rush' },
    tagline:  { zh: '公路賽和越野賽的像素機車競速：壓車過彎、氮氣加速、飛越跳台做特技。', en: 'Pixel motorbike racing: lean into bends on superbikes, fly off motocross jumps and pull tricks.' },
    about:    { zh: '六條賽道：夕陽海岸、阿爾卑斯山道、霓虹城市（公路賽），峽谷沙塵、泥濘森林、火山稜線（越野賽，有跳台和空中特技）。選 Josh、Jasper、Jeff 或 Erin，和其他 7 位車手比賽；有單場比賽、三站積分的錦標賽和計時賽。急彎會把你往外甩，要記得煞車；緊跟在別人後面可以吸尾流補氮氣。',
                en: 'Six tracks: Sunset Coast, Alpine Pass and Neon City for superbikes; Canyon Dust, Muddy Woods and Volcano Ridge for motocross, with jumps and mid-air tricks. Ride as Josh, Jasper, Jeff or Erin against seven rivals in a single race, a three-race championship or a time trial. Sharp bends throw you outwards, so brake in time; tuck in behind a rival to slipstream and refill your nitro.' },
    controls: { zh: '↑ 油門 · ↓ 煞車 · ← → 轉向 · 空白鍵 氮氣／空中特技 · 手機有按鈕 · 支援手把', en: '↑ throttle · ↓ brake · ← → steer · Space nitro / mid-air trick · touch buttons on phones · gamepads work' }
  },
  {
    id: 'amc8',
    url: '/amc8-practice/',
    thumb: 'thumbs/amc8.jpg',
    color: '#2f6fde',
    genres: ['learning', 'puzzle'],
    devices: ['keyboard', 'touch'],
    players: '1',
    added: '2026-10-09',
    title:    { zh: 'AMC 8 數學練習', en: 'AMC 8 Practice' },
    tagline:  { zh: '計時作答 AMC 8 風格的數學題，做完看詳解學方法。', en: 'Timed AMC 8-style math problems with step-by-step solutions.' },
    about:    { zh: '一次一題、邊做邊計時：完整模擬考（25 題 40 分鐘）、快速 1 題、快速 10 題、單元練習和錯題複習。題目每次都隨機產生新的數字，永遠做不完。做完會告訴你正確答案、解題關鍵和一步一步的解說。英文為主，也有中文版。',
                en: 'One problem at a time against the clock: a full mock test (25 problems in 40 minutes), Quick 1, Quick 10, topic practice and a mistakes review. Problems are generated with new numbers every time, so you never run out. At the end you see the right answer, the key idea and a step-by-step explanation. English first, with a Chinese version.' },
    controls: { zh: '點選答案或按 A–E · Enter 下一題', en: 'Click an answer or press A–E · Enter for the next problem' }
  },
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
    id: 'hoops',
    url: '/pixel-hoops/',
    thumb: 'thumbs/hoops.jpg?v=4',
    color: '#e8742a',
    genres: ['sports', 'strategy'],
    devices: ['keyboard', 'touch'],
    players: '1',
    added: '2026-10-09',
    title:    { zh: '像素籃球', en: 'Pixel Hoops' },
    tagline:  { zh: 'NBA 規則的全自動籃球模擬，看球員一回合一回合打下去。', en: 'An automatic basketball sim with NBA rules, played out possession by possession.' },
    about:    { zh: '每隊 5 人上場、13 人名單，四節 12 分鐘、24 秒進攻、犯規加罰、六犯畢業和延長賽。每位球員都有內線、三分、傳球、防守、籃板等能力，會累也會換人。Josh Chen、Jasper Chen、Jeff Chen、Erin Lai 四位超級球員每場都在，隨機分到不同球隊和位置。',
                en: '5 on the court, 13-man rosters, four 12-minute quarters, a 24-second shot clock, the bonus, foul-outs and overtime. Every player has ratings for inside scoring, threes, passing, defense, rebounding and more, gets tired and gets subbed. Josh Chen, Jasper Chen, Jeff Chen and Erin Lai are in every game on random teams and positions.' },
    controls: { zh: '點「開始比賽」· 空白鍵暫停 · 可調速度或直接模擬到結束', en: 'Click "Tip off" · Space to pause · change the speed or sim to the end' }
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
  },

  // ---------- mini-game lab: small experiments ----------
  {
    id: 'dash', lab: true, icon: '🟦', url: '/game/geometry_dash.html', color: '#3b82f6',
    genres: ['action'], devices: ['keyboard'], players: '1', added: '2026-08-01',
    title:    { zh: '方塊衝刺', en: 'Geometry Dash' },
    tagline:  { zh: '按空白鍵跳過障礙！', en: 'Press Space to jump over the obstacles!' },
    about:    { zh: '一個小小的方塊一直往前衝，抓好時機跳起來。', en: 'A little square keeps running. Time your jumps.' },
    controls: { zh: '空白鍵 跳', en: 'Space jump' }
  },
  {
    id: 'mario', lab: true, icon: '🍄', url: '/game/mario.html', color: '#ef4444',
    genres: ['platformer'], devices: ['keyboard'], players: '1', added: '2026-08-01',
    title:    { zh: '炸彈與金幣', en: 'Bombs & Coins' },
    tagline:  { zh: '在平台上跳來跳去，撿金幣、躲炸彈。', en: 'Hop across platforms, grab coins, dodge bombs.' },
    about:    { zh: '最早的平台跳躍小實驗。', en: 'The very first platformer experiment.' },
    controls: { zh: '← → 移動 · 空白鍵 跳', en: '← → move · Space jump' }
  },
  {
    id: 'math', lab: true, icon: '➕', url: '/game/math.html', color: '#10b981',
    genres: ['puzzle'], devices: ['keyboard', 'touch'], players: '1', added: '2026-08-01',
    title:    { zh: '心算大挑戰', en: 'Math Quiz' },
    tagline:  { zh: '60 秒內能答對幾題？', en: 'How many can you answer in 60 seconds?' },
    about:    { zh: '加法心算計時挑戰。', en: 'A timed addition challenge.' },
    controls: { zh: '輸入答案 · Enter 送出', en: 'Type the answer · Enter to submit' }
  },
  {
    id: 'godzilla', lab: true, icon: '🦖', url: '/game/test2.html', color: '#8b5cf6',
    genres: ['action'], devices: ['touch'], players: '1', added: '2026-08-01',
    title:    { zh: '哥吉拉射擊', en: 'Godzilla Shooter' },
    tagline:  { zh: '用手指拖著哥吉拉射擊！（手機、平板）', en: 'Drag Godzilla around and shoot! (phones and tablets)' },
    about:    { zh: '觸控射擊小實驗，需要觸控螢幕。', en: 'A touch shooting experiment. Needs a touch screen.' },
    controls: { zh: '手指拖動', en: 'Drag with your finger' }
  }
];
