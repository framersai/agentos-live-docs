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
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/documentation-index',
        'getting-started/getting-started',
        'getting-started/high-level-api',
        'getting-started/examples',
        'getting-started/ecosystem',
        'getting-started/releasing',
        'getting-started/changelog',
      ],
    },
    {
      type: 'category',
      label: 'Architecture & Core',
      collapsed: false,
      items: [
        'architecture/system-architecture',
        'architecture/platform-support',
        'architecture/observability',
        'architecture/logging',
        'architecture/tool-calling-and-loading',
        'architecture/llm-providers',
        'architecture/emergent-agency-system',
        'architecture/backend-api',
        'architecture/http-streaming-api',
        'architecture/chat-server',
        'architecture/tools',
        'architecture/multi-gmi-implementation-plan',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Planning & Orchestration',
          collapsed: false,
          items: [
            'features/orchestration-guide',
            'features/unified-orchestration',
            'features/agent-graph',
            'features/workflow-dsl',
            'features/mission-api',
            'features/checkpointing',
            'features/planning-engine',
            'features/human-in-the-loop',
            'features/agent-communication',
            'features/safety-primitives',
          ],
        },
        {
          type: 'category',
          label: 'Guardrails',
          collapsed: false,
          items: [
            'features/guardrails',
            'features/guardrails-architecture',
            'features/creating-guardrails',
          ],
        },
        {
          type: 'category',
          label: 'Memory & Storage',
          collapsed: false,
          items: [
            'features/cognitive-memory-guide',
            'features/cognitive-memory',
            'features/working-memory',
            {
              type: 'category',
              label: 'Memory System',
              collapsed: false,
              items: [
                'features/memory-architecture',
                'features/memory-document-ingestion',
                'features/memory-import-export',
                'features/memory-consolidation',
                'features/memory-tools',
                'features/memory-storage',
                'features/memory-scaling',
                'features/postgres-backend',
                'features/qdrant-backend',
                'features/pinecone-backend',
              ],
            },
            'features/rag-memory',
            'features/multimodal-rag',
            'features/sql-storage',
            'features/client-side-storage',
            'features/platform-strategy',
            'features/immutable-agents',
            'features/provenance-guide',
            'features/provenance-immutability',
          ],
        },
        {
          type: 'category',
          label: 'AI & LLM',
          collapsed: false,
          items: [
            'features/structured-output',
            'features/structured-output-api',
            'features/evaluation-guide',
            'features/evaluation-framework',
            'features/cost-optimization',
            'features/deep-research',
            'features/query-routing',
          ],
        },
        {
          type: 'category',
          label: 'Images & Vision',
          collapsed: false,
          items: [
            'features/image-generation',
            'features/image-editing',
            'features/vision-pipeline',
          ],
        },
        {
          type: 'category',
          label: 'Channels & Social',
          collapsed: false,
          items: ['features/channels', 'features/social-posting', 'features/browser-automation'],
        },
        {
          type: 'category',
          label: 'Voice & Speech',
          collapsed: false,
          items: [
            'features/voice-pipeline',
            'features/speech-providers',
            'features/telephony-providers',
            'extensions/built-in/voice-synthesis',
          ],
        },
        {
          type: 'category',
          label: 'Advanced',
          collapsed: false,
          items: [
            'features/agent-config-export',
            'features/recursive-self-building',
            'features/agency-collaboration',
            'features/discovery-guide',
            'features/capability-discovery',
            'features/emergent-capabilities',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Skills',
      collapsed: false,
      items: [
        'skills/overview',
        'skills/skill-format',
        'skills/skills-extension',
        'skills/agentos-skills',
        'skills/agentos-skills-registry',
      ],
    },
    {
      type: 'category',
      label: 'Extensions',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Getting Started',
          collapsed: false,
          items: [
            'extensions/overview',
            'extensions/how-extensions-work',
            'extensions/extension-architecture',
            'extensions/auto-loading',
          ],
        },
        {
          type: 'category',
          label: 'Development',
          items: [
            'extensions/extension-standards',
            'extensions/contributing',
            'extensions/self-hosted-registries',
            'extensions/migration-guide',
            'extensions/releasing',
          ],
        },
        {
          type: 'category',
          label: 'Official Extensions',
          collapsed: false,
          items: [
            {
              type: 'category',
              label: 'Guardrails',
              items: [
                'extensions/built-in/pii-redaction',
                'extensions/built-in/ml-classifiers',
                'extensions/built-in/topicality',
                'extensions/built-in/code-safety',
                'extensions/built-in/grounding-guard',
              ],
            },
            {
              type: 'category',
              label: 'Channels',
              items: [
                'extensions/built-in/channel-telegram',
                'extensions/built-in/channel-whatsapp',
                'extensions/built-in/channel-discord',
                'extensions/built-in/channel-slack',
                'extensions/built-in/channel-webchat',
              ],
            },
            {
              type: 'category',
              label: 'Tools & Integrations',
              items: [
                'extensions/built-in/auth',
                'extensions/built-in/web-search',
                'extensions/built-in/web-browser',
                'extensions/built-in/news-search',
                'extensions/built-in/giphy',
                'extensions/built-in/image-search',
                'extensions/built-in/voice-synthesis',
                'extensions/built-in/cli-executor',
                'extensions/built-in/telegram',
                'extensions/built-in/telegram-bot',
              ],
            },
            {
              type: 'category',
              label: 'Provenance',
              items: ['extensions/built-in/anchor-providers', 'extensions/built-in/tip-ingestion'],
            },
            {
              type: 'category',
              label: 'Voice Extensions',
              items: [
                'features/voice-pipeline',
                'features/speech-providers',
                'features/telephony-providers',
              ],
            },
          ],
        },
      ],
    },
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
