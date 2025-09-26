export default {
  common: {
    welcome: 'Bem-vindo ao Voice Chat Assistant',
    loading: 'Carregando...',
    error: 'Ocorreu um erro',
    success: 'Sucesso',
    cancel: 'Cancelar',
    save: 'Salvar',
    delete: 'Excluir',
    edit: 'Editar',
    close: 'Fechar',
    back: 'Voltar',
    next: 'Próximo',
    submit: 'Enviar',
    confirm: 'Confirmar',
    yes: 'Sim',
    no: 'Não',
    search: 'Pesquisar',
    settings: 'Configurações',
    language: 'Idioma',
    theme: 'Tema',
    darkMode: 'Modo escuro',
    lightMode: 'Modo claro',
    logout: 'Sair',
    login: 'Entrar',
    register: 'Registrar',
    profile: 'Perfil',
    home: 'Início',
    about: 'Sobre',
    contact: 'Contato',
    help: 'Ajuda',
    documentation: 'Documentação',
    version: 'Versão',
    idle: 'Inativo',
    enterFullscreen: 'Tela cheia',
    exitFullscreen: 'Sair da tela cheia',
    allRightsReserved: 'Todos os direitos reservados',
    logs: 'Registros',
    source: 'Fonte'
  },
  auth: {
    loginTitle: 'Entrar',
    loginSubtitle: 'Bem-vindo de volta',
    email: 'E-mail',
    password: 'Senha',
    rememberMe: 'Lembrar de mim',
    forgotPassword: 'Esqueceu a senha?',
    noAccount: 'Não tem uma conta?',
    signUp: 'Criar conta',
    loginSuccess: 'Login realizado com sucesso',
    loginError: 'Credenciais inválidas',
    logoutSuccess: 'Logout realizado com sucesso'
  },
  voice: {
    recording: 'Gravando...',
    processing: 'Processando voz...',
    listening: 'Ouvindo...',
    speaking: 'Falando...',
    mute: 'Silenciar',
    unmute: 'Ativar som',
    transcribing: 'Transcrevendo áudio...',
    speakNow: 'Fale agora',
    clickToSpeak: 'Clique para falar',
    stopRecording: 'Parar gravação',
    microphoneAccess: 'Acesso ao microfone necessário',
    noSpeechDetected: 'Nenhuma fala detectada',
    transcriptionComplete: 'Transcrição concluída'
  },
  chat: {
    thinking: 'Pensando...',
    generating: 'Gerando resposta...',
    messageEmpty: 'A mensagem não pode estar vazia',
    sendMessage: 'Enviar mensagem',
    newChat: 'Nova conversa',
    clearHistory: 'Limpar histórico',
    typingIndicator: 'A IA está digitando...',
    copyCode: 'Copiar código',
    codeCopied: 'Código copiado para a área de transferência',
    retry: 'Tentar novamente',
    regenerate: 'Regenerar resposta'
  },
  modes: {
    coding: 'Perguntas de Programação',
    codingDesc: 'Obtenha ajuda com perguntas de programação e exemplos de código',
    systemDesign: 'Design de Sistema',
    systemDesignDesc: 'Projetar arquitetura e criar diagramas',
    meetingSummary: 'Resumo de Reuniões',
    meetingSummaryDesc: 'Resumir reuniões e extrair pontos-chave',
    general: 'Geral',
    generalDesc: 'Conversas gerais e perguntas'
  },
  cost: {
    title: 'Uso da API',
    current: 'Sessão Atual',
    total: 'Uso Total',
    threshold: 'Limite de Custo',
    warning: 'Aproximando-se do limite de custo',
    exceeded: 'Limite de custo excedido',
    reset: 'Redefinir contador'
  },
  settings: {
    title: 'Configurações',
    speechRecognition: 'Reconhecimento de Voz',
    whisperAPI: 'API Whisper',
    browserSpeech: 'Fala do Navegador',
    textToSpeech: 'Texto para Fala',
    openAITTS: 'OpenAI TTS',
    browserTTS: 'TTS do Navegador',
    apiKeys: 'Chaves da API',
    openAIKey: 'Chave da API OpenAI',
    anthropicKey: 'Chave da API Anthropic',
    modelPreferences: 'Preferências do Modelo',
    costLimits: 'Limites de Custo',
    sessionLimit: 'Limite da Sessão',
    dailyLimit: 'Limite Diário',
    monthlyLimit: 'Limite Mensal',
    languageSettings: 'Configurações de Idioma',
    selectLanguage: 'Selecione seu idioma preferido',
    themeSettings: 'Configurações de Tema',
    selectTheme: 'Selecionar tema'
  },
  errors: {
    general: 'Ocorreu um erro',
    network: 'Erro de rede',
    notFound: 'Não encontrado',
    unauthorized: 'Não autorizado',
    forbidden: 'Proibido',
    serverError: 'Erro do servidor',
    timeout: 'Tempo limite da requisição esgotado',
    offline: 'Você parece estar offline'
  },
  navigation: {
    dashboard: 'Painel',
    chat: 'Chat',
    history: 'Histórico',
    settings: 'Configurações',
    help: 'Ajuda',
    about: 'Sobre',
    profile: 'Perfil',
    logout: 'Sair',
    exploreAssistants: 'Explorar Assistentes'
  },
  status: {
    online: 'Online',
    degraded: 'Degradado',
    offline: 'Offline',
    checking: 'Verificando'
  },
  agent: {
    defaultName: 'Assistente',
    ready: '{name} está pronto',
    defaultPlaceholder: 'Como posso ajudá-lo hoje?',
    typing: '{name} está digitando...'
  },
  meetingSummaries: {
    title: 'Resumos de Reuniões',
    noSummariesFound: 'Nenhum resumo de reunião encontrado correspondendo aos seus critérios.',
    loadingSummaries: 'Carregando resumos...',
    toggleFilters: 'Alternar Filtros',
    importSummaries: 'Importar Resumos',
    exportAll: 'Exportar Todos os Resumos (JSON)',
    searchPlaceholder: 'Pesquisar resumos...',
    tags: 'Tags (selecione qualquer uma):',
    actionItemAssignee: 'Responsável pelo Item de Ação:',
    anyAssignee: 'Qualquer Responsável',
    sortBy: 'Classificar por:',
    lastUpdated: 'Última Atualização',
    meetingDate: 'Data da Reunião',
    dateCreated: 'Data de Criação',
    titleSort: 'Título',
    openActionItems: 'Itens de Ação Abertos',
    order: 'Ordem:',
    descending: 'Decrescente',
    ascending: 'Crescente',
    hasOpenActions: 'Tem Ações Abertas',
    showArchivedOnly: 'Mostrar Apenas Arquivados',
    clearAllFilters: 'Limpar Todos os Filtros',
    openItems: 'abertos',
    archived: 'Arquivado',
    archiveSummary: 'Arquivar Resumo',
    unarchiveSummary: 'Desarquivar Resumo',
    deleteSummary: 'Excluir Resumo',
    clearAllHistory: 'Limpar Todo o Histórico'
  },
  agents: {
    nerf: {
      name: 'Nerf',
      description: 'Sua IA geral amigável e eficiente para perguntas rápidas e informações.',
      longDescription: 'Nerf é projetado para perguntas e respostas diretas, fatos rápidos, definições e explicações simples. Visa clareza e concisão, sendo ideal para consultas cotidianas.',
      placeholder: 'Pergunte qualquer coisa ao Nerf...'
    },
    codePilot: {
      name: 'CodePilot',
      description: 'Assistência especializada em codificação, depuração e explicações em múltiplas linguagens.',
      placeholder: 'Pergunte ao CodePilot sobre código...'
    },
    architectron: {
      name: 'Architectron',
      description: 'Projete e diagramme colaborativamente arquiteturas de software e sistemas complexos.',
      placeholder: 'Descreva o sistema a ser projetado...'
    },
    meetingScribe: {
      name: 'Escriba de Reuniões',
      description: 'Processa suas notas ou transcrições de reuniões em resumos claros e estruturados com itens de ação.',
      placeholder: 'Cole notas ou dite a discussão para resumo...'
    },
    echo: {
      name: 'Echo',
      description: 'Seu diário de IA pessoal e empático para reflexão e organização de pensamentos.',
      placeholder: 'Compartilhe seus pensamentos com Echo...'
    },
    aiInterviewer: {
      name: 'Entrevistador IA',
      description: 'Simula uma entrevista técnica de programação, fornecendo problemas e avaliando soluções.',
      placeholder: 'Pronto para sua entrevista de programação simulada?'
    },
    professorAstra: {
      name: 'Professor Astra',
      description: 'Seu tutor de IA adaptativo para explorar assuntos e dominar conceitos.',
      placeholder: 'Que tópico vamos aprender hoje?'
    },
    lcAudit: {
      name: 'LC-Audit',
      description: 'Análise aprofundada de problemas do LeetCode e assistente de entrevistas.',
      placeholder: 'Forneça contexto do problema para análise LC-Audit...'
    }
  },
  vAgent: {
    name: 'V',
    online: '{name} Online',
    description: 'Assistente de IA avançado, dinâmico e perspicaz para tarefas complexas e explorações.',
    longDescription: 'V é uma IA poderosa e polímata projetada para se envolver em discussões nuançadas, sintetizar informações complexas e fornecer respostas abrangentes e bem articuladas. Ideal para mergulhos profundos, brainstorming criativo e pensamento estratégico.',
    placeholder: 'Apresente sua consulta ou exploração complexa para V...'
  }
};
