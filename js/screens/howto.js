// 게임 방법
import { el, signed, badgeClass } from '../dom.js';
import { howtoText } from '../data/ui.js';

export function renderHowto(root, go) {
  root.append(
    el('section', { class: 'screen howto' },
      el('header', { class: 'phase-head phase-prep' }, el('h2', {}, `🎮 ${howtoText.heading}`)),
      el('p', { class: 'howto-intro' }, howtoText.intro),
      el('ol', { class: 'steps' },
        howtoText.steps.map(([icon, name, text], i) =>
          el('li', { class: `step step-${['prep', 'live', 'post'][i]}` },
            el('span', { class: 'step-icon' }, icon),
            el('span', {}, el('b', {}, name), ' ', text)))),
      el('ul', { class: 'card tips' },
        howtoText.tips.map(([icon, text]) => el('li', {}, el('span', {}, icon), el('span', {}, text)))),
      el('div', { class: 'score-legend' },
        el('span', {}, howtoText.scoreTitle),
        howtoText.scores.map(([n, name]) =>
          el('span', {}, el('span', { class: `badge ${badgeClass(n)}` }, signed(n)), ' ', name))),
      el('div', { class: 'sticky-foot' },
        el('button', { class: 'btn btn-primary btn-block', onclick: () => go('prep') }, '준비 시작'))),
  );
}
