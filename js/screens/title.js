// 게임 타이틀 화면
import { el } from '../dom.js';
import { titleText } from '../data/ui.js';

const SEATS = ['🙂', '🙂', '🙋', '🙂', '🙂', '🙂', '🙂', '😶', '🙂', '⚠️', '🙂', '🙂'];

export function renderTitle(root, go) {
  root.append(
    el('section', { class: 'screen title-screen' },
      el('span', { class: 'title-badge' }, titleText.badge),
      el('div', { class: 'title-logo' },
        el('div', { class: 'title-clock', 'aria-hidden': 'true' }, '⏱'),
        el('h1', { class: 'title' }, titleText.title),
        el('p', { class: 'subtitle' }, titleText.subtitle)),
      el('div', { class: 'title-class', 'aria-hidden': 'true' },
        el('div', { class: 'title-board' }),
        el('div', { class: 'title-seats' }, SEATS.map((s) => el('span', {}, s)))),
      el('p', { class: 'title-time' }, titleText.playTime),
      el('button', { class: 'btn btn-primary btn-block btn-start', onclick: () => go('start') }, '게임 시작')),
  );
}
