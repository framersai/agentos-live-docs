/* eslint-disable no-undef */
// @ts-check

// Import the TypeDoc-generated sidebar (exists after first build)
let typedocSidebar = [];
try {
  typedocSidebar = require('./docs/api/typedoc-sidebar.cjs');
} catch {
  // First build — TypeDoc hasn't run yet, API sidebar will be empty
}

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  guideSidebar: [
    'index',

    // ---- Getting Started ----
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/high-level-api',
        'getting-started/examples',
        'getting-started/ecosystem',
        'getting-started/releasing',
      ],
    },

    // ---- Architecture ----
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/system-architecture',
        'architecture/llm-providers',
        'architecture/tool-calling-and-loading',
        'architecture/tool-permissions',
        'architecture/sandbox-security',
        'architecture/extension-loading',
        'architecture/skills-engine',
        'architecture/observability',
        'architecture/platform-support',
      ],
    },

    // ---- Orchestration ----
    {
      type: 'category',
      label: 'Orchestration',
      items: [
        'features/unified-orchestration',
        'features/mission-api',
        'features/workflow-dsl',
        'features/agent-graph',
        'features/checkpointing',
        'features/planning-engine',
        'features/human-in-the-loop',
      ],
    },

    // ---- Memory ----
    {
      type: 'category',
      label: 'Memory',
      items: [
        'features/cognitive-memory',
        'features/working-memory',
        'features/memory-architecture',
        'features/memory-tools',
        'features/memory-import-export',
        'features/memory-scaling',
        'features/sql-storage',
      ],
    },

    // ---- RAG & Retrieval ----
    {
      type: 'category',
      label: 'RAG & Retrieval',
      items: [
        'features/rag-memory',
        'features/deep-research',
        'features/query-routing',
        'features/multimodal-rag',
        'features/memory-document-ingestion',
      ],
    },

    // ---- Guardrails & Security ----
    {
      type: 'category',
      label: 'Guardrails & Security',
      items: [
        'features/guardrails',
        'features/guardrails-architecture',
        'features/creating-guardrails',
        'features/safety-primitives',
      ],
    },

    // ---- Voice & Speech ----
    {
      type: 'category',
      label: 'Voice & Speech',
      items: [
        'features/voice-pipeline',
        'features/speech-providers',
        'features/telephony-providers',
      ],
    },

    // ---- Media Generation ----
    {
      type: 'category',
      label: 'Media Generation',
      items: [
        'features/image-generation',
        'features/image-editing',
        'features/vision-pipeline',
        'features/video-pipeline',
        'features/audio-generation',
        'features/document-export',
        'features/provider-preferences',
      ],
    },

    // ---- Channels ----
    {
      type: 'category',
      label: 'Channels & Social',
      items: [
        'features/channels',
        'features/social-posting',
        'features/browser-automation',
      ],
    },

    // ---- AI & LLM ----
    {
      type: 'category',
      label: 'AI & LLM',
      items: [
        'features/structured-output',
        'features/evaluation-guide',
        'features/cost-optimization',
      ],
    },

    // ---- Advanced ----
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'features/capability-discovery',
        'features/emergent-capabilities',
        'features/agency-collaboration',
        'features/agent-communication',
        'features/recursive-self-building',
        'features/self-improving-agents',
        'features/provenance-immutability',
        'features/immutable-agents',
        'features/agent-config-export',
      ],
    },

    // ---- Skills ----
    {
      type: 'category',
      label: 'Skills',
      items: [
        'skills/overview',
        'skills/skill-format',
        'skills/agentos-skills',
        'skills/agentos-skills-registry',
      ],
    },

    // ---- Extensions ----
    {
      type: 'category',
      label: 'Extensions',
      items: [
        'extensions/overview',
        'extensions/how-extensions-work',
        'extensions/extension-architecture',
        'extensions/contributing',
        'extensions/releasing',
        {
          type: 'category',
          label: 'Official Extensions',
          items: [
            'extensions/built-in/web-search',
            'extensions/built-in/web-browser',
            'extensions/built-in/news-search',
            'extensions/built-in/cli-executor',
            'extensions/built-in/auth',
            'extensions/built-in/giphy',
            'extensions/built-in/image-search',
            'extensions/built-in/voice-synthesis',
            'extensions/built-in/telegram-bot',
            'extensions/built-in/channel-discord',
            'extensions/built-in/channel-slack',
            'extensions/built-in/channel-telegram',
            'extensions/built-in/channel-whatsapp',
            'extensions/built-in/channel-webchat',
            'extensions/built-in/pii-redaction',
            'extensions/built-in/grounding-guard',
            'extensions/built-in/anchor-providers',
            'extensions/built-in/tip-ingestion',
          ],
        },
      ],
    },

    // ---- API Reference ----
    {
      type: 'category',
      label: 'API Reference',
      link: {
        type: 'doc',
        id: 'api/index',
      },
      items: typedocSidebar,
    },
  ],
};

module.exports = sidebars;
