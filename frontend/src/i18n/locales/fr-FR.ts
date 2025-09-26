export default {
  common: {
    welcome: 'Bienvenue à Voice Chat Assistant',
    loading: 'Chargement...',
    error: 'Une erreur est survenue',
    success: 'Succès',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
    back: 'Retour',
    next: 'Suivant',
    submit: 'Soumettre',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
    search: 'Rechercher',
    settings: 'Paramètres',
    language: 'Langue',
    theme: 'Thème',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    logout: 'Déconnexion',
    login: 'Connexion',
    register: 'S\'inscrire',
    profile: 'Profil',
    home: 'Accueil',
    about: 'À propos',
    contact: 'Contact',
    help: 'Aide',
    documentation: 'Documentation',
    version: 'Version',
    idle: 'Inactif',
    enterFullscreen: 'Plein écran',
    exitFullscreen: 'Quitter le plein écran',
    allRightsReserved: 'Tous droits réservés',
    logs: 'Journaux',
    source: 'Source'
  },
  auth: {
    loginTitle: 'Se connecter',
    loginSubtitle: 'Bon retour',
    email: 'E-mail',
    password: 'Mot de passe',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié?',
    noAccount: 'Pas de compte?',
    signUp: 'S\'inscrire',
    loginSuccess: 'Connexion réussie',
    loginError: 'Identifiants invalides',
    logoutSuccess: 'Déconnexion réussie'
  },
  voice: {
    recording: 'Enregistrement...',
    processing: 'Traitement vocal...',
    listening: 'Écoute...',
    speaking: 'Parle...',
    mute: 'Couper le son',
    unmute: 'Activer le son',
    transcribing: 'Transcription audio...',
    speakNow: 'Parlez maintenant',
    clickToSpeak: 'Cliquez pour parler',
    stopRecording: 'Arrêter l\'enregistrement',
    microphoneAccess: 'Accès au microphone requis',
    noSpeechDetected: 'Aucune parole détectée',
    transcriptionComplete: 'Transcription terminée'
  },
  chat: {
    thinking: 'Réflexion...',
    generating: 'Génération de la réponse...',
    messageEmpty: 'Le message ne peut pas être vide',
    sendMessage: 'Envoyer le message',
    newChat: 'Nouveau chat',
    clearHistory: 'Effacer l\'historique',
    typingIndicator: 'L\'IA tape...',
    copyCode: 'Copier le code',
    codeCopied: 'Code copié dans le presse-papiers',
    retry: 'Réessayer',
    regenerate: 'Régénérer la réponse'
  },
  modes: {
    coding: 'Questions de programmation',
    codingDesc: 'Obtenez de l\'aide avec des questions de programmation et des exemples de code',
    systemDesign: 'Conception de système',
    systemDesignDesc: 'Concevoir l\'architecture et créer des diagrammes',
    meetingSummary: 'Résumé de réunion',
    meetingSummaryDesc: 'Résumer les réunions et extraire les points clés',
    general: 'Général',
    generalDesc: 'Conversation générale et questions'
  },
  cost: {
    title: 'Utilisation de l\'API',
    current: 'Session actuelle',
    total: 'Utilisation totale',
    threshold: 'Seuil de coût',
    warning: 'Approche de la limite de coût',
    exceeded: 'Limite de coût dépassée',
    reset: 'Réinitialiser le compteur'
  },
  settings: {
    title: 'Paramètres',
    speechRecognition: 'Reconnaissance vocale',
    whisperAPI: 'API Whisper',
    browserSpeech: 'Parole du navigateur',
    textToSpeech: 'Synthèse vocale',
    openAITTS: 'TTS OpenAI',
    browserTTS: 'TTS du navigateur',
    apiKeys: 'Clés API',
    openAIKey: 'Clé API OpenAI',
    anthropicKey: 'Clé API Anthropic',
    modelPreferences: 'Préférences de modèle',
    costLimits: 'Limites de coût',
    sessionLimit: 'Limite de session',
    dailyLimit: 'Limite quotidienne',
    monthlyLimit: 'Limite mensuelle',
    languageSettings: 'Paramètres de langue',
    selectLanguage: 'Sélectionnez votre langue préférée',
    themeSettings: 'Paramètres de thème',
    selectTheme: 'Sélectionner le thème'
  },
  errors: {
    general: 'Une erreur est survenue',
    network: 'Erreur réseau',
    notFound: 'Non trouvé',
    unauthorized: 'Non autorisé',
    forbidden: 'Interdit',
    serverError: 'Erreur du serveur',
    timeout: 'Délai d\'attente dépassé',
    offline: 'Vous semblez être hors ligne'
  },
  navigation: {
    dashboard: 'Tableau de bord',
    chat: 'Chat',
    history: 'Historique',
    settings: 'Paramètres',
    help: 'Aide',
    about: 'À propos',
    profile: 'Profil',
    logout: 'Déconnexion',
    exploreAssistants: 'Explorer les Assistants'
  },
  status: {
    online: 'En ligne',
    degraded: 'Dégradé',
    offline: 'Hors ligne',
    checking: 'Vérification'
  },
  agent: {
    defaultName: 'Assistant',
    ready: '{name} est prêt',
    defaultPlaceholder: 'Comment puis-je vous aider aujourd\'hui ?',
    typing: '{name} tape...'
  },
  meetingSummaries: {
    title: 'Résumés de Réunions',
    noSummariesFound: 'Aucun résumé de réunion trouvé correspondant à vos critères.',
    loadingSummaries: 'Chargement des résumés...',
    toggleFilters: 'Basculer les Filtres',
    importSummaries: 'Importer les Résumés',
    exportAll: 'Exporter Tous les Résumés (JSON)',
    searchPlaceholder: 'Rechercher des résumés...',
    tags: 'Étiquettes (sélectionner n\'importe laquelle) :',
    actionItemAssignee: 'Assigné de l\'Élément d\'Action :',
    anyAssignee: 'N\'importe quel Assigné',
    sortBy: 'Trier par :',
    lastUpdated: 'Dernière Mise à Jour',
    meetingDate: 'Date de Réunion',
    dateCreated: 'Date de Création',
    titleSort: 'Titre',
    openActionItems: 'Éléments d\'Action Ouverts',
    order: 'Ordre :',
    descending: 'Décroissant',
    ascending: 'Croissant',
    hasOpenActions: 'A des Actions Ouvertes',
    showArchivedOnly: 'Afficher Seulement les Archivés',
    clearAllFilters: 'Effacer Tous les Filtres',
    openItems: 'ouverts',
    archived: 'Archivé',
    archiveSummary: 'Archiver le Résumé',
    unarchiveSummary: 'Désarchiver le Résumé',
    deleteSummary: 'Supprimer le Résumé',
    clearAllHistory: 'Effacer Tout l\'Historique'
  },
  agents: {
    nerf: {
      name: 'Nerf',
      description: 'Votre IA générale amicale et efficace pour les questions rapides et l\'information.',
      longDescription: 'Nerf est conçu pour les questions-réponses directes, les faits rapides, les définitions et les explications simples. Il vise la clarté et la concision, en faisant un excellent choix pour les demandes quotidiennes.',
      placeholder: 'Demandez n\'importe quoi à Nerf...'
    },
    codePilot: {
      name: 'CodePilot',
      description: 'Assistance experte en codage, débogage et explications dans plusieurs langages.',
      placeholder: 'Interrogez CodePilot sur le code...'
    },
    architectron: {
      name: 'Architectron',
      description: 'Concevez et diagrammez collaborativement des architectures logicielles et systèmes complexes.',
      placeholder: 'Décrivez le système à concevoir...'
    },
    meetingScribe: {
      name: 'Secrétaire de Réunion',
      description: 'Traite vos notes ou transcriptions de réunions en résumés clairs et structurés avec des points d\'action.',
      placeholder: 'Collez des notes ou dictez la discussion pour résumer...'
    },
    echo: {
      name: 'Echo',
      description: 'Votre journal IA personnel et empathique pour la réflexion et l\'organisation des pensées.',
      placeholder: 'Partagez vos pensées avec Echo...'
    },
    aiInterviewer: {
      name: 'Intervieweur IA',
      description: 'Simule un entretien technique de codage, fournissant des problèmes et évaluant des solutions.',
      placeholder: 'Prêt pour votre entretien de codage simulé?'
    },
    professorAstra: {
      name: 'Professeur Astra',
      description: 'Votre tuteur IA adaptatif pour explorer des sujets et maîtriser des concepts.',
      placeholder: 'Quel sujet allons-nous apprendre aujourd\'hui?'
    },
    lcAudit: {
      name: 'LC-Audit',
      description: 'Analyse approfondie des problèmes LeetCode et aide aux entretiens.',
      placeholder: 'Fournissez le contexte du problème pour l\'analyse LC-Audit...'
    }
  },
  vAgent: {
    name: 'V',
    online: '{name} En ligne',
    description: 'Assistant IA avancé, dynamique et perspicace pour les tâches complexes et les explorations.',
    longDescription: 'V est une IA puissante et polymathique conçue pour engager des discussions nuancées, synthétiser des informations complexes et fournir des réponses complètes et bien articulées. Idéal pour les plongées profondes, le brainstorming créatif et la pensée stratégique.',
    placeholder: 'Posez votre requête complexe ou exploration à V...'
  }
};