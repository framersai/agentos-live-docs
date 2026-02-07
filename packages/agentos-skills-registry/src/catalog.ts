/**
 * @fileoverview Curated Skills Catalog for AgentOS
 * @module @framers/agentos-skills-registry/catalog
 *
 * Statically-typed catalog of all curated skills with metadata for
 * programmatic discovery, filtering by category/tag, and tool-based
 * availability checks.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SkillCatalogEntry {
  /** Unique skill name (matches directory name under registry/curated/) */
  name: string;

  /** Human-readable display name */
  displayName: string;

  /** Brief description of the skill's capabilities */
  description: string;

  /** Skill category for grouping */
  category: string;

  /** Searchable tags */
  tags: string[];

  /** Secret identifiers the skill needs (e.g. 'github.token') */
  requiredSecrets: string[];

  /** Tool identifiers the skill depends on (e.g. 'web-search', 'filesystem') */
  requiredTools: string[];

  /** Relative path from the agentos-skills package root to the SKILL.md */
  skillPath: string;

  /** All curated skills are in the wunderland namespace */
  namespace: 'wunderland';
}

// ============================================================================
// CATALOG
// ============================================================================

export const SKILLS_CATALOG: SkillCatalogEntry[] = [
  // ── Information ───────────────────────────────────────────────────────
  {
    name: 'weather',
    displayName: 'Weather Lookup',
    description:
      'Look up current weather conditions, forecasts, and severe weather alerts for any location worldwide.',
    category: 'information',
    tags: ['weather', 'forecast', 'climate', 'location'],
    requiredSecrets: [],
    requiredTools: ['web-search'],
    skillPath: 'registry/curated/weather/SKILL.md',
    namespace: 'wunderland',
  },
  {
    name: 'summarize',
    displayName: 'Text / URL Summarization',
    description:
      'Summarize text content, web pages, documents, and long-form articles into concise, structured summaries.',
    category: 'information',
    tags: ['summarization', 'text-processing', 'tldr', 'reading', 'content-analysis'],
    requiredSecrets: [],
    requiredTools: ['web-search'],
    skillPath: 'registry/curated/summarize/SKILL.md',
    namespace: 'wunderland',
  },

  // ── Developer Tools ───────────────────────────────────────────────────
  {
    name: 'github',
    displayName: 'GitHub (gh CLI)',
    description:
      'Manage GitHub repositories, issues, pull requests, releases, and Actions workflows using the gh CLI.',
    category: 'developer-tools',
    tags: ['github', 'git', 'issues', 'pull-requests', 'ci-cd', 'code-review'],
    requiredSecrets: ['github.token'],
    requiredTools: [],
    skillPath: 'registry/curated/github/SKILL.md',
    namespace: 'wunderland',
  },
  {
    name: 'coding-agent',
    displayName: 'Coding Agent',
    description:
      'Write, review, debug, refactor, and explain code across multiple programming languages and frameworks.',
    category: 'developer-tools',
    tags: ['coding', 'programming', 'code-review', 'debugging', 'refactoring', 'development'],
    requiredSecrets: [],
    requiredTools: ['filesystem'],
    skillPath: 'registry/curated/coding-agent/SKILL.md',
    namespace: 'wunderland',
  },

  // ── Communication ─────────────────────────────────────────────────────
  {
    name: 'slack-helper',
    displayName: 'Slack Helper',
    description:
      'Manage Slack workspaces, channels, messages, and integrations through the Slack API.',
    category: 'communication',
    tags: ['slack', 'messaging', 'workspace', 'notifications', 'team-chat'],
    requiredSecrets: ['slack.bot_token', 'slack.app_token'],
    requiredTools: [],
    skillPath: 'registry/curated/slack-helper/SKILL.md',
    namespace: 'wunderland',
  },
  {
    name: 'discord-helper',
    displayName: 'Discord Helper',
    description: 'Manage Discord servers, channels, roles, and messages through the Discord API.',
    category: 'communication',
    tags: ['discord', 'messaging', 'server', 'moderation', 'community'],
    requiredSecrets: ['discord.bot_token'],
    requiredTools: [],
    skillPath: 'registry/curated/discord-helper/SKILL.md',
    namespace: 'wunderland',
  },

  // ── Productivity ──────────────────────────────────────────────────────
  {
    name: 'notion',
    displayName: 'Notion',
    description:
      'Read, create, and manage pages, databases, and content blocks in Notion workspaces.',
    category: 'productivity',
    tags: ['notion', 'wiki', 'database', 'notes', 'project-management', 'knowledge-base'],
    requiredSecrets: ['notion.api_key'],
    requiredTools: [],
    skillPath: 'registry/curated/notion/SKILL.md',
    namespace: 'wunderland',
  },
  {
    name: 'obsidian',
    displayName: 'Obsidian Vault',
    description:
      'Read, create, and manage notes, links, and metadata in Obsidian vaults via the local filesystem.',
    category: 'productivity',
    tags: ['obsidian', 'markdown', 'notes', 'knowledge-graph', 'zettelkasten', 'pkm'],
    requiredSecrets: [],
    requiredTools: ['filesystem'],
    skillPath: 'registry/curated/obsidian/SKILL.md',
    namespace: 'wunderland',
  },
  {
    name: 'trello',
    displayName: 'Trello',
    description:
      'Manage Trello boards, lists, cards, checklists, and team workflows via the Trello API.',
    category: 'productivity',
    tags: ['trello', 'kanban', 'project-management', 'boards', 'tasks', 'workflow'],
    requiredSecrets: ['trello.api_key', 'trello.token'],
    requiredTools: [],
    skillPath: 'registry/curated/trello/SKILL.md',
    namespace: 'wunderland',
  },
  {
    name: 'apple-notes',
    displayName: 'Apple Notes',
    description:
      'Create, read, search, and manage notes in Apple Notes using AppleScript and macOS automation.',
    category: 'productivity',
    tags: ['apple-notes', 'macos', 'notes', 'applescript', 'automation'],
    requiredSecrets: [],
    requiredTools: ['filesystem'],
    skillPath: 'registry/curated/apple-notes/SKILL.md',
    namespace: 'wunderland',
  },
  {
    name: 'apple-reminders',
    displayName: 'Apple Reminders',
    description:
      'Create, manage, and query reminders and lists in Apple Reminders using AppleScript and macOS automation.',
    category: 'productivity',
    tags: ['apple-reminders', 'macos', 'reminders', 'tasks', 'applescript', 'automation'],
    requiredSecrets: [],
    requiredTools: ['filesystem'],
    skillPath: 'registry/curated/apple-reminders/SKILL.md',
    namespace: 'wunderland',
  },

  // ── DevOps ────────────────────────────────────────────────────────────
  {
    name: 'healthcheck',
    displayName: 'Health Check Monitor',
    description:
      'Monitor health and availability of systems, services, APIs, and infrastructure endpoints.',
    category: 'devops',
    tags: ['monitoring', 'health', 'uptime', 'infrastructure', 'diagnostics', 'status'],
    requiredSecrets: [],
    requiredTools: ['web-search'],
    skillPath: 'registry/curated/healthcheck/SKILL.md',
    namespace: 'wunderland',
  },

  // ── Media ─────────────────────────────────────────────────────────────
  {
    name: 'spotify-player',
    displayName: 'Spotify Player',
    description:
      'Control Spotify playback, manage playlists, search music, and get recommendations via the Spotify API.',
    category: 'media',
    tags: ['spotify', 'music', 'playback', 'playlists', 'streaming', 'audio'],
    requiredSecrets: ['spotify.client_id', 'spotify.client_secret', 'spotify.refresh_token'],
    requiredTools: [],
    skillPath: 'registry/curated/spotify-player/SKILL.md',
    namespace: 'wunderland',
  },
  {
    name: 'whisper-transcribe',
    displayName: 'Whisper Transcription',
    description:
      'Transcribe audio and video files to text using OpenAI Whisper or compatible speech-to-text APIs.',
    category: 'media',
    tags: ['transcription', 'whisper', 'speech-to-text', 'audio', 'stt', 'voice'],
    requiredSecrets: ['openai.api_key'],
    requiredTools: ['filesystem'],
    skillPath: 'registry/curated/whisper-transcribe/SKILL.md',
    namespace: 'wunderland',
  },

  // ── Security ──────────────────────────────────────────────────────────
  {
    name: '1password',
    displayName: '1Password Vault',
    description:
      'Query and retrieve items from 1Password vaults using the 1Password CLI for secure credential access.',
    category: 'security',
    tags: ['1password', 'passwords', 'secrets', 'vault', 'credentials', 'security'],
    requiredSecrets: [],
    requiredTools: [],
    skillPath: 'registry/curated/1password/SKILL.md',
    namespace: 'wunderland',
  },

  // ── Creative ──────────────────────────────────────────────────────────
  {
    name: 'image-gen',
    displayName: 'AI Image Generation',
    description:
      'Generate images from text prompts using AI image generation APIs like DALL-E, Stable Diffusion, or Midjourney.',
    category: 'creative',
    tags: ['image-generation', 'ai-art', 'dall-e', 'stable-diffusion', 'creative', 'visual'],
    requiredSecrets: ['openai.api_key'],
    requiredTools: [],
    skillPath: 'registry/curated/image-gen/SKILL.md',
    namespace: 'wunderland',
  },
];

// ============================================================================
// QUERY HELPERS
// ============================================================================

/**
 * Get all skills in a given category.
 */
export function getSkillsByCategory(category: string): SkillCatalogEntry[] {
  return SKILLS_CATALOG.filter((s) => s.category === category);
}

/**
 * Get a skill by its unique name.
 */
export function getSkillByName(name: string): SkillCatalogEntry | undefined {
  return SKILLS_CATALOG.find((s) => s.name === name);
}

/**
 * Get skills whose required tools are all present in the provided list.
 *
 * Skills with no required tools are always considered available.
 */
export function getAvailableSkills(installedTools: string[]): SkillCatalogEntry[] {
  const toolSet = new Set(installedTools);
  return SKILLS_CATALOG.filter((s) => s.requiredTools.every((t) => toolSet.has(t)));
}

/**
 * Get all unique categories across the catalog.
 */
export function getCategories(): string[] {
  return [...new Set(SKILLS_CATALOG.map((s) => s.category))].sort();
}

/**
 * Search skills by tag (returns all skills that have at least one matching tag).
 */
export function getSkillsByTag(tag: string): SkillCatalogEntry[] {
  const lower = tag.toLowerCase();
  return SKILLS_CATALOG.filter((s) => s.tags.some((t) => t.toLowerCase() === lower));
}

/**
 * Full-text search across skill names, descriptions, and tags.
 */
export function searchSkills(query: string): SkillCatalogEntry[] {
  const lower = query.toLowerCase();
  return SKILLS_CATALOG.filter(
    (s) =>
      s.name.toLowerCase().includes(lower) ||
      s.displayName.toLowerCase().includes(lower) ||
      s.description.toLowerCase().includes(lower) ||
      s.tags.some((t) => t.toLowerCase().includes(lower))
  );
}
