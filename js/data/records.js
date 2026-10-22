// 수업 후 기록 카드 6장 + 마지막 문항 (기획안 4-4)
export const postIntro = {
  title: '수업 후 · 조치',
  guide: '수업이 끝났어요. 기록장을 보며 마무리해 주세요.',
  empty: '기록장이 비어 있어요. 기록하지 않은 문제는 다음 수업에 다시 생깁니다.',
  unrecordedTitle: '기록하지 않은 문제',
  unrecordedTail: '다음 수업에 다시 생깁니다',
};

export const records = [
  { id: 'rec_device12', title: '12번 태블릿', category: '기기 · 연계', text: '12번 태블릿이 2주째 멈춰요.',
    choices: [
      { text: '기기번호·증상·발생 시각을 정리해 정보 담당 선생님께 전달하고 수리 접수(테크센터)를 요청한다', score: 10, feedback: '관찰→기록→보고→조치 확인. 맞는 사람에게 정확히 연결했어요.' },
      { text: '다음 시간에 또 보고 판단한다', score: 0, feedback: '이미 2주째예요. 기록이 있으니 지금 연결할 때예요.' },
      { text: '충전함에 그냥 넣어 둔다', score: 0, feedback: '다음 수업에 이 기기를 받은 학생이 또 멈춰요.' },
      { text: '직접 열어서 고쳐 본다', score: -5, feedback: '학교 기기를 임의로 분해하면 수리·보증이 어려워져요.' },
    ] },
  { id: 'rec_charger', title: '15번 충전', category: '기기 · 물품', text: '15번 기기가 충전함에서 충전이 안 돼요.',
    choices: [
      { text: '충전함 칸 번호를 확인해 정보 담당 선생님께 전달하고 행정실(수리·물품)로 연결한다', score: 10, feedback: '물품·수리는 행정실로. 칸 번호까지 남겨 정확히 연결했어요.' },
      { text: '정보 담당 선생님께 "충전이 안 돼요"라고만 전한다', score: 5, feedback: '방향은 맞지만 어느 칸인지 몰라 다시 찾아야 해요.' },
      { text: '다른 칸에 꽂고 끝낸다', score: 0, feedback: '고장 난 칸은 그대로라 다음 기기도 충전이 안 돼요.' },
      { text: '케이블을 집에서 가져온다', score: -5, feedback: '검증되지 않은 개인 물품은 학교 기기에 쓰지 않아요.' },
    ] },
  { id: 'rec_student', title: '18번 학생', category: '참여 · 공유', text: '18번 학생이 수업 중 조용히 이탈했었어요.',
    choices: [
      { text: '담임 선생님께만 짧게 공유하고, 다음 수업 자리·지원 방법을 협의한다', score: 10, feedback: '필요한 사람에게만. 다음 수업에서 먼저 살필 수 있어요.' },
      { text: '다른 학생들 앞에서 이야기한다', score: -5, feedback: '학생의 어려움을 공개하면 다음 수업에 더 숨게 돼요.' },
      { text: '공유하지 않는다', score: 0, feedback: '같은 신호가 다음 수업에도 반복될 수 있어요.' },
      { text: '반 단톡방에 공유한다', score: -5, feedback: '학생 정보는 필요한 사람에게만. 단톡방은 공개 지적이 돼요.' },
    ] },
  { id: 'rec_privacy', title: '전자칠판 화면', category: '보안 · 보고', text: '학생 이름·점수 화면이 전자칠판에 노출됐었어요.',
    choices: [
      { text: '무엇이 노출됐는지 기록하고 담당 선생님께 보고한다', score: 10, feedback: '누가 잘못했는지보다 무엇이 노출됐는지가 먼저예요.' },
      { text: '담당 선생님께 "화면에 점수가 떴었어요"라고만 전한다', score: 5, feedback: '보고는 했지만 어떤 정보가 얼마나 보였는지 빠졌어요.' },
      { text: '별일 아니니 넘어간다', score: 0, feedback: '노출 사고는 작아도 기록과 보고가 필요해요.' },
      { text: '사진 찍어 증거로 남긴다', score: -5, feedback: '개인정보를 한 번 더 복제했어요. 사진 대신 기록으로 남겨요.' },
    ] },
];

// 마지막 문항: record가 기록장에 있으면 +10, 기록장이 비었으면 fallback 선택지가 +10
export const finalQuestion = {
  title: '마지막 문항',
  category: '조치 확인',
  text: '다음 수업 전에 꼭 점검할 것 1개는?',
  matchPool: [
    { record: 'rec_device12', text: '12번 태블릿 수리 접수가 됐는지 확인한다' },
    { record: 'rec_charger', text: '충전함 15번 칸 수리 여부를 확인한다' },
    { record: 'rec_student', text: '18번 학생 자리·지원 방법을 담임 선생님과 확인한다' },
    { record: 'rec_privacy', text: '전자칠판에 띄울 화면을 선생님과 미리 확인한다' },
  ],
  fallback: { text: '선생님과 수업 전 5분 루틴(충전·접속·로그인)을 함께 점검한다', scoreEmpty: 10, scoreElse: 5 },
  zero: { text: '새로 나온 AI 앱을 먼저 깔아 보고 수업에 쓸지 정한다', score: 0 },
  wrong: { text: '시간 절약을 위해 학생 기기에 미리 로그인해 둔다', score: -5 },
  feedback: {
    match: '기록장에 남긴 문제를 다음 수업 전에 확인하는 것, 그게 조치 확인이에요.',
    fallback: '좋은 루틴이에요. 기록장에 남긴 문제를 먼저 확인했다면 더 좋아요.',
    fallbackBest: '기록이 없을 땐 기본 루틴부터. 다음 수업엔 기록도 남겨 봐요.',
    zero: '수업 전 시간은 새 도구보다 이미 생긴 문제를 확인하는 데 써요.',
    wrong: '학생 계정 임의 로그인 금지. 대신 하지 않기.',
  },
};
