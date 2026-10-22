// 수업 중: 시계 진행, 사건 발생, 둘러보기, 기록장
import { el, toast } from '../dom.js';
import { liveText } from '../data/ui.js';
import { records } from '../data/records.js';
import { state, advanceClock, TICK_GAME_SEC, choicesFor, resolveEvent, findHidden, startLook } from '../state.js';
import { buildLive, renderLiveView, seatStatus } from './liveView.js';
import { openChoice, seatLabel } from './choice.js';

const LOOK_MS = 3000;

export function renderLive(root, go) {
  let paused = false;
  let revealing = false;
  let revealTimer = null;
  let ended = false;

  const view = buildLive({ onSeat, onLook, onLog });
  root.append(view.root);
  const refresh = () => renderLiveView(view, revealing);
  refresh();

  const interval = setInterval(() => {
    if (paused || ended) return;
    const res = advanceClock(TICK_GAME_SEC);
    if (res.missed.length) toast(liveText.missedToast);
    refresh();
    if (res.ended) finish();
  }, 1000);

  function onSeat(n) {
    if (paused || ended) return;
    const s = seatStatus(n, revealing);
    if (!s.ev) return;
    if (s.kind === 'quiet') findHidden(s.ev.id);
    openEvent(s.ev);
  }

  function openEvent(ev) {
    paused = true;
    openChoice({
      phase: 'live',
      seatLabel: seatLabel(ev.seat),
      category: ev.category,
      text: ev.text,
      choices: choicesFor(ev),
      onPick: (choice) => { resolveEvent(ev.id, choice); refresh(); },
      onClose: () => { paused = false; refresh(); },
    });
  }

  function onLook() {
    if (paused || ended || revealing) return;
    startLook();
    revealing = true;
    refresh();
    revealTimer = setTimeout(() => { revealing = false; refresh(); }, LOOK_MS);
  }

  function onLog() {
    if (ended) return;
    paused = true;
    const items = state.records.map((id) => records.find((r) => r.id === id));
    const modal = el('div', { class: 'modal-backdrop' },
      el('div', { class: 'modal log-modal', role: 'dialog', 'aria-modal': 'true' },
        el('h3', {}, liveText.logTitle),
        items.length
          ? el('ul', { class: 'log-list' }, items.map((r) => el('li', {}, el('b', {}, r.title), ' · ', r.text)))
          : el('p', { class: 'muted' }, liveText.logEmpty),
        el('button', { class: 'btn btn-primary btn-block', onclick: () => { modal.remove(); paused = false; refresh(); } }, '닫기')));
    document.body.append(modal);
  }

  function finish() {
    ended = true;
    clearInterval(interval);
    root.append(el('div', { class: 'end-overlay', role: 'status' }, `🔔 ${liveText.classEnd}`));
    setTimeout(() => go('post'), 1500);
  }

  // 개발 확인용: 콘솔에서 __skip(분) 으로 시계 빨리 감기
  window.__skip = (min) => { for (let i = 0; i < (min * 60) / TICK_GAME_SEC; i++) { const r = advanceClock(TICK_GAME_SEC); if (r.ended) { refresh(); return finish(); } } refresh(); };

  return () => {
    clearInterval(interval);
    clearTimeout(revealTimer);
    delete window.__skip;
  };
}
