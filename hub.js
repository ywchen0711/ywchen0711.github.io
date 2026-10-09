/*
 * "Back to the lobby" button for games on this site. A game adds one line to its page:
 *   <script src="/hub.js" defer></script>
 * Put it in another corner if it covers something: data-pos="top-left" | "top-right" | "bottom-left" (default) | "bottom-right"
 * Inside the lobby's player the lobby already has a back button, so nothing is shown there.
 */
(function () {
  'use strict';
  if (window.top !== window) return;
  var me = document.currentScript, pos = (me && me.getAttribute('data-pos')) || 'bottom-left';
  var v = pos.indexOf('top') === 0 ? 'top' : 'bottom', h = /right$/.test(pos) ? 'right' : 'left';
  var zh = /^zh/i.test(document.documentElement.lang || navigator.language || '');
  var a = document.createElement('a');
  a.href = '/';
  a.id = 'hub-back';
  a.textContent = zh ? '🏠 大廳' : '🏠 Lobby';
  a.title = zh ? '回到像素遊樂場' : 'Back to Pixel Playground';
  a.style.cssText = [
    'position:fixed', h + ':10px', v + ':10px', 'z-index:2147483000', 'padding:6px 12px', 'border-radius:999px',
    'background:rgba(91,91,214,0.92)', 'color:#fff', 'font:800 13px/1.2 Nunito,"Noto Sans TC","Microsoft JhengHei",sans-serif',
    'text-decoration:none', 'box-shadow:0 3px 0 #3a3aa8,0 4px 12px rgba(0,0,0,.3)', 'opacity:0.9', 'transition:opacity .4s'
  ].join(';');
  a.onmouseenter = function () { a.style.opacity = '1'; };
  a.onmouseleave = function () { a.style.opacity = '0.35'; };
  // fade out of the way after a few seconds; hover or touch brings it back
  setTimeout(function () { a.style.opacity = '0.35'; }, 4000);
  document.addEventListener('pointerlockchange', function () { a.style.display = document.pointerLockElement ? 'none' : ''; });
  (document.body || document.documentElement).appendChild(a);
})();
