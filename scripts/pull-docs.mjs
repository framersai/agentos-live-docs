#!/usr/bin/env node

/**
 * pull-docs.mjs — Prebuild script that copies markdown from source packages
 * into the Docusaurus docs/ tree, injecting frontmatter and rewriting links.
 *
 * Run: node scripts/pull-docs.mjs
 * Auto-runs via `npm run prebuild` before `npm run build`.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DOCS_OUT = resolve(ROOT, 'docs');

// Source directories (relative to monorepo root)
const MONO_ROOT = resolve(ROOT, '../..');
const AGENTOS_PKG = resolve(MONO_ROOT, 'packages/agentos');
const AGENTOS_DOCS = resolve(MONO_ROOT, 'packages/agentos/docs');
const EXTENSIONS_ROOT = resolve(MONO_ROOT, 'packages/agentos-extensions');
const CURATED_ROOT = resolve(EXTENSIONS_ROOT, 'registry/curated');
const SKILLS_REGISTRY_PKG = resolve(MONO_ROOT, 'packages/agentos-skills-registry');
const SKILLS_EXTENSION_PKG = resolve(MONO_ROOT, 'packages/agentos-ext-skills');
const SQL_STORAGE_ADAPTER_PKG = resolve(MONO_ROOT, 'packages/sql-storage-adapter');
const REPO_DOCS = resolve(MONO_ROOT, 'docs');
const VENDORED = resolve(ROOT, 'vendored-docs');
const EXTENSIONS_GITHUB_REPO = 'https://github.com/framersai/agentos-extensions';

// ── Mapping tables ──────────────────────────────────────────────────

/** @type {{ src: string; dest: string; title: string; position: number }[]} */
const agentosGuides = [
  {
    src: 'README.md',
    dest: 'getting-started/documentation-index.md',
    title: 'Documentation Index',
    position: 1,
  },
  {
    src: 'HIGH_LEVEL_API.md',
    dest: 'getting-started/high-level-api.md',
    title: 'High-Level API',
    position: 2,
  },
  { src: 'ECOSYSTEM.md', dest: 'getting-started/ecosystem.md', title: 'Ecosystem', position: 3 },
  { src: 'RELEASING.md', dest: 'getting-started/releasing.md', title: 'Releasing', position: 4 },
  {
    src: 'ARCHITECTURE.md',
    dest: 'architecture/system-architecture.md',
    title: 'System Architecture',
    position: 1,
  },
  {
    src: 'PLATFORM_SUPPORT.md',
    dest: 'architecture/platform-support.md',
    title: 'Platform Support',
    position: 2,
  },
  {
    src: 'OBSERVABILITY.md',
    dest: 'architecture/observability.md',
    title: 'Observability (OpenTelemetry)',
    position: 3,
  },
  {
    src: 'LOGGING.md',
    dest: 'architecture/logging.md',
    title: 'Logging (Pino + OpenTelemetry)',
    position: 4,
  },
  {
    src: 'TOOL_CALLING_AND_LOADING.md',
    dest: 'architecture/tool-calling-and-loading.md',
    title: 'Tool Calling & Lazy Loading',
    position: 5,
  },
  {
    src: 'IMMUTABLE_AGENTS.md',
    dest: 'features/immutable-agents.md',
    title: 'Immutable Agents',
    position: 13,
  },
  {
    src: 'PROVENANCE_IMMUTABILITY.md',
    dest: 'features/provenance-immutability.md',
    title: 'Provenance & Immutability',
    position: 14,
  },
  {
    src: 'UNIFIED_ORCHESTRATION.md',
    dest: 'features/unified-orchestration.md',
    title: 'Unified Orchestration Layer',
    position: 1,
  },
  {
    src: 'AGENT_GRAPH.md',
    dest: 'features/agent-graph.md',
    title: 'AgentGraph',
    position: 2,
  },
  {
    src: 'WORKFLOW_DSL.md',
    dest: 'features/workflow-dsl.md',
    title: 'workflow() DSL',
    position: 3,
  },
  {
    src: 'MISSION_API.md',
    dest: 'features/mission-api.md',
    title: 'mission() API',
    position: 4,
  },
  {
    src: 'CHECKPOINTING.md',
    dest: 'features/checkpointing.md',
    title: 'Checkpointing and Time-Travel',
    position: 5,
  },
  {
    src: 'PLANNING_ENGINE.md',
    dest: 'features/planning-engine.md',
    title: 'Planning Engine',
    position: 6,
  },
  {
    src: 'HUMAN_IN_THE_LOOP.md',
    dest: 'features/human-in-the-loop.md',
    title: 'Human-in-the-Loop',
    position: 2,
  },
  {
    src: 'AGENT_COMMUNICATION.md',
    dest: 'features/agent-communication.md',
    title: 'Agent Communication',
    position: 3,
  },
  { src: 'GUARDRAILS_USAGE.md', dest: 'features/guardrails.md', title: 'Guardrails', position: 4 },
  {
    src: 'CREATING_GUARDRAILS.md',
    dest: 'features/creating-guardrails.md',
    title: 'Creating Custom Guardrails',
    position: 8,
  },
  {
    src: 'SAFETY_PRIMITIVES.md',
    dest: 'features/safety-primitives.md',
    title: 'Safety Primitives',
    position: 5,
  },
  {
    src: 'RAG_MEMORY_CONFIGURATION.md',
    dest: 'features/rag-memory.md',
    title: 'RAG Memory Configuration',
    position: 5,
  },
  {
    src: 'MULTIMODAL_RAG.md',
    dest: 'features/multimodal-rag.md',
    title: 'Multimodal RAG (Image + Audio)',
    position: 6,
  },
  {
    src: 'SQL_STORAGE_QUICKSTART.md',
    dest: 'features/sql-storage.md',
    title: 'SQL Storage Quickstart',
    position: 7,
  },
  {
    src: 'CLIENT_SIDE_STORAGE.md',
    dest: 'features/client-side-storage.md',
    title: 'Client-Side Storage',
    position: 8,
  },
  {
    src: 'STRUCTURED_OUTPUT.md',
    dest: 'features/structured-output.md',
    title: 'Structured Output',
    position: 9,
  },
  {
    src: 'EVALUATION_FRAMEWORK.md',
    dest: 'features/evaluation-framework.md',
    title: 'Evaluation Framework',
    position: 10,
  },
  {
    src: 'COST_OPTIMIZATION.md',
    dest: 'features/cost-optimization.md',
    title: 'Cost Optimization',
    position: 11,
  },
  {
    src: 'RECURSIVE_SELF_BUILDING_AGENTS.md',
    dest: 'features/recursive-self-building.md',
    title: 'Recursive Self-Building Agents',
    position: 12,
  },
  {
    src: 'DEEP_RESEARCH.md',
    dest: 'features/deep-research.md',
    title: 'Deep Research & Query Classification',
    position: 13,
  },
  {
    src: 'VOICE_PIPELINE.md',
    dest: 'features/voice-pipeline.md',
    title: 'Voice Pipeline',
    position: 14,
  },
  {
    src: 'SPEECH_PROVIDERS.md',
    dest: 'features/speech-providers.md',
    title: 'Speech Providers',
    position: 15,
  },
  {
    src: 'TELEPHONY_PROVIDERS.md',
    dest: 'features/telephony-providers.md',
    title: 'Telephony Providers',
    position: 16,
  },
  // Memory
  {
    src: 'COGNITIVE_MEMORY.md',
    dest: 'features/cognitive-memory.md',
    title: 'Cognitive Memory',
    position: 1,
  },
  {
    src: 'WORKING_MEMORY.md',
    dest: 'features/working-memory.md',
    title: 'Working Memory',
    position: 2,
  },
  // Memory System guides
  {
    src: 'MEMORY_ARCHITECTURE.md',
    dest: 'features/memory-architecture.md',
    title: 'Memory Architecture Overview',
    position: 20,
  },
  {
    src: 'MEMORY_DOCUMENT_INGESTION.md',
    dest: 'features/memory-document-ingestion.md',
    title: 'Document Ingestion',
    position: 21,
  },
  {
    src: 'MEMORY_IMPORT_EXPORT.md',
    dest: 'features/memory-import-export.md',
    title: 'Memory Import/Export',
    position: 22,
  },
  {
    src: 'MEMORY_CONSOLIDATION.md',
    dest: 'features/memory-consolidation.md',
    title: 'Self-Improving Memory',
    position: 23,
  },
  {
    src: 'MEMORY_TOOLS.md',
    dest: 'features/memory-tools.md',
    title: 'Agent Memory Tools',
    position: 24,
  },
  {
    src: 'MEMORY_STORAGE.md',
    dest: 'features/memory-storage.md',
    title: 'SQLite Brain Storage',
    position: 25,
  },
  // Capability & Emergent
  {
    src: 'CAPABILITY_DISCOVERY.md',
    dest: 'features/capability-discovery.md',
    title: 'Capability Discovery',
    position: 1,
  },
  {
    src: 'EMERGENT_CAPABILITIES.md',
    dest: 'features/emergent-capabilities.md',
    title: 'Emergent Capabilities',
    position: 2,
  },
  // Agency
  {
    src: 'AGENCY_API.md',
    dest: 'features/agency-api.md',
    title: 'Multi-Agent Agency API',
    position: 22,
  },
  // Extensions standards
  {
    src: 'RFC_EXTENSION_STANDARDS.md',
    dest: 'extensions/extension-standards.md',
    title: 'Extension Standards (RFC)',
    position: 5,
  },
];

/** @type {{ src: string; dest: string; title: string; position: number }[]} */
const extensionGuides = [
  { src: 'README.md', dest: 'extensions/overview.md', title: 'Extensions Overview', position: 1 },
  {
    src: 'HOW_EXTENSIONS_WORK.md',
    dest: 'extensions/how-extensions-work.md',
    title: 'How Extensions Work',
    position: 2,
  },
  {
    src: 'EXTENSION_ARCHITECTURE.md',
    dest: 'extensions/extension-architecture.md',
    title: 'Extension Architecture',
    position: 3,
  },
  {
    src: 'AUTO_LOADING_EXTENSIONS.md',
    dest: 'extensions/auto-loading.md',
    title: 'Auto-Loading Extensions',
    position: 4,
  },
  {
    src: 'CONTRIBUTING.md',
    dest: 'extensions/contributing.md',
    title: 'Contributing',
    position: 6,
  },
  {
    src: 'SELF_HOSTED_REGISTRIES.md',
    dest: 'extensions/self-hosted-registries.md',
    title: 'Self-Hosted Registries',
    position: 7,
  },
  {
    src: 'MIGRATION_GUIDE.md',
    dest: 'extensions/migration-guide.md',
    title: 'Migration Guide',
    position: 8,
  },
  { src: 'RELEASING.md', dest: 'extensions/releasing.md', title: 'Releasing', position: 9 },
  {
    src: 'AGENCY_COLLABORATION_EXAMPLE.md',
    dest: 'features/agency-collaboration.md',
    title: 'Agency Collaboration',
    position: 12,
  },
];

/** @type {{ dir: string; dest: string; title: string; position: number }[]} */
const builtInExtensions = [
  { dir: 'auth', dest: 'extensions/built-in/auth.md', title: 'Auth', position: 1 },
  {
    dir: 'research/web-search',
    dest: 'extensions/built-in/web-search.md',
    title: 'Web Search',
    position: 2,
  },
  {
    dir: 'research/web-browser',
    dest: 'extensions/built-in/web-browser.md',
    title: 'Web Browser',
    position: 3,
  },
  {
    dir: 'research/news-search',
    dest: 'extensions/built-in/news-search.md',
    title: 'News Search',
    position: 4,
  },
  { dir: 'media/giphy', dest: 'extensions/built-in/giphy.md', title: 'Giphy', position: 5 },
  {
    dir: 'media/image-search',
    dest: 'extensions/built-in/image-search.md',
    title: 'Image Search',
    position: 6,
  },
  {
    dir: 'media/voice-synthesis',
    dest: 'extensions/built-in/voice-synthesis.md',
    title: 'Voice Synthesis',
    position: 7,
  },
  {
    dir: 'system/cli-executor',
    dest: 'extensions/built-in/cli-executor.md',
    title: 'CLI Executor',
    position: 8,
  },
  {
    dir: 'integrations/telegram',
    dest: 'extensions/built-in/telegram.md',
    title: 'Telegram',
    position: 9,
  },
  {
    dir: 'provenance/anchor-providers',
    dest: 'extensions/built-in/anchor-providers.md',
    title: 'Anchor Providers',
    position: 10,
  },
  {
    dir: 'provenance/wunderland-tip-ingestion',
    dest: 'extensions/built-in/tip-ingestion.md',
    title: 'Tip Ingestion',
    position: 11,
  },
  {
    dir: 'communications/telegram-bot',
    dest: 'extensions/built-in/telegram-bot.md',
    title: 'Telegram Bot (Comms)',
    position: 12,
  },
  {
    dir: 'channels/telegram',
    dest: 'extensions/built-in/channel-telegram.md',
    title: 'Channel: Telegram',
    position: 13,
  },
  {
    dir: 'channels/whatsapp',
    dest: 'extensions/built-in/channel-whatsapp.md',
    title: 'Channel: WhatsApp',
    position: 14,
  },
  {
    dir: 'channels/discord',
    dest: 'extensions/built-in/channel-discord.md',
    title: 'Channel: Discord',
    position: 15,
  },
  {
    dir: 'channels/slack',
    dest: 'extensions/built-in/channel-slack.md',
    title: 'Channel: Slack',
    position: 16,
  },
  {
    dir: 'channels/webchat',
    dest: 'extensions/built-in/channel-webchat.md',
    title: 'Channel: WebChat',
    position: 17,
  },
  {
    dir: 'security/pii-redaction',
    dest: 'extensions/built-in/pii-redaction.md',
    title: 'PII Redaction',
    position: 18,
  },
];

/** @type {{ srcPath: string; dest: string; title: string; position: number }[]} */
const skillsDocs = [
  // Keep `docs/skills/overview.md` as the hand-curated landing page.
  {
    srcPath: resolve(AGENTOS_DOCS, 'SKILLS.md'),
    dest: 'skills/skill-format.md',
    title: 'Skills (SKILL.md)',
    position: 2,
  },
  {
    srcPath: resolve(SKILLS_EXTENSION_PKG, 'README.md'),
    dest: 'skills/skills-extension.md',
    title: 'Skills Extension',
    position: 3,
  },
  {
    srcPath: resolve(SKILLS_REGISTRY_PKG, 'README.md'),
    dest: 'skills/agentos-skills-registry.md',
    title: '@framers/agentos-skills-registry',
    position: 4,
  },
];

/** @type {{ srcPath: string; dest: string; title: string; position: number }[]} */
const extraDocs = [
  {
    srcPath: resolve(AGENTOS_PKG, 'CHANGELOG.md'),
    dest: 'getting-started/changelog.md',
    title: 'Changelog',
    position: 5,
  },
  {
    srcPath: resolve(REPO_DOCS, 'EMERGENT_AGENCY_SYSTEM.md'),
    dest: 'architecture/emergent-agency-system.md',
    title: 'Emergent Agency System',
    position: 4,
  },
  {
    srcPath: resolve(REPO_DOCS, 'BACKEND_API.md'),
    dest: 'architecture/backend-api.md',
    title: 'Backend API',
    position: 5,
  },
  {
    srcPath: resolve(REPO_DOCS, 'MULTI_GMI_COLLABORATION.md'),
    dest: 'architecture/multi-gmi-implementation-plan.md',
    title: 'Multi-GMI Collaboration',
    position: 6,
  },
  {
    srcPath: resolve(SQL_STORAGE_ADAPTER_PKG, 'PLATFORM_STRATEGY.md'),
    dest: 'features/platform-strategy.md',
    title: 'Platform Strategy',
    position: 8,
  },
];

// ── Link rewrite rules ──────────────────────────────────────────────

/** Map old filename references to new Docusaurus paths */
const linkRewrites = {
  'ARCHITECTURE.md': '/architecture/system-architecture',
  'EMERGENT_AGENCY_SYSTEM.md': '/architecture/emergent-agency-system',
  'BACKEND_API.md': '/architecture/backend-api',
  'MULTI_GMI_IMPLEMENTATION_PLAN.md': '/architecture/multi-gmi-implementation-plan',
  'MULTI_GMI_COLLABORATION.md': '/architecture/multi-gmi-implementation-plan',
  'SAFETY_PRIMITIVES.md': '/features/safety-primitives',
  'NESTJS_ARCHITECTURE.md': '/architecture/backend-api',
  'OBSERVABILITY.md': '/architecture/observability',
  'LOGGING.md': '/architecture/logging',
  'PLATFORM_SUPPORT.md': '/architecture/platform-support',
  'TOOL_CALLING_AND_LOADING.md': '/architecture/tool-calling-and-loading',
  'PLANNING_ENGINE.md': '/features/planning-engine',
  'HUMAN_IN_THE_LOOP.md': '/features/human-in-the-loop',
  'AGENT_COMMUNICATION.md': '/features/agent-communication',
  'GUARDRAILS_USAGE.md': '/features/guardrails',
  'CREATING_GUARDRAILS.md': '/features/creating-guardrails',
  'RAG_MEMORY_CONFIGURATION.md': '/features/rag-memory',
  'COGNITIVE_MEMORY.md': '/features/cognitive-memory',
  'MULTIMODAL_RAG.md': '/features/multimodal-rag',
  'SQL_STORAGE_QUICKSTART.md': '/features/sql-storage',
  'CLIENT_SIDE_STORAGE.md': '/features/client-side-storage',
  'PLATFORM_STRATEGY.md': '/features/platform-strategy',
  'IMMUTABLE_AGENTS.md': '/features/immutable-agents',
  'PROVENANCE_IMMUTABILITY.md': '/features/provenance-immutability',
  'STRUCTURED_OUTPUT.md': '/features/structured-output',
  'EVALUATION_FRAMEWORK.md': '/features/evaluation-framework',
  'COST_OPTIMIZATION.md': '/features/cost-optimization',
  'RECURSIVE_SELF_BUILDING_AGENTS.md': '/features/recursive-self-building',
  'VOICE_PIPELINE.md': '/features/voice-pipeline',
  'SPEECH_PROVIDERS.md': '/features/speech-providers',
  'TELEPHONY_PROVIDERS.md': '/features/telephony-providers',
  'RFC_EXTENSION_STANDARDS.md': '/extensions/extension-standards',
  'RELEASING.md': '/getting-started/releasing',
  'ECOSYSTEM.md': '/getting-started/ecosystem',
  'HIGH_LEVEL_API.md': '/getting-started/high-level-api',
  'SKILLS.md': '/skills/skill-format',
  'README.md': '/getting-started/documentation-index',
  'CHANGELOG.md': '/getting-started/changelog',
  'MIGRATION_TO_STORAGE_ADAPTER.md': '/features/sql-storage',
  'HOW_EXTENSIONS_WORK.md': '/extensions/how-extensions-work',
  'EXTENSION_ARCHITECTURE.md': '/extensions/extension-architecture',
  'AUTO_LOADING_EXTENSIONS.md': '/extensions/auto-loading',
  'CONTRIBUTING.md': '/extensions/contributing',
  'SELF_HOSTED_REGISTRIES.md': '/extensions/self-hosted-registries',
  'MIGRATION_GUIDE.md': '/extensions/migration-guide',
  'AGENCY_COLLABORATION_EXAMPLE.md': '/features/agency-collaboration',
  'AGENCY_API.md': '/features/agency-api',
  'MEMORY_ARCHITECTURE.md': '/features/memory-architecture',
  'MEMORY_DOCUMENT_INGESTION.md': '/features/memory-document-ingestion',
  'MEMORY_IMPORT_EXPORT.md': '/features/memory-import-export',
  'MEMORY_CONSOLIDATION.md': '/features/memory-consolidation',
  'MEMORY_TOOLS.md': '/features/memory-tools',
  'MEMORY_STORAGE.md': '/features/memory-storage',
};

/** Rewrite curated registry folder links -> docs pages */
const curatedLinkRewrites = Object.fromEntries(
  builtInExtensions.map(({ dir, dest }) => {
    const from = `./registry/curated/${dir}`;
    const to = `/${dest.replace(/\.md$/, '')}`;
    return [from, to];
  })
);

/** Exact-path rewrites that don't fit the filename-only table. */
const exactLinkRewrites = {
  './api/index.html': '/api/',
  './docs/api/index.html': '/api/',
  '../src/core/tools/ITool.ts': '/api/interfaces/ITool',
  '../src/extensions/ExtensionManager.ts': '/api/classes/ExtensionManager',
};

// ── Helpers ──────────────────────────────────────────────────────────

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

function injectFrontmatter(content, title, position) {
  // Strip existing frontmatter if present
  const stripped = content.replace(/^---[\s\S]*?---\n*/, '');

  // Strip leading h1 if it matches the title (Docusaurus uses frontmatter title)
  const withoutH1 = stripped.replace(/^#\s+.*\n+/, '');

  return `---
title: "${title}"
sidebar_position: ${position}
---

${withoutH1}`;
}

function rewriteLinks(content) {
  return content.replace(/\[([^\]]*)\]\(([^)]+)\)/g, (match, text, hrefRaw) => {
    const href = String(hrefRaw || '').trim();
    if (!href) return match;

    // Skip external URLs + anchors
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('#') ||
      href.startsWith('mailto:')
    ) {
      return match;
    }

    const [hrefPathRaw, anchorRaw] = href.split('#');
    const hrefPath = String(hrefPathRaw || '').trim();
    const anchor = anchorRaw ? `#${anchorRaw}` : '';
    const hrefNoTrailing = hrefPath.endsWith('/') ? hrefPath.slice(0, -1) : hrefPath;

    const exact = exactLinkRewrites[hrefPath] || exactLinkRewrites[hrefNoTrailing];
    if (exact) return `[${text}](${exact}${anchor})`;

    const curated = curatedLinkRewrites[hrefPath] || curatedLinkRewrites[hrefNoTrailing];
    if (curated) return `[${text}](${curated}${anchor})`;

    const base = basename(hrefPath);
    const rewritten = linkRewrites[base];
    if (rewritten) return `[${text}](${rewritten}${anchor})`;

    return match;
  });
}

function stripBadgeHtml(content) {
  // Remove GitHub badge HTML that renders poorly in Docusaurus
  return content
    .replace(/<p align="center">[\s\S]*?<\/p>/g, '')
    .replace(/\[!\[npm\]\(https:\/\/img\.shields\.io[^\]]*\)\]\([^)]*\)/g, '')
    .replace(/\[!\[GitHub\]\(https:\/\/img\.shields\.io[^\]]*\)\]\([^)]*\)/g, '');
}

function processMarkdown(content, title, position) {
  let result = content;
  result = stripBadgeHtml(result);
  result = rewriteLinks(result);
  result = injectFrontmatter(result, title, position);
  return result;
}

// ── Main ─────────────────────────────────────────────────────────────

let copied = 0;
let skipped = 0;

// Helper: generate a stub doc so sidebars.js doesn't break on missing sources
function writeStub(destPath, title, position, srcHint) {
  ensureDir(destPath);
  writeFileSync(
    destPath,
    `---
title: "${title}"
sidebar_position: ${position}
---

# ${title}

> This page is sourced from the monorepo and is not available in this build.
> See the [source file](https://github.com/manicinc/voice-chat-assistant) for full content.
`
  );
  console.warn(`  STUB (not found): ${srcHint}`);
  skipped++;
}

/**
 * Resolve a source file, checking primary path then vendored fallback.
 * Vendored copies mirror the monorepo layout under vendored-docs/.
 */
function resolveSource(primaryPath) {
  if (existsSync(primaryPath)) return primaryPath;
  // Compute relative path from MONO_ROOT to find vendored copy
  if (primaryPath.startsWith(MONO_ROOT)) {
    const rel = primaryPath.slice(MONO_ROOT.length + 1);
    const vendoredPath = resolve(VENDORED, rel);
    if (existsSync(vendoredPath)) {
      console.log(`  VENDORED: ${rel}`);
      return vendoredPath;
    }
  }
  return null;
}

// 1. Copy AgentOS guides
for (const { src, dest, title, position } of agentosGuides) {
  const srcPath = resolve(AGENTOS_DOCS, src);
  const destPath = resolve(DOCS_OUT, dest);
  const resolved = resolveSource(srcPath);

  if (!resolved) {
    writeStub(destPath, title, position, src);
    continue;
  }

  const content = readFileSync(resolved, 'utf8');
  ensureDir(destPath);
  writeFileSync(destPath, processMarkdown(content, title, position));
  copied++;
}

// 2. Copy agentos-extensions guides
for (const { src, dest, title, position } of extensionGuides) {
  const srcPath = resolve(EXTENSIONS_ROOT, src);
  const destPath = resolve(DOCS_OUT, dest);
  const resolved = resolveSource(srcPath);

  if (!resolved) {
    writeStub(destPath, title, position, src);
    continue;
  }

  const content = readFileSync(resolved, 'utf8');
  ensureDir(destPath);
  writeFileSync(destPath, processMarkdown(content, title, position));
  copied++;
}

// 3. Copy built-in extension READMEs
for (const { dir, dest, title, position } of builtInExtensions) {
  const srcPath = resolve(CURATED_ROOT, dir, 'README.md');
  const destPath = resolve(DOCS_OUT, dest);
  const resolved = resolveSource(srcPath);

  if (!resolved) {
    // Generate a stub for extensions without READMEs
    ensureDir(destPath);
    writeFileSync(
      destPath,
      `---
title: "${title}"
sidebar_position: ${position}
---

# ${title}

Documentation coming soon. See the [extension source](https://github.com/framersai/agentos-extensions/tree/master/registry/curated/${dir}) for usage details.
`
    );
    console.warn(`  STUB (no README): ${dir}`);
    skipped++;
    continue;
  }

  let content = readFileSync(resolved, 'utf8');
  // Many extension READMEs link to local ./examples/ folders. In docs, those
  // directories aren't imported as pages, so point to the source repo instead.
  content = content.replace(/\[([^\]]+)\]\(\.\/examples\/?\)/g, (_m, label) => {
    const url = `${EXTENSIONS_GITHUB_REPO}/tree/master/registry/curated/${dir}/examples`;
    return `[${label}](${url})`;
  });
  ensureDir(destPath);
  writeFileSync(destPath, processMarkdown(content, title, position));
  copied++;
}

// 4. Copy skills docs (skills are a separate section from extensions)
for (const { srcPath, dest, title, position } of skillsDocs) {
  const destPath = resolve(DOCS_OUT, dest);
  const resolved = resolveSource(srcPath);

  if (!resolved) {
    writeStub(destPath, title, position, srcPath);
    continue;
  }

  const content = readFileSync(resolved, 'utf8');
  ensureDir(destPath);
  writeFileSync(destPath, processMarkdown(content, title, position));
  copied++;
}

// 5. Copy extra monorepo docs referenced by guides
for (const { srcPath, dest, title, position } of extraDocs) {
  const destPath = resolve(DOCS_OUT, dest);
  const resolved = resolveSource(srcPath);

  if (!resolved) {
    writeStub(destPath, title, position, srcPath);
    continue;
  }

  const content = readFileSync(resolved, 'utf8');
  ensureDir(destPath);
  writeFileSync(destPath, processMarkdown(content, title, position));
  copied++;
}

console.log(`\npull-docs: ${copied} files copied, ${skipped} skipped/stubbed`);
