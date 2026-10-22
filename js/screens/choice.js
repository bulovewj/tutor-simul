// 4지선다 상황 카드 모달 (수업 중·수업 후 공용)
import { el, signed, badgeClass } from '../dom.js';
import { choiceText } from '../data/ui.js';
import { shuffle } from '../state.js';

const LIMIT_MS = 15000;
const NUMS = ['①', '②', '③', '④'];

// opts: { seatLabel, category, text, choices, phase, onPick(choice|null), onClose() }
export function openChoice(opts) {
  const list = shuffle(opts.choices);
  const bar = el('div', { class: 'timer-fill' });
  const timer = el('div', { class: 'timer', role: 'progressbar', 'aria-label': '⏳' }, bar);
  const resultBox = el('div', { class: 'choice-result', 'aria-live': 'polite' });
  const buttons = list.map((c, i) =>
    el('button', { class: 'choice-btn', onclick: () => pick(c, buttons[i]) },
      el('span', { class: 'choice-num' }, NUMS[i]),
      el('span', { class: 'choice-text' }, c.text)));

  const modal = el('div', { class: 'modal-backdrop' },
    el('div', { class: `modal choice-modal phase-${opts.phase}`, role: 'dialog', 'aria-modal': 'true' },
      el('div', { class: 'choice-head' },
        opts.seatLabel ? el('span', { class: 'seat-chip' }, opts.seatLabel) : null,
        el('span', { class: 'cat-chip' }, opts.category)),
      el('p', { class: 'choice-situation' }, opts.text),
      timer,
      el('div', { class: 'choice-list' }, buttons),
      resultBox));
  document.body.append(modal);

  const started = performance.now();
  let done = false;
  const raf = () => {
    if (done) return;
    const left = Math.max(0, 1 - (performance.now() - started) / LIMIT_MS);
    bar.style.transform = `scaleX(${left})`;
    timer.classList.toggle('is-low', left < 0.34);
    if (left <= 0) return pick(null, null);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  function pick(choice, btn) {
    if (done) return;
    done = true;
    timer.classList.add('is-done');
    buttons.forEach((b) => { b.disabled = true; });
    if (btn) {
      btn.classList.add('is-picked');
      btn.append(el('span', { class: `badge ${badgeClass(choice.score)}` }, signed(choice.score)));
    }
    opts.onPick(choice);
    resultBox.append(...[
      el('p', { class: 'feedback' }, choice ? choice.feedback : choiceText.timeout),
      choice?.record ? el('p', { class: 'record-note' }, choiceText.recorded) : null,
      !choice ? el('span', { class: 'badge badge-zero' }, '0') : null,
      el('button', { class: 'btn btn-primary btn-block', onclick: close }, '계속'),
    ].filter(Boolean));
    resultBox.querySelector('.btn').focus({ preventScroll: true });
    resultBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function close() {
    modal.remove();
    opts.onClose?.();
  }
}

export function seatLabel(seat) {
  if (seat === 0) return choiceText.seatAll;
  const seats = Array.isArray(seat) ? seat : [seat];
  return seats.map((s) => s + choiceText.seatSuffix).join('·');
}
