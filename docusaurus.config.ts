import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AgentOS — Open-Source TypeScript AI Agent Runtime',
  tagline:
    'Open-source TypeScript runtime for autonomous AI agents — unified graph orchestration, cognitive memory, streaming guardrails, voice pipeline, 21 LLM providers.',
  favicon: 'img/favicon.svg',
  url: 'https://docs.agentos.sh',
  baseUrl: '/',
  organizationName: 'framersai',
  projectName: 'agentos-live-docs',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  trailingSlash: false,

  headTags: [
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
      attributes: { name: 'author', content: 'Framers — https://frame.dev' },
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
          name: 'Framers',
          url: 'https://frame.dev',
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
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  plugins: [
    // Lightweight search manifest for agentos.sh marketing-site DocSearch
    './plugins/search-manifest.js',
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
        ],
        createRedirects(existingPath: string) {
          // Redirect old /docs/ prefixed paths to root (docs are now at /)
          if (existingPath === '/' || existingPath.startsWith('/docs/')) {
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
          editUrl: 'https://github.com/framersai/agentos-live-docs/tree/master/docs/',
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'AgentOS Blog',
          blogDescription:
            'News, updates, and insights about AgentOS, AI agents, and multi-agent orchestration.',
          blogSidebarTitle: 'Recent posts',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-4KEEK15KWZ',
          anonymizeIP: true,
        },
        sitemap: {
          lastmod: 'date',
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
          type: 'docSidebar',
          sidebarId: 'guideSidebar',
          position: 'left',
          label: 'Docs',
          activeBaseRegex:
            '/(getting-started|architecture|features|extensions|skills|memory|orchestration)/',
        },
        {
          to: '/api/',
          position: 'left',
          label: 'API Reference',
        },
        {
          to: '/blog',
          position: 'left',
          label: 'Blog',
        },
        {
          href: 'https://github.com/framersai/agentos',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
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
            { label: 'Getting Started', to: '/' },
            { label: 'Architecture', to: '/architecture/system-architecture' },
            { label: 'Extensions', to: '/extensions/overview' },
            { label: 'API Reference', to: '/api/' },
          ],
        },
        {
          title: 'Ecosystem',
          items: [
            { label: 'Frame.dev', href: 'https://frame.dev' },
            { label: 'AgentOS', href: 'https://agentos.sh' },
            { label: 'RabbitHole', href: 'https://rabbithole.sh' },
            { label: 'Wunderland CLI', href: 'https://wunderland.sh' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/framersai/agentos' },
            { label: 'Discord', href: 'https://discord.com/invite/KxF9b6HY6h' },
            { label: 'Twitter', href: 'https://twitter.com/framersai' },
            { label: 'npm', href: 'https://www.npmjs.com/package/@framers/agentos' },
          ],
        },
        {
          title: 'Legal',
          items: [
            { label: 'Privacy Policy', href: 'https://agentos.sh/privacy' },
            { label: 'Terms of Service', href: 'https://agentos.sh/terms' },
          ],
        },
      ],
      copyright: `Copyright \u00A9 ${new Date().getFullYear()} <a href="https://frame.dev" target="_blank" rel="noopener noreferrer" style="color: #00C896;">Frame.dev</a>. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
