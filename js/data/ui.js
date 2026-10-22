// 화면 공통 문구 (화면 코드에 한국어 문장을 두지 않기 위해 분리)
export const startText = {
  title: '50분을 지켜라',
  subtitle: '24명 교실의 디지털 튜터가 되어 50분을 지켜 주세요',
  scenario: [
    ['🏫', '부산 ○○초 6학년 3반 · 학생 24명'],
    ['📱', '갤럭시탭 1인 1기기 (기기 번호 = 학생 번호)'],
    ['🗺', '사회 「우리 지역 소개 자료 만들기」 — 패들렛 + AI 피드백'],
  ],
  steps: [
    ['📋', '수업 전', '점검 카드 4장 고르기'],
    ['👀', '수업 중', '문제가 생긴 학생을 눌러 ①~④ 중 대처하기'],
    ['🔗', '수업 후', '기록장을 보고 맞는 사람에게 연결하기'],
  ],
};

export const liveText = {
  phases: [
    { name: '도입', from: 0, board: '도입: 오늘 할 일 안내' },
    { name: '활동1', from: 10, board: '활동 1: 모둠별 자료 찾기' },
    { name: '활동2', from: 20, board: '활동 2: 패들렛에 올리기' },
    { name: '정리', from: 35, board: '정리: AI 피드백 보고 고치기' },
  ],
  boardLabel: '선생님 · 전자칠판',
  classEnd: '수업 종료',
  lookHint: '😶 숨은 신호를 찾아 눌러 보세요',
  missedToast: '💤 방치한 학생이 생겼어요 (−5)',
  logEmpty: '아직 기록이 없어요.',
  logTitle: '📝 기록장',
  seatLabels: { ok: '정상 참여', hand: '도움 요청', alert: '기기·접속·보안 문제', quiet: '조용한 이탈', missed: '놓친 학생' },
  scoreUnit: '점',
  minuteUnit: '분',
};

export const choiceText = {
  timeout: '망설이는 사이 시간이 지났어요.',
  recorded: '📝 기록장에 남겼어요',
  seatAll: '반 전체',
  seatSuffix: '번',
};
