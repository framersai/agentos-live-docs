export default {
  common: {
    welcome: 'Willkommen bei Voice Chat Assistant',
    loading: 'Laden...',
    error: 'Ein Fehler ist aufgetreten',
    success: 'Erfolgreich',
    cancel: 'Abbrechen',
    save: 'Speichern',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    close: 'Schließen',
    back: 'Zurück',
    next: 'Weiter',
    submit: 'Absenden',
    confirm: 'Bestätigen',
    yes: 'Ja',
    no: 'Nein',
    search: 'Suchen',
    settings: 'Einstellungen',
    language: 'Sprache',
    theme: 'Thema',
    darkMode: 'Dunkler Modus',
    lightMode: 'Heller Modus',
    logout: 'Abmelden',
    login: 'Anmelden',
    register: 'Registrieren',
    profile: 'Profil',
    home: 'Startseite',
    about: 'Über',
    contact: 'Kontakt',
    help: 'Hilfe',
    documentation: 'Dokumentation',
    version: 'Version',
    idle: 'Inaktiv',
    enterFullscreen: 'Vollbild',
    exitFullscreen: 'Vollbild verlassen',
    allRightsReserved: 'Alle Rechte vorbehalten',
    logs: 'Protokolle',
    source: 'Quelle'
  },
  auth: {
    loginTitle: 'Anmelden',
    loginSubtitle: 'Willkommen zurück',
    email: 'E-Mail',
    password: 'Passwort',
    rememberMe: 'Angemeldet bleiben',
    forgotPassword: 'Passwort vergessen?',
    noAccount: 'Noch kein Konto?',
    signUp: 'Registrieren',
    loginSuccess: 'Erfolgreich angemeldet',
    loginError: 'Ungültige Anmeldedaten',
    logoutSuccess: 'Erfolgreich abgemeldet'
  },
  voice: {
    recording: 'Aufnahme...',
    processing: 'Sprachverarbeitung...',
    listening: 'Hört zu...',
    speaking: 'Spricht...',
    mute: 'Stumm schalten',
    unmute: 'Ton einschalten',
    transcribing: 'Transcribing audio...',
    listening: 'Listening...',
    speakNow: 'Speak now',
    clickToSpeak: 'Click to speak',
    stopRecording: 'Stop recording',
    microphoneAccess: 'Microphone access required',
    noSpeechDetected: 'No speech detected',
    transcriptionComplete: 'Transcription complete'
  },
  chat: {
    thinking: 'Thinking...',
    generating: 'Generating response...',
    messageEmpty: 'Message cannot be empty',
    sendMessage: 'Send message',
    newChat: 'New chat',
    clearHistory: 'Clear history',
    typingIndicator: 'AI is typing...',
    copyCode: 'Copy code',
    codeCopied: 'Code copied to clipboard',
    retry: 'Retry',
    regenerate: 'Regenerate response'
  },
  modes: {
    coding: 'Coding Q&A',
    codingDesc: 'Get help with programming questions and code examples',
    systemDesign: 'System Design',
    systemDesignDesc: 'Design architecture and create diagrams',
    meetingSummary: 'Meeting Summary',
    meetingSummaryDesc: 'Summarize meetings and extract key points',
    general: 'General',
    generalDesc: 'General conversation and questions'
  },
  cost: {
    title: 'API Usage',
    current: 'Current Session',
    total: 'Total Usage',
    threshold: 'Cost Threshold',
    warning: 'Approaching cost limit',
    exceeded: 'Cost limit exceeded',
    reset: 'Reset Counter'
  },
  settings: {
    title: 'Settings',
    speechRecognition: 'Speech Recognition',
    whisperAPI: 'Whisper API',
    browserSpeech: 'Browser Speech',
    textToSpeech: 'Text to Speech',
    openAITTS: 'OpenAI TTS',
    browserTTS: 'Browser TTS',
    apiKeys: 'API Keys',
    openAIKey: 'OpenAI API Key',
    anthropicKey: 'Anthropic API Key',
    modelPreferences: 'Model Preferences',
    costLimits: 'Cost Limits',
    sessionLimit: 'Session Limit',
    dailyLimit: 'Daily Limit',
    monthlyLimit: 'Monthly Limit',
    languageSettings: 'Language Settings',
    selectLanguage: 'Select your preferred language',
    themeSettings: 'Theme Settings',
    selectTheme: 'Select theme'
  },
  errors: {
    general: 'Ein Fehler ist aufgetreten',
    network: 'Netzwerkfehler',
    notFound: 'Nicht gefunden',
    unauthorized: 'Nicht autorisiert',
    forbidden: 'Verboten',
    serverError: 'Serverfehler',
    timeout: 'Anfrage abgelaufen',
    offline: 'Sie scheinen offline zu sein'
  },
  navigation: {
    dashboard: 'Dashboard',
    chat: 'Chat',
    history: 'Verlauf',
    settings: 'Einstellungen',
    help: 'Hilfe',
    about: 'Über',
    profile: 'Profil',
    logout: 'Abmelden',
    exploreAssistants: 'Assistenten Erkunden'
  },
  status: {
    online: 'Online',
    degraded: 'Eingeschränkt',
    offline: 'Offline',
    checking: 'Prüfung'
  },
  agent: {
    defaultName: 'Assistent',
    ready: '{name} ist bereit',
    defaultPlaceholder: 'Wie kann ich Ihnen heute helfen?',
    typing: '{name} tippt...'
  },
  meetingSummaries: {
    title: 'Besprechungszusammenfassungen',
    noSummariesFound: 'Keine Besprechungszusammenfassungen gefunden, die Ihren Kriterien entsprechen.',
    loadingSummaries: 'Zusammenfassungen werden geladen...',
    toggleFilters: 'Filter umschalten',
    importSummaries: 'Zusammenfassungen importieren',
    exportAll: 'Alle Zusammenfassungen exportieren (JSON)',
    searchPlaceholder: 'Zusammenfassungen suchen...',
    tags: 'Schlagwörter (beliebige auswählen):',
    actionItemAssignee: 'Aktionspunkt-Verantwortlicher:',
    anyAssignee: 'Beliebiger Verantwortlicher',
    sortBy: 'Sortieren nach:',
    lastUpdated: 'Zuletzt aktualisiert',
    meetingDate: 'Besprechungsdatum',
    dateCreated: 'Erstellungsdatum',
    titleSort: 'Titel',
    openActionItems: 'Offene Aktionspunkte',
    order: 'Reihenfolge:',
    descending: 'Absteigend',
    ascending: 'Aufsteigend',
    hasOpenActions: 'Hat offene Aktionen',
    showArchivedOnly: 'Nur archivierte anzeigen',
    clearAllFilters: 'Alle Filter löschen',
    openItems: 'offen',
    archived: 'Archiviert',
    archiveSummary: 'Zusammenfassung archivieren',
    unarchiveSummary: 'Archivierung aufheben',
    deleteSummary: 'Zusammenfassung löschen',
    clearAllHistory: 'Gesamten Verlauf löschen'
  },
  agents: {
    nerf: {
      name: 'Nerf',
      description: 'Ihre freundliche und effiziente Allzweck-KI für schnelle Fragen und Informationen.',
      longDescription: 'Nerf ist für direkte Fragen und Antworten, schnelle Fakten, Definitionen und einfache Erklärungen konzipiert. Es zielt auf Klarheit und Prägnanz ab und ist ideal für alltägliche Anfragen.',
      placeholder: 'Fragen Sie Nerf alles...'
    },
    codePilot: {
      name: 'CodePilot',
      description: 'Experten-Codierungshilfe, Debugging und Erklärungen in mehreren Sprachen.',
      placeholder: 'Fragen Sie CodePilot nach Code...'
    },
    architectron: {
      name: 'Architectron',
      description: 'Entwerfen und diagrammieren Sie kollaborativ komplexe Software- und Systemarchitekturen.',
      placeholder: 'Beschreiben Sie das zu entwerfende System...'
    },
    meetingScribe: {
      name: 'Besprechungsprotokollant',
      description: 'Verarbeitet Ihre Besprechungsnotizen oder Transkripte in klare, strukturierte Zusammenfassungen mit Aktionspunkten.',
      placeholder: 'Notizen einfügen oder Diskussion diktieren für Zusammenfassung...'
    },
    echo: {
      name: 'Echo',
      description: 'Ihr persönliches, einfühlsames KI-Tagebuch für Reflexion und Gedankenorganisation.',
      placeholder: 'Teilen Sie Ihre Gedanken mit Echo...'
    },
    aiInterviewer: {
      name: 'KI-Interviewer',
      description: 'Simuliert ein technisches Codierungs-Interview und bietet Probleme und bewertet Lösungen.',
      placeholder: 'Bereit für Ihr Mock-Coding-Interview?'
    },
    professorAstra: {
      name: 'Professor Astra',
      description: 'Ihr adaptiver KI-Tutor für die Erkundung von Themen und die Beherrschung von Konzepten.',
      placeholder: 'Welches Thema sollen wir heute lernen?'
    },
    lcAudit: {
      name: 'LC-Audit',
      description: 'Tiefgreifende LeetCode-Problemanalyse und Interview-Hilfe.',
      placeholder: 'Problemkontext für LC-Audit-Analyse bereitstellen...'
    }
  },
  vAgent: {
    name: 'V',
    online: '{name} Online',
    description: 'Fortschrittlicher, dynamischer und aufschlussreicher KI-Assistent für komplexe Aufgaben und Erkundungen.',
    longDescription: 'V ist eine mächtige, polymathische KI, die darauf ausgelegt ist, nuancierte Diskussionen zu führen, komplexe Informationen zu synthetisieren und umfassende, gut artikulierte Antworten zu liefern. Ideal für tiefere Einblicke, kreatives Brainstorming und strategisches Denken.',
    placeholder: 'Stellen Sie Ihre komplexe Anfrage oder Erkundung an V...'
  }
};