export default {
  common: {
    welcome: 'Benvenuto in Voice Chat Assistant',
    loading: 'Caricamento...',
    error: 'Si è verificato un errore',
    success: 'Successo',
    cancel: 'Annulla',
    save: 'Salva',
    delete: 'Elimina',
    edit: 'Modifica',
    close: 'Chiudi',
    back: 'Indietro',
    next: 'Avanti',
    submit: 'Invia',
    confirm: 'Conferma',
    yes: 'Sì',
    no: 'No',
    search: 'Cerca',
    settings: 'Impostazioni',
    language: 'Lingua',
    theme: 'Tema',
    darkMode: 'Modalità scura',
    lightMode: 'Modalità chiara',
    logout: 'Esci',
    login: 'Accedi',
    register: 'Registrati',
    profile: 'Profilo',
    home: 'Home',
    about: 'Informazioni',
    contact: 'Contatto',
    help: 'Aiuto',
    documentation: 'Documentazione',
    version: 'Versione',
    idle: 'Inattivo',
    enterFullscreen: 'Schermo intero',
    exitFullscreen: 'Esci da schermo intero',
    allRightsReserved: 'Tutti i diritti riservati',
    logs: 'Registri',
    source: 'Fonte'
  },
  auth: {
    loginTitle: 'Accedi',
    loginSubtitle: 'Bentornato',
    email: 'Email',
    password: 'Password',
    rememberMe: 'Ricordami',
    forgotPassword: 'Password dimenticata?',
    noAccount: 'Non hai un account?',
    signUp: 'Registrati',
    loginSuccess: 'Accesso effettuato con successo',
    loginError: 'Credenziali non valide',
    logoutSuccess: 'Disconnessione effettuata con successo'
  },
  voice: {
    recording: 'Registrazione...',
    processing: 'Elaborazione vocale...',
    listening: 'Ascolto...',
    speaking: 'Parlando...',
    mute: 'Disattiva audio',
    unmute: 'Attiva audio',
    transcribing: 'Trascrizione audio...',
    speakNow: 'Parla ora',
    clickToSpeak: 'Clicca per parlare',
    stopRecording: 'Interrompi registrazione',
    microphoneAccess: 'Accesso al microfono richiesto',
    noSpeechDetected: 'Nessun discorso rilevato',
    transcriptionComplete: 'Trascrizione completata'
  },
  chat: {
    thinking: 'Pensando...',
    generating: 'Generazione risposta...',
    messageEmpty: 'Il messaggio non può essere vuoto',
    sendMessage: 'Invia messaggio',
    newChat: 'Nuova chat',
    clearHistory: 'Cancella cronologia',
    typingIndicator: 'L\'IA sta scrivendo...',
    copyCode: 'Copia codice',
    codeCopied: 'Codice copiato negli appunti',
    retry: 'Riprova',
    regenerate: 'Rigenera risposta'
  },
  modes: {
    coding: 'Domande di Programmazione',
    codingDesc: 'Ottieni aiuto con domande di programmazione ed esempi di codice',
    systemDesign: 'Progettazione Sistema',
    systemDesignDesc: 'Progetta architettura e crea diagrammi',
    meetingSummary: 'Riepilogo Riunioni',
    meetingSummaryDesc: 'Riassumi riunioni ed estrai punti chiave',
    general: 'Generale',
    generalDesc: 'Conversazione generale e domande'
  },
  cost: {
    title: 'Utilizzo API',
    current: 'Sessione Corrente',
    total: 'Utilizzo Totale',
    threshold: 'Soglia Costi',
    warning: 'Avvicinandosi al limite dei costi',
    exceeded: 'Limite dei costi superato',
    reset: 'Resetta contatore'
  },
  settings: {
    title: 'Impostazioni',
    speechRecognition: 'Riconoscimento Vocale',
    whisperAPI: 'API Whisper',
    browserSpeech: 'Sintesi Vocale del Browser',
    textToSpeech: 'Da Testo a Voce',
    openAITTS: 'OpenAI TTS',
    browserTTS: 'TTS del Browser',
    apiKeys: 'Chiavi API',
    openAIKey: 'Chiave API OpenAI',
    anthropicKey: 'Chiave API Anthropic',
    modelPreferences: 'Preferenze Modello',
    costLimits: 'Limiti di Costo',
    sessionLimit: 'Limite Sessione',
    dailyLimit: 'Limite Giornaliero',
    monthlyLimit: 'Limite Mensile',
    languageSettings: 'Impostazioni Lingua',
    selectLanguage: 'Seleziona la tua lingua preferita',
    themeSettings: 'Impostazioni Tema',
    selectTheme: 'Seleziona tema'
  },
  errors: {
    general: 'Si è verificato un errore',
    network: 'Errore di rete',
    notFound: 'Non trovato',
    unauthorized: 'Non autorizzato',
    forbidden: 'Vietato',
    serverError: 'Errore del server',
    timeout: 'Richiesta scaduta',
    offline: 'Sembri essere offline'
  },
  navigation: {
    dashboard: 'Dashboard',
    chat: 'Chat',
    history: 'Cronologia',
    settings: 'Impostazioni',
    help: 'Aiuto',
    about: 'Informazioni',
    profile: 'Profilo',
    logout: 'Esci',
    exploreAssistants: 'Esplora Assistenti'
  },
  status: {
    online: 'Online',
    degraded: 'Degradato',
    offline: 'Offline',
    checking: 'Controllo'
  },
  agent: {
    defaultName: 'Assistente',
    ready: '{name} è pronto',
    defaultPlaceholder: 'Come posso aiutarti oggi?',
    typing: '{name} sta scrivendo...'
  },
  meetingSummaries: {
    title: 'Riepiloghi Riunioni',
    noSummariesFound: 'Nessun riepilogo di riunione trovato corrispondente ai tuoi criteri.',
    loadingSummaries: 'Caricamento riepiloghi...',
    toggleFilters: 'Attiva/Disattiva Filtri',
    importSummaries: 'Importa Riepiloghi',
    exportAll: 'Esporta Tutti i Riepiloghi (JSON)',
    searchPlaceholder: 'Cerca riepiloghi...',
    tags: 'Etichette (seleziona qualsiasi):',
    actionItemAssignee: 'Assegnatario Elemento d\'Azione:',
    anyAssignee: 'Qualsiasi Assegnatario',
    sortBy: 'Ordina per:',
    lastUpdated: 'Ultimo Aggiornamento',
    meetingDate: 'Data Riunione',
    dateCreated: 'Data Creazione',
    titleSort: 'Titolo',
    openActionItems: 'Elementi d\'Azione Aperti',
    order: 'Ordine:',
    descending: 'Decrescente',
    ascending: 'Crescente',
    hasOpenActions: 'Ha Azioni Aperte',
    showArchivedOnly: 'Mostra Solo Archiviati',
    clearAllFilters: 'Cancella Tutti i Filtri',
    openItems: 'aperti',
    archived: 'Archiviato',
    archiveSummary: 'Archivia Riepilogo',
    unarchiveSummary: 'Desarchivia Riepilogo',
    deleteSummary: 'Elimina Riepilogo',
    clearAllHistory: 'Cancella Tutta la Cronologia'
  },
  agents: {
    nerf: {
      name: 'Nerf',
      description: 'La tua IA generale amichevole ed efficiente per domande rapide e informazioni.',
      longDescription: 'Nerf è progettato per domande e risposte dirette, fatti rapidi, definizioni e spiegazioni semplici. Punta alla chiarezza e concisione, rendendolo ideale per richieste quotidiane.',
      placeholder: 'Chiedi qualsiasi cosa a Nerf...'
    },
    codePilot: {
      name: 'CodePilot',
      description: 'Assistenza esperta nella programmazione, debug e spiegazioni in più linguaggi.',
      placeholder: 'Chiedi a CodePilot riguardo al codice...'
    },
    architectron: {
      name: 'Architectron',
      description: 'Progetta e diagramma collaborativamente architetture software e sistemi complessi.',
      placeholder: 'Descrivi il sistema da progettare...'
    },
    meetingScribe: {
      name: 'Segretario Riunioni',
      description: 'Elabora le tue note o trascrizioni di riunioni in riassunti chiari e strutturati con punti d\'azione.',
      placeholder: 'Incolla note o detta la discussione per il riassunto...'
    },
    echo: {
      name: 'Echo',
      description: 'Il tuo diario AI personale ed empatico per riflessione e organizzazione dei pensieri.',
      placeholder: 'Condividi i tuoi pensieri con Echo...'
    },
    aiInterviewer: {
      name: 'Intervistatore AI',
      description: 'Simula un colloquio tecnico di programmazione, fornendo problemi e valutando soluzioni.',
      placeholder: 'Pronto per il tuo colloquio di programmazione simulato?'
    },
    professorAstra: {
      name: 'Professor Astra',
      description: 'Il tuo tutor AI adattivo per esplorare argomenti e padroneggiare concetti.',
      placeholder: 'Quale argomento impareremo oggi?'
    },
    lcAudit: {
      name: 'LC-Audit',
      description: 'Analisi approfondita dei problemi LeetCode e assistente per colloqui.',
      placeholder: 'Fornisci il contesto del problema per l\'analisi LC-Audit...'
    }
  },
  vAgent: {
    name: 'V',
    online: '{name} Online',
    description: 'Assistente AI avanzato, dinamico e perspicace per compiti complessi ed esplorazioni.',
    longDescription: 'V è un\'AI potente e poliedrica progettata per impegnarsi in discussioni sfumate, sintetizzare informazioni complesse e fornire risposte complete e ben articolate. Ideale per approfondimenti, brainstorming creativo e pensiero strategico.',
    placeholder: 'Poni la tua domanda o esplorazione complessa a V...'
  }
};
