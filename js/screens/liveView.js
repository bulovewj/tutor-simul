// 수업 중 화면 그리기 (상태는 읽기만)
import { el } from '../dom.js';
import { liveText, choiceText } from '../data/ui.js';
import { state, eventById, seatsOf, lookRemaining, totalScore } from '../state.js';

const ICON = { ok: '🙂', hand: '🙋', alert: '⚠️', quiet: '😶', missed: '⌛' };
const LABEL = liveText.seatLabels;

const mmss = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

export function buildLive(handlers) {
  const r = {};
  r.clock = el('span', { class: 'clock' });
  r.score = el('span', { class: 'score' });
  r.chips = liveText.phases.map((p) => el('span', { class: 'phase-chip' }, p.name));
  r.boardText = el('span', { class: 'board-text' });
  r.boardIcon = el('span', { class: 'board-icon', 'aria-hidden': 'true' });
  r.board = el('button', { class: 'board', onclick: () => handlers.onSeat(0) },
    el('span', { class: 'board-label' }, liveText.boardLabel), r.boardText, r.boardIcon);
  r.seats = {};
  const grid = el('div', { class: 'seat-grid' });
  for (let n = 1; n <= 24; n++) {
    r.seats[n] = el('button', { class: 'seat', onclick: () => handlers.onSeat(n) },
      el('span', { class: 'seat-icon' }), el('span', { class: 'seat-no' }, n), el('span', { class: 'seat-tag' }));
    grid.append(r.seats[n]);
  }
  r.look = el('button', { class: 'btn btn-look', onclick: handlers.onLook });
  r.log = el('button', { class: 'btn btn-log', onclick: handlers.onLog });
  r.hint = el('p', { class: 'look-hint', 'aria-live': 'polite' });
  r.root = el('section', { class: 'screen live' },
    el('header', { class: 'live-top' },
      el('div', { class: 'live-row' }, r.clock, r.score),
      el('div', { class: 'phase-chips' }, r.chips)),
    r.board, grid, r.hint,
    el('div', { class: 'live-foot' }, r.look, r.log));
  return r;
}

// 좌석 하나의 현재 모습
export function seatStatus(n, revealing) {
  const live = state.live;
  for (const a of live.active) {
    const ev = eventById(a.id);
    if (!seatsOf(ev).includes(n)) continue;
    if (ev.visible) return { kind: ev.look, ev };
    if (revealing) return { kind: 'quiet', ev };
    return { kind: 'ok', ev: null, hidden: ev };
  }
  if (live.missed.some((id) => seatsOf(eventById(id)).includes(n))) return { kind: 'missed', ev: null };
  return { kind: 'ok', ev: null };
}

export function renderLiveView(r, revealing) {
  const live = state.live;
  r.clock.textContent = `⏱ ${mmss(live.clock)} / 50:00`;
  r.score.textContent = `⭐ ${totalScore()}${liveText.scoreUnit}`;
  const min = live.clock / 60;
  let cur = 0;
  liveText.phases.forEach((p, i) => { if (min >= p.from) cur = i; });
  r.chips.forEach((c, i) => {
    c.classList.toggle('is-now', i === cur);
    c.classList.toggle('is-past', i < cur);
  });
  const ph = liveText.phases[cur];
  r.boardText.textContent = `${ph.icon} ${ph.name}: ${ph.desc}`;
  for (let n = 1; n <= 24; n++) {
    const s = seatStatus(n, revealing);
    const b = r.seats[n];
    b.dataset.kind = s.kind;
    b.querySelector('.seat-icon').textContent = ICON[s.kind];
    b.querySelector('.seat-tag').textContent = s.kind === 'missed' ? liveText.missedTag : '';
    b.setAttribute('aria-label', `${n}${choiceText.seatSuffix} ${LABEL[s.kind]}`);
    b.disabled = s.kind === 'missed';
  }
  const boardEv = seatStatus(0, revealing);
  r.board.dataset.kind = boardEv.kind;
  r.boardIcon.textContent = boardEv.kind === 'ok' ? '' : ICON[boardEv.kind];
  const wait = lookRemaining();
  r.look.disabled = wait > 0 || revealing;
  r.look.textContent = wait > 0 ? `👀 둘러보기 (${Math.ceil(wait / 60)}${liveText.minuteUnit})` : '👀 둘러보기';
  r.log.textContent = `📝 기록장 ${state.records.length}`;
  r.hint.textContent = revealing ? liveText.lookHint : '';
}
