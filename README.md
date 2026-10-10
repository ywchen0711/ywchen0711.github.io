# 像素遊樂場 Pixel Playground

The lobby for all of ywchen0711's browser games: **https://ywchen0711.github.io/**

Pick a game, play it right inside the lobby, and hit **← Lobby** to come back. The lobby remembers (on your device)
what you played recently, your favorites, how many times you played each game, and your name and avatar color.
Chinese and English, light and dark mode, works on phones.

| Game | Play directly |
|---|---|
| Josh & Jasper 大冒險 (RPG) | /josh-jasper-rpg/ |
| Josh & Jasper: Coyote Trail (platformer) | /josh-and-jasper/ |
| HUSH (horror) | /hush/ |
| 三國志 霸王之路 (strategy) | /Sango/ |
| 像素職棒模擬 (baseball sim) | /game/ |
| 像素籃球 Pixel Hoops (basketball sim) | /pixel-hoops/ |
| AMC 8 數學練習 (learning) | /amc8-practice/ |

## Adding a game

1. Put the game in its own repo with GitHub Pages turned on (it will live at `https://ywchen0711.github.io/<repo>/`).
2. Add an entry to `games.js` (title, description, controls in both languages, genres) and a 16:9 picture in `thumbs/`.
3. In the game's `index.html`, add `<script src="/hub.js" defer></script>` so people who open the game directly get a
   "🏠 Lobby" button.

## Files

```
index.html   the page
style.css    the look
app.js       lobby logic: banner, search, genres, favorites, recently played, details, the player
games.js     the game list  ← edit this to add games
hub.js       the "back to lobby" button that games include
thumbs/      game pictures
```
