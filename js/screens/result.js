// 결과: 총점, 단계별 %, 칭호, 다음 판 과제, 놓친 학생, 결과 코드
import { el } from '../dom.js';
import { phaseNames, missedText, resultLabels as L } from '../data/titles.js';
import { state, percent, totalScore, pickTitle, pickNextTask, missedReport, resultCode } from '../state.js';

export function renderResult(root, go) {
  const title = pickTitle();
  const task = pickNextTask();
  const missed = missedReport();
  const bars = ['prep', 'live', 'post'].map((p) => {
    const pct = percent(p);
    return el('div', { class: `bar-row bar-${p}` },
      el('span', { class: 'bar-name' }, phaseNames[p]),
      el('span', { class: 'bar-track' }, el('span', { class: 'bar-fill', style: `width:${pct}%` })),
      el('span', { class: 'bar-pct' }, `${pct}%`));
  });
  const missedLine = missed.total
    ? `💤 ${missed.total}${L.unit} — ${missed.items.map(([label, n]) => `${label} ${n}${L.unit}`).join(', ')}`
    : `🙂 ${missedText.none}`;

  root.append(el('section', { class: 'screen result' },
    el('div', { class: 'total' }, el('span', { class: 'total-label' }, L.total), el('b', {}, `⭐ ${totalScore()}`)),
    el('div', { class: 'card bars' }, bars),
    el('div', { class: 'card title-card' },
      el('span', { class: 'title-icon' }, title.icon),
      el('div', {}, el('b', { class: 'title-name' }, title.name), el('p', {}, title.text))),
    el('div', { class: `card next-task bar-${task.phase}` },
      el('b', {}, `🎯 ${L.nextTask} · ${phaseNames[task.phase]}`), el('p', {}, task.text)),
    el('p', { class: 'missed-line' }, missedLine),
    el('div', { class: 'code-box' }, el('span', { class: 'code-label' }, L.code), el('b', { class: 'code' }, resultCode())),
    el('button', { class: 'btn btn-primary btn-block', onclick: () => go('start') }, '다시 하기')));
  console.log('[result]', JSON.parse(JSON.stringify(state)));
}
