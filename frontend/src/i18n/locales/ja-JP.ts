export default {
  common: {
    welcome: 'Voice Chat Assistantへようこそ',
    loading: '読み込み中...',
    error: 'エラーが発生しました',
    success: '成功',
    cancel: 'キャンセル',
    save: '保存',
    delete: '削除',
    edit: '編集',
    close: '閉じる',
    back: '戻る',
    next: '次へ',
    submit: '送信',
    confirm: '確認',
    yes: 'はい',
    no: 'いいえ',
    search: '検索',
    settings: '設定',
    language: '言語',
    theme: 'テーマ',
    darkMode: 'ダークモード',
    lightMode: 'ライトモード',
    logout: 'ログアウト',
    login: 'ログイン',
    register: '登録',
    profile: 'プロフィール',
    home: 'ホーム',
    about: 'について',
    contact: 'お問い合わせ',
    help: 'ヘルプ',
    documentation: 'ドキュメント',
    version: 'バージョン',
    idle: 'アイドル',
    enterFullscreen: '全画面表示',
    exitFullscreen: '全画面終了',
    allRightsReserved: '全著作権所有',
    logs: 'ログ',
    source: 'ソース'
  },
  auth: {
    loginTitle: 'サインイン',
    loginSubtitle: 'おかえりなさい',
    email: 'メールアドレス',
    password: 'パスワード',
    rememberMe: 'ログイン状態を保持',
    forgotPassword: 'パスワードをお忘れですか？',
    noAccount: 'アカウントをお持ちでない方',
    signUp: 'サインアップ',
    loginSuccess: 'ログインに成功しました',
    loginError: '無効な認証情報',
    logoutSuccess: 'ログアウトしました'
  },
  voice: {
    recording: '録音中...',
    processing: '音声処理中...',
    listening: '聞いています...',
    speaking: '話しています...',
    mute: 'ミュート',
    unmute: 'ミュート解除',
    transcribing: '音声の文字起こし中...',
    speakNow: '今すぐお話しください',
    clickToSpeak: 'クリックして話す',
    stopRecording: '録音停止',
    microphoneAccess: 'マイクアクセスが必要です',
    noSpeechDetected: '音声が検出されませんでした',
    transcriptionComplete: '文字起こし完了'
  },
  chat: {
    thinking: '考え中...',
    generating: '回答生成中...',
    messageEmpty: 'メッセージを入力してください',
    sendMessage: 'メッセージを送信',
    newChat: '新しいチャット',
    clearHistory: '履歴を削除',
    typingIndicator: 'AIが入力中...',
    copyCode: 'コードをコピー',
    codeCopied: 'コードをクリップボードにコピーしました',
    retry: '再試行',
    regenerate: '回答を再生成'
  },
  modes: {
    coding: 'プログラミングQ&A',
    codingDesc: 'プログラミングの質問とコード例について支援します',
    systemDesign: 'システム設計',
    systemDesignDesc: 'アーキテクチャ設計と図表作成',
    meetingSummary: '会議要約',
    meetingSummaryDesc: '会議の要約と重要なポイントの抽出',
    general: '一般',
    generalDesc: '一般的な会話と質問'
  },
  cost: {
    title: 'API使用量',
    current: '現在のセッション',
    total: '総使用量',
    threshold: 'コストしきい値',
    warning: 'コスト制限に近づいています',
    exceeded: 'コスト制限を超過しました',
    reset: 'カウンターをリセット'
  },
  settings: {
    title: '設定',
    speechRecognition: '音声認識',
    whisperAPI: 'Whisper API',
    browserSpeech: 'ブラウザー音声認識',
    textToSpeech: 'テキスト読み上げ',
    openAITTS: 'OpenAI TTS',
    browserTTS: 'ブラウザーTTS',
    apiKeys: 'APIキー',
    openAIKey: 'OpenAI APIキー',
    anthropicKey: 'Anthropic APIキー',
    modelPreferences: 'モデル設定',
    costLimits: 'コスト制限',
    sessionLimit: 'セッション制限',
    dailyLimit: '日次制限',
    monthlyLimit: '月次制限',
    languageSettings: '言語設定',
    selectLanguage: 'お好みの言語を選択してください',
    themeSettings: 'テーマ設定',
    selectTheme: 'テーマを選択'
  },
  errors: {
    general: 'エラーが発生しました',
    network: 'ネットワークエラー',
    notFound: '見つかりません',
    unauthorized: '認証されていません',
    forbidden: '禁止されています',
    serverError: 'サーバーエラー',
    timeout: 'リクエストがタイムアウトしました',
    offline: 'オフラインのようです'
  },
  navigation: {
    dashboard: 'ダッシュボード',
    chat: 'チャット',
    history: '履歴',
    settings: '設定',
    help: 'ヘルプ',
    about: 'について',
    profile: 'プロフィール',
    logout: 'ログアウト',
    exploreAssistants: 'アシスタントを探索'
  },
  status: {
    online: 'オンライン',
    degraded: '低下',
    offline: 'オフライン',
    checking: '確認中'
  },
  agent: {
    defaultName: 'アシスタント',
    ready: '{name}の準備ができました',
    defaultPlaceholder: '今日はどのようなお手伝いをいたしましょうか？',
    typing: '{name}が入力中です...'
  },
  meetingSummaries: {
    title: '会議要約',
    noSummariesFound: '条件に一致する会議要約が見つかりませんでした。',
    loadingSummaries: '要約を読み込み中...',
    toggleFilters: 'フィルターを切り替え',
    importSummaries: '要約をインポート',
    exportAll: '全ての要約をエクスポート（JSON）',
    searchPlaceholder: '要約を検索...',
    tags: 'タグ（いずれか選択）：',
    actionItemAssignee: 'アクション項目の担当者：',
    anyAssignee: '任意の担当者',
    sortBy: '並び順：',
    lastUpdated: '最終更新',
    meetingDate: '会議日',
    dateCreated: '作成日',
    titleSort: 'タイトル',
    openActionItems: '未完了のアクション項目',
    order: '順序：',
    descending: '降順',
    ascending: '昇順',
    hasOpenActions: '未完了アクションあり',
    showArchivedOnly: 'アーカイブ済みのみ表示',
    clearAllFilters: '全フィルターをクリア',
    openItems: '未完了',
    archived: 'アーカイブ済み',
    archiveSummary: '要約をアーカイブ',
    unarchiveSummary: 'アーカイブを解除',
    deleteSummary: '要約を削除',
    clearAllHistory: '全履歴をクリア'
  },
  agents: {
    nerf: {
      name: 'Nerf',
      description: 'クイック質問と情報提供のための親しみやすく効率的な汎用AI。',
      longDescription: 'Nerfは、直接的な質疑応答、素早い事実確認、定義、簡単な説明に特化しています。明確性と簡潔性を重視し、日常的な問い合わせに最適です。',
      placeholder: 'Nerfに何でも聞いてください...'
    },
    codePilot: {
      name: 'CodePilot',
      description: '複数の言語でのコーディング、デバッグ、解説の専門支援。',
      placeholder: 'CodePilotにコードについて質問してください...'
    },
    architectron: {
      name: 'Architectron',
      description: '複雑なソフトウェアとシステムアーキテクチャを協力して設計・図式化。',
      placeholder: '設計するシステムを説明してください...'
    },
    meetingScribe: {
      name: 'ミーティングスクライブ',
      description: '会議のメモや記録を、アクションアイテム付きの明確で構造化された要約に処理。',
      placeholder: 'メモを貼り付けるか、要約する議論を口述してください...'
    },
    echo: {
      name: 'Echo',
      description: '反省と思考整理のための個人的で共感的なAI日記・記録係。',
      placeholder: 'Echoにあなたの思いを共有してください...'
    },
    aiInterviewer: {
      name: 'AIインタビュアー',
      description: '技術コーディング面接をシミュレートし、問題を提供して解答を評価。',
      placeholder: 'モック・コーディング面接の準備はできていますか？'
    },
    professorAstra: {
      name: 'アストラ教授',
      description: '主題探索と概念習得のための適応型AIチューター。',
      placeholder: '今日はどのトピックを学びましょうか？'
    },
    lcAudit: {
      name: 'LC-Audit',
      description: 'LeetCode問題の詳細分析と面接補助。',
      placeholder: 'LC-Audit分析用の問題コンテキストを提供してください...'
    }
  },
  vAgent: {
    name: 'V',
    online: '{name} オンライン',
    description: '複雑なタスクと探索のための高度でダイナミックかつ洞察力のあるAIアシスタント。',
    longDescription: 'Vは、ニュアンスのある議論に参加し、複雑な情報を統合し、包括的で適切に表現された回答を提供するように設計された強力な博学AIです。深掘り、創造的ブレインストーミング、戦略的思考に最適です。',
    placeholder: 'Vに複雑な質問や探索を投げかけてください...'
  }
};
