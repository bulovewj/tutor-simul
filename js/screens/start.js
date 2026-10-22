import { el } from '../dom.js';
import { startText } from '../data/ui.js';
import { resetState } from '../state.js';

export function renderStart(root, go) {
  resetState();
  root.append(
    el('section', { class: 'screen start' },
      el('div', { class: 'start-hero' },
        el('div', { class: 'start-clock', 'aria-hidden': 'true' }, '⏱'),
        el('h1', { class: 'title' }, startText.title),
        el('p', { class: 'subtitle' }, startText.subtitle)),
      el('div', { class: 'card scenario' },
        startText.scenario.map(([icon, text]) => el('p', { class: 'row' }, el('span', { class: 'row-icon' }, icon), text))),
      el('ol', { class: 'steps' },
        startText.steps.map(([icon, name, text], i) =>
          el('li', { class: `step step-${['prep', 'live', 'post'][i]}` },
            el('span', { class: 'step-icon' }, icon),
            el('span', {}, el('b', {}, name), ' ', text)))),
      el('button', { class: 'btn btn-primary btn-block', onclick: () => go('prep') }, '시작')),
  );
}
