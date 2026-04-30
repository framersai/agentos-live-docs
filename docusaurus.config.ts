import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { existsSync } from 'fs';
import { resolve } from 'path';

const disableLocalSearch = process.env.AGENTOS_DOCS_DISABLE_LOCAL_SEARCH === '1';
const disableSearchManifest = process.env.AGENTOS_DOCS_DISABLE_SEARCH_MANIFEST === '1';
const guidesOnly = process.env.AGENTOS_DOCS_GUIDES_ONLY === '1';
const strictDocs = process.env.AGENTOS_DOCS_STRICT !== '0';

// The paracosm typedoc plugin needs the live paracosm source tree at the
// expected sibling path. When this docs site is built standalone (CI on
// the docs repo, not the monorepo), that path is not present, and typedoc
// fails the whole build before Docusaurus can render any blog or guide
// content. Detect the source presence at config time and skip the plugin
// when it is missing — the API reference for paracosm is still cross-
// linked from the monorepo build, and the standalone docs build keeps
// shipping every other update (blog posts, guides, agentos API).
const paracosmSrcPath = resolve(__dirname, '../paracosm/src');
const paracosmSrcAvailable = existsSync(paracosmSrcPath);

const config: Config = {
  title: 'AgentOS — Open-Source TypeScript AI Agent Runtime',
  tagline:
    'Open-source TypeScript runtime for autonomous AI agents — unified graph orchestration, cognitive memory, streaming guardrails, voice pipeline, 21 LLM providers.',
  favicon: 'img/favicon.ico',
  url: 'https://docs.agentos.sh',
  baseUrl: '/',
  organizationName: 'framersai',
  projectName: 'agentos-live-docs',
  onBrokenLinks: guidesOnly ? 'ignore' : strictDocs ? 'throw' : 'warn',
  clientModules: [require.resolve('./src/mermaid-zoom.js')],
  trailingSlash: false,

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/img/favicon-32x32.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/img/favicon-16x16.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/img/favicon.svg',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content:
          'AgentOS documentation — guides, tutorials, and TypeDoc API reference for building production AI agents with TypeScript. Graph orchestration, cognitive memory, RAG, guardrails, voice pipelines, and 21 LLM providers.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content:
          'AgentOS, AI agent framework, TypeScript AI runtime, multi-agent orchestration, RAG memory, cognitive memory, AI guardrails, prompt injection defense, voice pipeline, LLM providers, agent runtime, AI SDK, open source AI, autonomous agents, agentic AI, agent extensions, agent skills, HEXACO personality, graph orchestration, workflow automation, LangGraph alternative, CrewAI alternative, build AI agents',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1',
      },
    },
    {
      tagName: 'meta',
      attributes: { name: 'googlebot', content: 'index, follow' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'author', content: 'Manic Agency LLC — https://manic.agency' },
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'AgentOS Documentation',
        url: 'https://docs.agentos.sh',
        description:
          'Official documentation for AgentOS — open-source TypeScript AI agent framework.',
        publisher: {
          '@type': 'Organization',
          name: 'Manic Agency LLC',
          url: 'https://manic.agency',
          sameAs: [
            'https://frame.dev',
            'https://github.com/framersai',
            'https://www.npmjs.com/package/@framers/agentos',
            'https://discord.gg/usEkfCeQxs',
            'https://wilds.ai',
          ],
          knowsAbout: [
            'AI agent framework',
            'TypeScript AI runtime',
            'multi-agent orchestration',
            'cognitive memory',
            'RAG pipeline',
            'LLM providers',
            'AI guardrails',
          ],
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://docs.agentos.sh/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }),
    },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'AgentOS',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Cross-platform',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: 'https://agentos.sh',
        downloadUrl: 'https://www.npmjs.com/package/@framers/agentos',
        codeRepository: 'https://github.com/framersai/agentos',
      }),
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    format: 'detect', // Allow CommonMark for TypeDoc-generated files (MDX v3 strict)
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: guidesOnly ? 'ignore' : strictDocs ? 'throw' : 'warn',
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
    ...(!disableLocalSearch
      ? [
          [
            '@easyops-cn/docusaurus-search-local',
            {
              hashed: true,
              language: ['en'],
              indexBlog: false,
              docsRouteBasePath: '/',
              // Generated API/member pages dominate the index and make the
              // build disproportionately expensive for marginal search value.
              ignoreFiles: [/^api\/.+/, /^paracosm\/.+/],
              highlightSearchTermsOnTargetPage: true,
            },
          ],
        ]
      : []),
  ],

  plugins: [
    // Lightweight search manifest for agentos.sh marketing-site DocSearch
    ...(!disableSearchManifest ? ['./plugins/search-manifest.js'] : []),
    ...(!guidesOnly
      ? [
          [
            'docusaurus-plugin-typedoc',
            {
              entryPoints: ['../../packages/agentos/src/index.ts'],
              tsconfig: '../../packages/agentos/tsconfig.json',
              out: 'docs/api',
              // Avoid pulling in the package README (it contains links that don't
              // resolve inside Docusaurus and duplicates the Guides section).
              readme: 'none',
              sidebar: {
                autoConfiguration: true,
                pretty: true,
              },
              skipErrorChecking: true,
            },
          ],
          ...(paracosmSrcAvailable
            ? [
                [
                  'docusaurus-plugin-typedoc',
                  {
                    id: 'paracosm',
                    entryPoints: [
                      '../../apps/paracosm/src/engine/index.ts',
                      '../../apps/paracosm/src/runtime/index.ts',
                      '../../apps/paracosm/src/engine/compiler/index.ts',
                    ],
                    tsconfig: '../../apps/paracosm/tsconfig.build.json',
                    out: 'docs/paracosm',
                    readme: 'none',
                    sidebar: {
                      autoConfiguration: true,
                      pretty: true,
                    },
                    skipErrorChecking: true,
                  },
                ] as [string, Record<string, unknown>],
              ]
            : []),
        ]
      : []),
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // Legacy SCREAMING_CASE doc paths from before Docusaurus migration
          { from: '/docs/ARCHITECTURE', to: '/architecture/system-architecture' },
          { from: '/docs/AGENT_COMMUNICATION', to: '/features/agent-communication' },
          { from: '/docs/CLIENT_SIDE_STORAGE', to: '/features/client-side-storage' },
          { from: '/docs/COST_OPTIMIZATION', to: '/features/cost-optimization' },
          { from: '/docs/ECOSYSTEM', to: '/getting-started/ecosystem' },
          { from: '/docs/EVALUATION_FRAMEWORK', to: '/features/evaluation-framework' },
          { from: '/docs/GUARDRAILS_USAGE', to: '/features/guardrails' },
          { from: '/docs/HUMAN_IN_THE_LOOP', to: '/features/human-in-the-loop' },
          { from: '/docs/PLANNING_ENGINE', to: '/features/planning-engine' },
          { from: '/docs/PLATFORM_SUPPORT', to: '/architecture/platform-support' },
          { from: '/docs/RAG_MEMORY_CONFIGURATION', to: '/features/rag-memory' },
          { from: '/docs/RECURSIVE_SELF_BUILDING_AGENTS', to: '/features/recursive-self-building' },
          { from: '/docs/RELEASING', to: '/getting-started/releasing' },
          { from: '/docs/RFC_EXTENSION_STANDARDS', to: '/extensions/extension-standards' },
          { from: '/docs/SQL_STORAGE_QUICKSTART', to: '/features/sql-storage' },
          { from: '/docs/STRUCTURED_OUTPUT', to: '/features/structured-output' },
          // Renamed getting-started/getting-started → getting-started (index.md)
          { from: '/getting-started/getting-started', to: '/getting-started' },
          // Blog consolidation (Track G, 2026-04-30): docs.agentos.sh/blog/*
          // is retired in favor of a single canonical blog at
          // agentos.sh/en/blog/<slug>. Each docs blog URL redirects to its
          // agentos.sh equivalent where the content has been ported, or to
          // the agentos.sh blog index when the post is engineering-only and
          // hasn't been ported yet (those are queued for a follow-up port).
          // Cross-site duplicate slugs (4 posts), agentos.sh canonical:
          { from: '/blog/2025/11/10/announcing-agentos', to: 'https://agentos.sh/en/blog/announcing-agentos' },
          { from: '/blog/2025/11/15/adaptive-vs-emergent', to: 'https://agentos.sh/en/blog/adaptive-vs-emergent' },
          { from: '/blog/2026/02/20/agentos-vs-langgraph-vs-crewai', to: 'https://agentos.sh/en/blog/agentos-vs-langgraph-vs-crewai' },
          { from: '/blog/2026/03/31/cognitive-memory-beyond-rag', to: 'https://agentos.sh/en/blog/cognitive-memory-beyond-rag' },
          // Engineering deep dives (13 posts), redirected to agentos.sh blog
          // index until each is ported. The original slugs stay reserved
          // for the eventual port (we'll point each line directly at
          // /en/blog/<slug> once the post lives there).
          { from: '/blog/2026/03/24/building-agentos-deep-dive', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/10/cognitive-memory-architecture-deep-dive', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/10/memory-archive-rehydration', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/13/mars-genesis-vs-mirofish-multi-agent-simulation', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/24/memory-benchmark-transparency-audit', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/26/agentos-ingest-router-executors', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/26/longmemeval-m-30-to-57', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/26/longmemeval-m-first-published-number', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/26/two-negative-results-stage-l-stage-i', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/27/longmemeval-s-83-with-semantic-embedder', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/28/reader-router-pareto-win', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/29/longmemeval-m-57-with-sem-embed', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/2026/04/29/longmemeval-m-70-with-topk5', to: 'https://agentos.sh/en/blog' },
          // Blog index + listing pages.
          { from: '/blog', to: 'https://agentos.sh/en/blog' },
          { from: '/blog/archive', to: 'https://agentos.sh/en/blog' },
        ],
        createRedirects(existingPath: string) {
          // Redirect old /docs/ prefixed guide paths to root (docs are now at /),
          // but do not duplicate generated/reference/non-doc routes.
          if (
            existingPath === '/' ||
            existingPath.startsWith('/docs/') ||
            existingPath.startsWith('/api') ||
            existingPath.startsWith('/paracosm') ||
            existingPath.startsWith('/blog') ||
            existingPath.startsWith('/search') ||
            existingPath.startsWith('/404')
          ) {
            return undefined;
          }
          return ['/docs' + existingPath];
        },
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          exclude: guidesOnly ? ['api/**', 'paracosm/**'] : [],
          editUrl: 'https://github.com/framersai/agentos-live-docs/tree/master/docs/',
        },
        // Blog plugin disabled: the canonical AgentOS blog is at
        // agentos.sh/en/blog (Track G consolidation, 2026-04-30). Old
        // docs.agentos.sh/blog URLs redirect to the new home via
        // @docusaurus/plugin-client-redirects entries above.
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-4KEEK15KWZ',
          anonymizeIP: true,
        },
        sitemap: {
          // Keep sitemap generation decoupled from git tracking state. Generated
          // TypeDoc pages may exist locally before they are committed, and
          // Docusaurus will otherwise warn when it cannot infer a git date.
          lastmod: null,
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/og-image.png',
    announcementBar: {
      id: 'longmemeval-m-2026-04-29',
      content:
        'New benchmark: 70.2% on LongMemEval-M with reader-router top-K=5. <a href="https://agentos.sh/en/blog/agentos-memory-sota-longmemeval">Read the post →</a>',
      backgroundColor: 'var(--ifm-color-primary-darkest)',
      textColor: 'var(--ifm-color-white)',
      isCloseable: true,
    },
    navbar: {
      title: '',
      logo: {
        alt: 'AgentOS',
        src: 'img/logo-light.svg',
        srcDark: 'img/logo-dark.svg',
        href: '/',
        height: '36px',
        style: { marginRight: '0.5rem' },
      },
      items: [
        {
          type: 'dropdown',
          label: 'Guides',
          position: 'left',
          to: '/getting-started',
          items: [
            { label: 'Getting Started', to: '/getting-started' },
            { label: 'Memory System', to: '/features/cognitive-memory' },
            { label: 'RAG & Vector Storage', to: '/features/rag-memory' },
            { label: 'Vector Scaling', to: '/features/memory-scaling' },
            { label: 'Guardrails', to: '/features/guardrails' },
            { label: 'Voice Pipeline', to: '/features/voice-pipeline' },
            { label: 'Extensions', to: '/extensions/overview' },
            { label: 'Skills', to: '/skills/overview' },
            {
              label: '─── Architecture ───',
              to: '/architecture/system-architecture',
              className: 'dropdown-separator',
            },
            { label: 'System Architecture', to: '/architecture/system-architecture' },
            { label: 'Tool Calling', to: '/architecture/tool-calling-and-loading' },
            { label: 'Capability Discovery', to: '/features/capability-discovery' },
            {
              label: '───────────',
              to: '/getting-started',
              className: 'dropdown-separator',
            },
            { label: 'All Guides & Docs', type: 'docSidebar', sidebarId: 'guideSidebar' },
          ],
        },
        ...(!guidesOnly
          ? [
              {
                to: '/api/',
                position: 'left' as const,
                label: 'API Reference',
              },
              {
                to: '/paracosm/',
                position: 'left' as const,
                label: 'Paracosm',
              },
            ]
          : []),
        ...(!guidesOnly
          ? [
              {
                href: 'https://agentos.sh/en/blog',
                position: 'left' as const,
                label: 'Blog',
              },
            ]
          : []),
        {
          href: 'https://agentos.sh',
          label: 'Website',
          position: 'right' as const,
        },
        {
          href: 'https://github.com/framersai/agentos',
          label: 'GitHub',
          position: 'right' as const,
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'light',
      logo: {
        alt: 'Frame.dev',
        src: 'img/frame-logo.svg',
        href: 'https://frame.dev',
        height: '36px',
      },
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/getting-started' },
            { label: 'Examples', to: '/getting-started/examples' },
            { label: 'Architecture', to: '/architecture/system-architecture' },
            { label: 'Feature Guides', to: '/getting-started/documentation-index' },
            ...(!guidesOnly
              ? [
                  { label: 'API Reference', to: '/api/' },
                  { label: 'Paracosm API', to: '/paracosm/' },
                ]
              : []),
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            { label: 'Manic Agency', href: 'https://manic.agency' },
            { label: 'Frame.dev', href: 'https://frame.dev' },
            { label: 'AgentOS', href: 'https://agentos.sh' },
            { label: 'Wilds.ai', href: 'https://wilds.ai' },
            { label: 'Wunderland CLI', href: 'https://wunderland.sh' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/framersai/agentos' },
            { label: 'Discord', href: 'https://discord.gg/usEkfCeQxs' },
            { label: 'Twitter', href: 'https://x.com/rabbitholewun' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com/company/manicinc' },
            { label: 'npm', href: 'https://www.npmjs.com/package/@framers/agentos' },
          ],
        },
        {
          title: 'Legal',
          items: [
            { label: 'Privacy Policy', href: 'https://agentos.sh/legal/privacy' },
            { label: 'Terms of Service', href: 'https://agentos.sh/legal/terms' },
            { label: 'Security', href: 'https://agentos.sh/legal/security' },
            { label: 'Cookies', href: 'https://agentos.sh/legal/cookies' },
          ],
        },
      ],
      copyright: `Copyright \u00A9 ${new Date().getFullYear()} <a href="https://manic.agency" target="_blank" rel="noopener noreferrer" style="color: #00C896;">Manic Agency LLC</a>. Open source under Apache 2.0.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
