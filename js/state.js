// 게임 상태와 규칙. DOM 접근 금지 — 화면 파일은 여기 함수로만 상태를 바꾼다.
import { prepCards } from './data/prepCards.js';
import { events } from './data/events.js';
import { finalQuestion } from './data/records.js';
import { titles, nextTasks, missedText } from './data/titles.js';

export const GAME_END = 50 * 60;     // 게임 초
export const TICK_GAME_SEC = 12;     // 실제 1초 = 게임 12초
export const MISS_AFTER = 6 * 60;    // 방치 6분 → 💤
export const LOOK_COOLDOWN = 5 * 60; // 둘러보기 쿨다운 게임 5분

function freshState() {
  return {
    prep: { selected: [], score: 0, max: 40 },
    live: { clock: 0, score: 0, max: 0, handled: [], missed: [], foundHidden: [], active: [], occurred: [], lookReadyAt: 0 },
    records: [],
    post: { score: 0, max: 0, answered: [] },
    flags: { battery_low: false, wifi_three: false, url_error: false, noTeacherDeal: false, noBackup: false, extraHidden: false },
  };
}

export let state = freshState();
export function resetState() { state = freshState(); }

export function addScore(phase, n) { state[phase].score += n; }
export function addMax(phase, n) { state[phase].max += n; }

export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- 수업 전 ----------
export function applyPrep(selectedIds) {
  state.prep.selected = [...selectedIds];
  state.prep.score = 0;
  for (const card of prepCards) {
    const picked = selectedIds.includes(card.id);
    if (picked) addScore('prep', card.score);
    if (!picked && card.unpickFlag) state.flags[card.unpickFlag] = true;
  }
  console.log('[prep] flags', { ...state.flags });
}

// ---------- 수업 중 ----------
export const eventById = (id) => events.find((e) => e.id === id);
export const seatsOf = (ev) => (Array.isArray(ev.seat) ? ev.seat : [ev.seat]);

// 시계를 진행하고, 이번에 새로 생긴 사건·놓친 사건 id를 돌려준다
export function advanceClock(sec) {
  const live = state.live;
  live.clock = Math.min(GAME_END, live.clock + sec);
  const started = [];
  const missed = [];
  for (const ev of events) {
    const due = live.clock >= ev.time * 60;
    const allowed = !ev.condition || state.flags[ev.condition];
    if (due && allowed && !live.occurred.includes(ev.id)) {
      live.occurred.push(ev.id);
      live.active.push({ id: ev.id, at: ev.time * 60 });
      addMax('live', 10);
      started.push(ev.id);
    }
  }
  for (const a of [...live.active]) {
    if (live.clock - a.at >= MISS_AFTER) {
      live.active = live.active.filter((x) => x.id !== a.id);
      live.missed.push(a.id);
      addScore('live', -5);
      missed.push(a.id);
    }
  }
  return { started, missed, ended: live.clock >= GAME_END };
}

export const isActive = (id) => state.live.active.some((a) => a.id === id);

export function findHidden(id) {
  if (state.live.foundHidden.includes(id)) return;
  state.live.foundHidden.push(id);
  addScore('live', 5);
  addMax('live', 5);
}

export function resolveEvent(id, choice) {
  state.live.active = state.live.active.filter((a) => a.id !== id);
  state.live.handled.push(id);
  if (choice) applyChoice('live', choice);
}

export function applyChoice(phase, choice) {
  addScore(phase, choice.score);
  if (choice.record && !state.records.includes(choice.record)) state.records.push(choice.record);
}

export function startLook() { state.live.lookReadyAt = state.live.clock + LOOK_COOLDOWN; }
export const lookRemaining = () => Math.max(0, state.live.lookReadyAt - state.live.clock);

// 수업 전 선택에 따라 선택지를 조정 (대체 활동지 제외, 선생님 호출 점수 절반)
export function choicesFor(ev) {
  return ev.choices
    .filter((c) => !(c.needs === 'backup' && state.flags.noBackup))
    .map((c) => (c.teacherCall && state.flags.noTeacherDeal && c.score === 10 ? { ...c, score: 5 } : c));
}

// ---------- 수업 후 ----------
export function answerPost(id, choice) {
  state.post.answered.push(id);
  addMax('post', 10);
  if (choice) addScore('post', choice.score);
}

export function buildFinalChoices() {
  const fq = finalQuestion;
  const recs = state.records;
  const fb = fq.feedback;
  const fallbackScore = recs.length ? fq.fallback.scoreElse : fq.fallback.scoreEmpty;
  const list = [
    { text: fq.fallback.text, score: fallbackScore, feedback: recs.length ? fb.fallback : fb.fallbackBest },
    { text: fq.zero.text, score: fq.zero.score, feedback: fb.zero },
    { text: fq.wrong.text, score: fq.wrong.score, feedback: fb.wrong },
  ];
  const match = fq.matchPool.find((m) => m.record === recs[0]);
  const decoy = fq.matchPool.find((m) => !recs.includes(m.record));
  if (match) list.push({ text: match.text, score: 10, feedback: fb.match });
  else if (decoy) list.push({ text: decoy.text, score: 0, feedback: fb.zero });
  return list;
}

// 수업 중에 생겼지만 기록하지 않은 문제 (최선 선택지에 record가 있는 사건)
export function unrecordedEvents() {
  return state.live.occurred
    .map(eventById)
    .filter((ev) => {
      const rec = ev.choices.find((c) => c.record)?.record;
      return rec && !state.records.includes(rec);
    });
}

// ---------- 결과 ----------
export function percent(phase) {
  const { score, max } = state[phase];
  if (max === 0) return 100;
  return Math.max(0, Math.round((score / max) * 100));
}

export function totalScore() {
  return state.prep.score + state.live.score + state.post.score;
}

export function pickTitle() {
  const p = { prep: percent('prep'), live: percent('live'), post: percent('post') };
  if (p.prep >= 80 && p.live >= 80 && p.post >= 80) return titles.guard;
  const order = ['live', 'post', 'prep']; // 동점 우선순위
  const best = order.reduce((a, b) => (p[b] > p[a] ? b : a));
  return titles[best];
}

export function pickNextTask() {
  const p = { prep: percent('prep'), live: percent('live'), post: percent('post') };
  const order = ['post', 'live', 'prep']; // 동점 우선순위
  const worst = order.reduce((a, b) => (p[b] < p[a] ? b : a));
  return { phase: worst, text: nextTasks[worst] };
}

// 놓친 학생: 어려움 유형(gap)으로만 집계
export function missedReport() {
  const counts = {};
  for (const id of state.live.missed) {
    const ev = eventById(id);
    const label = ev.gap ? ev.gap + missedText.gapSuffix : ev.category.split(' ')[0] + missedText.issueSuffix;
    counts[label] = (counts[label] || 0) + 1;
  }
  return { total: state.live.missed.length, items: Object.entries(counts) };
}

export function resultCode() {
  return `${percent('prep')}-${percent('live')}-${percent('post')}-${pickTitle().icon}`;
}
