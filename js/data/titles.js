// 칭호·다음 판 과제 (기획안 4-5)
export const titles = {
  guard: { icon: '🛡', name: '수업 지킴이', text: '준비·대처·마무리 모두 40분을 지켰어요' },
  prep: { icon: '📋', name: '준비의 달인', text: '준비한 만큼 수업이 지켜졌어요' },
  live: { icon: '👀', name: '대처의 달인', text: '조용한 학생까지 놓치지 않았어요' },
  post: { icon: '🔗', name: '마무리의 달인', text: '문제를 맞는 사람에게 정확히 연결했어요' },
};

export const nextTasks = {
  prep: '점검 카드를 다시 골라 보세요. 고르지 않은 준비가 수업 중 문제가 됐어요.',
  live: '대신 하지 말고, 조용한 학생부터 살펴보세요.',
  post: '누구에게 연결해야 하는지 다시 보세요. 기록하지 않은 문제는 다음 수업에 다시 생깁니다.',
};

export const resultLabels = { total: '총점', nextTask: '다음 판 과제', code: '결과 코드', codeHint: '수업 전%-수업 중%-수업 후%-칭호 · 패들렛에 올려 공유해요', unit: '명' };

export const phaseNames = { prep: '수업 전', live: '수업 중', post: '수업 후' };

// 놓친 학생 리포트: gap이 있으면 "○○ 격차", 없으면 category 앞 단어 + " 문제"
export const missedText = {
  none: '놓친 학생 없이 40분을 지켰어요',
  gapSuffix: ' 격차',
  issueSuffix: ' 문제',
};
