// 수업 전 점검 카드 8장 (기획안 4-2)
// unpickFlag: 고르지 않았을 때 켜지는 flags 키
export const prepIntro = {
  title: '수업 시작 10분 전',
  guide: '준비할 시간이 부족해요. 4장만 고르세요.',
  limitToast: '4장까지만 고를 수 있어요',
  resultTitle: '준비 결과',
};

export const prepCards = [
  { id: 'prep_charge', icon: '🔋', text: '충전함 배터리 확인', good: true, score: 10, unpickFlag: 'battery_low',
    feedback: '충전 상태를 확인해 두면 수업 중 배터리 문제가 생기지 않아요.' },
  { id: 'prep_wifi', icon: '📶', text: '교실 Wi-Fi 2~3대 동시 접속 테스트', good: true, score: 10, unpickFlag: 'wifi_three',
    feedback: '여러 대가 동시에 붙는지 미리 보면 수업 중 집단 끊김을 막을 수 있어요.' },
  { id: 'prep_login', icon: '🔗', text: '패들렛 주소·QR 준비, 로그인 테스트', good: true, score: 10, unpickFlag: 'url_error',
    feedback: '주소와 로그인을 미리 확인하면 반 전체가 멈추는 일을 막아요.' },
  { id: 'prep_teacher', icon: '🤝', text: '선생님과 역할·호출 기준 합의', good: true, score: 10, unpickFlag: 'noTeacherDeal',
    feedback: '교사-튜터 5분 루틴. 언제 선생님을 부를지 정해 두면 판단이 빨라져요.' },
  { id: 'prep_backup', icon: '📄', text: '종이 대체 활동지 준비', good: true, score: 10, unpickFlag: 'noBackup',
    feedback: '접속이 안 돼도 수업이 이어질 수 있는 비상구예요.' },
  { id: 'prep_seat', icon: '🪑', text: '도움이 필요한 학생 자리 확인', good: true, score: 10, unpickFlag: 'extraHidden',
    feedback: '어디를 먼저 볼지 알면 조용한 학생을 놓치지 않아요.' },
  { id: 'prep_pw_list', icon: '🔑', text: '학생 비밀번호 목록을 미리 받아 메모', good: false, score: -10, unpickFlag: null,
    feedback: '보안 수칙 1번 위반. 학생 비밀번호는 튜터가 보관하지 않아요.' },
  { id: 'prep_prelogin', icon: '⏩', text: '시간 절약을 위해 학생 기기에 미리 대신 로그인', good: false, score: -10, unpickFlag: null,
    feedback: '학생 계정 임의 로그인 금지. 대신 하지 않고, 학생이 직접 접속하게 해요.' },
];
