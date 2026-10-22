// 시작: 오늘의 수업 흐름 + 튜터가 할 일
import { el } from '../dom.js';
import { startText, liveText } from '../data/ui.js';
import { resetState } from '../state.js';

export function renderStart(root, go) {
  resetState();
  root.append(
    el('section', { class: 'screen start' },
      el('header', { class: 'lesson-head' },
        el('span', { class: 'lesson-label' }, startText.heading),
        el('h2', {}, startText.lessonName),
        el('div', { class: 'lesson-tags' }, startText.scenario.map((t) => el('span', { class: 'tag' }, t)))),
      el('div', { class: 'card flow' },
        el('h3', {}, startText.flowTitle),
        el('ol', { class: 'flow-list' }, liveText.phases.map((p) =>
          el('li', { class: 'flow-item' },
            el('span', { class: 'flow-icon' }, p.icon),
            el('div', { class: 'flow-body' },
              el('span', { class: 'flow-name' }, `${p.name} · ${p.from}~${p.to}${liveText.minuteUnit}`),
              el('span', { class: 'flow-desc' }, p.desc)))))),
      el('h3', { class: 'game-title' }, startText.gameTitle),
      el('ol', { class: 'steps' },
        startText.steps.map(([icon, name, text], i) =>
          el('li', { class: `step step-${['prep', 'live', 'post'][i]}` },
            el('span', { class: 'step-icon' }, icon),
            el('span', {}, el('b', {}, name), ' ', text)))),
      el('div', { class: 'sticky-foot' },
        el('button', { class: 'btn btn-primary btn-block', onclick: () => go('prep') }, '준비 시작'))),
  );
}
