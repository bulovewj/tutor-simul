// 수업 후: 기록 카드 조치 + 마지막 문항
import { el, signed, badgeClass } from '../dom.js';
import { records, finalQuestion, postIntro } from '../data/records.js';
import { phaseNames } from '../data/titles.js';
import { state, answerPost, buildFinalChoices, unrecordedEvents } from '../state.js';
import { openChoice } from './choice.js';

export function renderPost(root, go) {
  const cards = state.records.map((id) => records.find((r) => r.id === id));
  const total = cards.length + 1;
  let step = 0;

  const progress = el('span', { class: 'counter' });
  const list = el('ul', { class: 'post-list' },
    cards.map((c) => el('li', { class: 'post-item', 'data-id': c.id },
      el('span', {}, `📝 ${c.title}`), el('span', { class: 'post-mark' }, '⋯'))),
    el('li', { class: 'post-item', 'data-id': 'final' },
      el('span', {}, `❓ ${finalQuestion.title}`), el('span', { class: 'post-mark' }, '⋯')));
  const foot = el('div', { class: 'post-foot' });
  const startBtn = el('button', { class: 'btn btn-primary btn-block', onclick: next }, '조치 시작');

  root.append(el('section', { class: 'screen post' },
    el('header', { class: 'phase-head phase-post' }, el('h2', {}, `🔗 ${postIntro.title}`), progress),
    el('p', { class: 'guide' }, cards.length ? postIntro.guide : postIntro.empty),
    list, foot, el('div', { class: 'sticky-foot' }, startBtn)));
  updateProgress();

  function updateProgress() { progress.textContent = `${Math.min(step + 1, total)} / ${total}`; }

  function mark(id, choice) {
    const m = list.querySelector(`[data-id="${id}"] .post-mark`);
    const score = choice ? choice.score : 0;
    m.replaceChildren(el('span', { class: `badge ${badgeClass(score)}` }, signed(score)));
  }

  function next() {
    startBtn.remove();
    if (step < cards.length) {
      const c = cards[step];
      openChoice({
        phase: 'post', seatLabel: c.title, category: c.category, text: c.text, choices: c.choices,
        onPick: (choice) => { answerPost(c.id, choice); mark(c.id, choice); },
        onClose: () => { step++; updateProgress(); next(); },
      });
      return;
    }
    if (step === cards.length) {
      openChoice({
        phase: 'post', seatLabel: finalQuestion.title, category: finalQuestion.category, text: finalQuestion.text,
        choices: buildFinalChoices(),
        onPick: (choice) => { answerPost('final', choice); mark('final', choice); },
        onClose: () => { step++; showSummary(); },
      });
    }
  }

  function showSummary() {
    const missing = unrecordedEvents();
    foot.append(...[
      el('p', { class: 'phase-score' }, `⭐ ${phaseNames.post} ${state.post.score} / ${state.post.max}`),
      missing.length ? el('div', { class: 'unrecorded' },
        el('h3', {}, `🗂 ${postIntro.unrecordedTitle}`),
        el('ul', {}, missing.map((ev) => {
          const rec = records.find((r) => r.id === ev.choices.find((c) => c.record).record);
          return el('li', {}, `${rec.title} → ${postIntro.unrecordedTail}`);
        }))) : null,
      el('button', { class: 'btn btn-primary btn-block', onclick: () => go('result') }, '결과 보기'),
    ].filter(Boolean));
    foot.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
