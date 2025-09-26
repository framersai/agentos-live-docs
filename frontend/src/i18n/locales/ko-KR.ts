export default {
  common: {
    welcome: 'Voice Chat Assistant에 오신 것을 환영합니다',
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    success: '성공',
    cancel: '취소',
    save: '저장',
    delete: '삭제',
    edit: '편집',
    close: '닫기',
    back: '뒤로',
    next: '다음',
    submit: '제출',
    confirm: '확인',
    yes: '예',
    no: '아니오',
    search: '검색',
    settings: '설정',
    language: '언어',
    theme: '테마',
    darkMode: '다크 모드',
    lightMode: '라이트 모드',
    logout: '로그아웃',
    login: '로그인',
    register: '회원가입',
    profile: '프로필',
    home: '홈',
    about: '정보',
    contact: '연락처',
    help: '도움말',
    documentation: '문서',
    version: '버전',
    idle: '유휴',
    enterFullscreen: '전체 화면',
    exitFullscreen: '전체 화면 종료',
    allRightsReserved: '모든 권리 보유',
    logs: '로그',
    source: '소스'
  },
  auth: {
    loginTitle: '로그인',
    loginSubtitle: '돌아오신 것을 환영합니다',
    email: '이메일',
    password: '비밀번호',
    rememberMe: '로그인 상태 유지',
    forgotPassword: '비밀번호를 잊으셨나요?',
    noAccount: '계정이 없으신가요?',
    signUp: '회원가입',
    loginSuccess: '로그인에 성공했습니다',
    loginError: '잘못된 로그인 정보',
    logoutSuccess: '로그아웃되었습니다'
  },
  voice: {
    recording: '녹음 중...',
    processing: '음성 처리 중...',
    listening: '듣는 중...',
    speaking: '말하는 중...',
    mute: '음소거',
    unmute: '음소거 해제',
    transcribing: '음성 변환 중...',
    speakNow: '지금 말씀하세요',
    clickToSpeak: '클릭하여 말하기',
    stopRecording: '녹음 중지',
    microphoneAccess: '마이크 접근 권한이 필요합니다',
    noSpeechDetected: '음성이 감지되지 않았습니다',
    transcriptionComplete: '음성 변환 완료'
  },
  chat: {
    thinking: '생각 중...',
    generating: '답변 생성 중...',
    messageEmpty: '메시지를 입력해주세요',
    sendMessage: '메시지 보내기',
    newChat: '새 채팅',
    clearHistory: '기록 삭제',
    typingIndicator: 'AI가 입력 중...',
    copyCode: '코드 복사',
    codeCopied: '코드가 클립보드에 복사되었습니다',
    retry: '다시 시도',
    regenerate: '답변 재생성'
  },
  modes: {
    coding: '프로그래밍 Q&A',
    codingDesc: '프로그래밍 질문과 코드 예제에 대한 도움을 받으세요',
    systemDesign: '시스템 설계',
    systemDesignDesc: '아키텍처 설계 및 다이어그램 작성',
    meetingSummary: '회의 요약',
    meetingSummaryDesc: '회의 요약 및 핵심 포인트 추출',
    general: '일반',
    generalDesc: '일반적인 대화 및 질문'
  },
  cost: {
    title: 'API 사용량',
    current: '현재 세션',
    total: '총 사용량',
    threshold: '비용 임계값',
    warning: '비용 한도에 근접',
    exceeded: '비용 한도 초과',
    reset: '카운터 초기화'
  },
  settings: {
    title: '설정',
    speechRecognition: '음성 인식',
    whisperAPI: 'Whisper API',
    browserSpeech: '브라우저 음성 인식',
    textToSpeech: '텍스트 음성 변환',
    openAITTS: 'OpenAI TTS',
    browserTTS: '브라우저 TTS',
    apiKeys: 'API 키',
    openAIKey: 'OpenAI API 키',
    anthropicKey: 'Anthropic API 키',
    modelPreferences: '모델 설정',
    costLimits: '비용 제한',
    sessionLimit: '세션 제한',
    dailyLimit: '일일 제한',
    monthlyLimit: '월간 제한',
    languageSettings: '언어 설정',
    selectLanguage: '선호하는 언어를 선택하세요',
    themeSettings: '테마 설정',
    selectTheme: '테마 선택'
  },
  errors: {
    general: '오류가 발생했습니다',
    network: '네트워크 오류',
    notFound: '찾을 수 없습니다',
    unauthorized: '인증되지 않음',
    forbidden: '금지됨',
    serverError: '서버 오류',
    timeout: '요청 시간 초과',
    offline: '오프라인 상태입니다'
  },
  navigation: {
    dashboard: '대시보드',
    chat: '채팅',
    history: '기록',
    settings: '설정',
    help: '도움말',
    about: '정보',
    profile: '프로필',
    logout: '로그아웃',
    exploreAssistants: '어시스턴트 탐색'
  },
  status: {
    online: '온라인',
    degraded: '성능 저하',
    offline: '오프라인',
    checking: '확인 중'
  },
  agent: {
    defaultName: '어시스턴트',
    ready: '{name}가 준비되었습니다',
    defaultPlaceholder: '오늘 어떻게 도움을 드릴까요?',
    typing: '{name}가 입력 중입니다...'
  },
  meetingSummaries: {
    title: '회의 요약',
    noSummariesFound: '조건에 맞는 회의 요약을 찾을 수 없습니다.',
    loadingSummaries: '요약 로딩 중...',
    toggleFilters: '필터 토글',
    importSummaries: '요약 가져오기',
    exportAll: '모든 요약 내보내기 (JSON)',
    searchPlaceholder: '요약 검색...',
    tags: '태그 (아무거나 선택):',
    actionItemAssignee: '액션 아이템 담당자:',
    anyAssignee: '모든 담당자',
    sortBy: '정렬 기준:',
    lastUpdated: '최종 업데이트',
    meetingDate: '회의 날짜',
    dateCreated: '생성 날짜',
    titleSort: '제목',
    openActionItems: '미완료 액션 아이템',
    order: '순서:',
    descending: '내림차순',
    ascending: '오름차순',
    hasOpenActions: '미완료 액션 있음',
    showArchivedOnly: '보관된 것만 표시',
    clearAllFilters: '모든 필터 지우기',
    openItems: '미완료',
    archived: '보관됨',
    archiveSummary: '요약 보관',
    unarchiveSummary: '보관 해제',
    deleteSummary: '요약 삭제',
    clearAllHistory: '모든 기록 지우기'
  },
  agents: {
    nerf: {
      name: 'Nerf',
      description: '빠른 질문과 정보를 위한 친근하고 효율적인 범용 AI.',
      longDescription: 'Nerf는 직접적인 질의응답, 빠른 사실 확인, 정의 및 간단한 설명을 위해 설계되었습니다. 명확성과 간결성을 추구하여 일상적인 문의에 이상적입니다.',
      placeholder: 'Nerf에게 무엇이든 물어보세요...'
    },
    codePilot: {
      name: 'CodePilot',
      description: '여러 언어에서 코딩, 디버깅 및 설명에 대한 전문적 지원.',
      placeholder: 'CodePilot에게 코드에 대해 문의하세요...'
    },
    architectron: {
      name: 'Architectron',
      description: '복잡한 소프트웨어 및 시스템 아키텍처를 협력적으로 설계하고 다이어그램을 작성.',
      placeholder: '설계할 시스템을 설명해주세요...'
    },
    meetingScribe: {
      name: '회의 서기관',
      description: '회의 노트나 녹취록을 액션 아이템이 포함된 명확하고 구조화된 요약으로 처리.',
      placeholder: '요약할 노트를 붙여넣거나 토론을 받아쓰세요...'
    },
    echo: {
      name: 'Echo',
      description: '성찰과 생각 정리를 위한 개인적이고 공감적인 AI 일기 및 노트 작성자.',
      placeholder: 'Echo와 당신의 생각을 공유하세요...'
    },
    aiInterviewer: {
      name: 'AI 면접관',
      description: '기술 코딩 면접을 시뮬레이션하여 문제를 제공하고 솔루션을 평가.',
      placeholder: '모의 코딩 면접 준비가 되셨나요?'
    },
    professorAstra: {
      name: '아스트라 교수',
      description: '주제 탐구와 개념 습득을 위한 적응형 AI 튜터.',
      placeholder: '오늘 어떤 주제를 학습할까요?'
    },
    lcAudit: {
      name: 'LC-Audit',
      description: 'LeetCode 문제 심층 분석 및 면접 보조.',
      placeholder: 'LC-Audit 분석을 위한 문제 컨텍스트를 제공하세요...'
    }
  },
  vAgent: {
    name: 'V',
    online: '{name} 온라인',
    description: '복잡한 작업과 탐색을 위한 고급 동적 통찰력 있는 AI 어시스턴트.',
    longDescription: 'V는 미묘한 토론에 참여하고, 복잡한 정보를 종합하며, 포괄적이고 잘 표현된 답변을 제공하도록 설계된 강력하고 다방면에 능한 AI입니다. 심층 분석, 창의적 브레인스토밍 및 전략적 사고에 이상적입니다.',
    placeholder: 'V에게 복잡한 질문이나 탐색을 제시하세요...'
  }
};
