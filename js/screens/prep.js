import { el, toast, signed, badgeClass } from '../dom.js';
import { prepCards, prepIntro } from '../data/prepCards.js';
import { applyPrep, shuffle, state } from '../state.js';

export function renderPrep(root, go) {
  const picked = new Set();
  const cards = shuffle(prepCards);
  const counter = el('span', { class: 'counter' });
  const startBtn = el('button', { class: 'btn btn-primary btn-block', onclick: finish }, '수업 시작');
  const grid = el('div', { class: 'prep-grid' });

  function update() {
    counter.textContent = `${picked.size} / 4`;
    startBtn.disabled = picked.size !== 4;
    grid.querySelectorAll('.prep-card').forEach((b) => {
      const on = picked.has(b.dataset.id);
      b.classList.toggle('is-picked', on);
      b.setAttribute('aria-pressed', on);
    });
  }

  function toggle(id) {
    if (picked.has(id)) picked.delete(id);
    else if (picked.size >= 4) return toast(prepIntro.limitToast);
    else picked.add(id);
    update();
  }

  for (const c of cards) {
    grid.append(el('button', { class: 'prep-card', 'data-id': c.id, onclick: () => toggle(c.id) },
      el('span', { class: 'prep-icon' }, c.icon),
      el('span', { class: 'prep-text' }, c.text),
      el('span', { class: 'prep-check', 'aria-hidden': 'true' }, '✔')));
  }

  function finish() {
    applyPrep([...picked]);
    const chosen = prepCards.filter((c) => picked.has(c.id));
    root.replaceChildren(el('section', { class: 'screen prep' },
      el('header', { class: 'phase-head phase-prep' }, el('h2', {}, `📋 ${prepIntro.resultTitle}`),
        el('span', { class: 'phase-score' }, `⭐ ${state.prep.score} / ${state.prep.max}`)),
      el('ul', { class: 'result-list' }, chosen.map((c) =>
        el('li', { class: `result-item ${c.good ? '' : 'is-bad'}` },
          el('div', { class: 'result-top' },
            el('span', {}, `${c.icon} ${c.text}`),
            el('span', { class: `badge ${badgeClass(c.score)}` }, signed(c.score))),
          el('p', { class: 'feedback' }, c.feedback)))),
      el('button', { class: 'btn btn-primary btn-block', onclick: () => go('live') }, '교실로 들어가기')));
  }

  root.append(el('section', { class: 'screen prep' },
    el('header', { class: 'phase-head phase-prep' },
      el('h2', {}, `📋 ${prepIntro.title}`), counter),
    el('p', { class: 'guide' }, prepIntro.guide),
    grid,
    el('div', { class: 'sticky-foot' }, startBtn)));
  update();
}
