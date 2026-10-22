// 진입점: 화면 전환
import { renderTitle } from './screens/title.js';
import { renderStart } from './screens/start.js';
import { renderHowto } from './screens/howto.js';
import { renderPrep } from './screens/prep.js';
import { renderLive } from './screens/live.js';
import { renderPost } from './screens/post.js';
import { renderResult } from './screens/result.js';

const screens = { title: renderTitle, start: renderStart, howto: renderHowto, prep: renderPrep, live: renderLive, post: renderPost, result: renderResult };
const app = document.getElementById('app');
let cleanup = null;

export function showScreen(name) {
  if (typeof cleanup === 'function') cleanup();
  document.querySelectorAll('.modal-backdrop, .toast').forEach((n) => n.remove());
  app.replaceChildren();
  app.dataset.screen = name;
  window.scrollTo(0, 0);
  cleanup = screens[name](app, showScreen);
}

showScreen('title');
