# Rabbithole Extensions & Agent Dashboard Spec

## Goal

Add extension/skills management to the rabbithole dashboard and consolidate agent configuration tabs (voice, personas, HyDE) into the main overview page.

## Architecture

New `/extensions` page with 3 tabs (Extensions, Skills, Provider Defaults). Voice config moves from standalone `/voice` page into the main dashboard overview tabs. HyDE config added to existing memory tab. All follow the existing rabbithole patterns: demo mode for non-paid users, Next.js API proxy routes, `wunderland-api.ts` client methods.

## Scope

### New: `/dashboard/[seedId]/extensions` page

**Tab 1: Extensions**

- Grid of extension cards from TOOL_CATALOG (fetched via API or imported from `@framers/agentos-extensions-registry`)
- Each card shows: name, description, category badge (tool/voice/productivity), enabled/disabled toggle
- API key status per extension: green check (set) / red X (not set) with env var name
- "Configure" button opens inline config panel (priority, provider-specific options)
- Category filter tabs: All, Tools, Voice, Productivity
- Search/filter input
- Demo mode: show DEMO_EXTENSIONS data, no toggle interaction

**Tab 2: Skills**

- List of available skills from skills registry
- Each row: name, description, category, required tools/extensions
- Enable/disable toggle per-agent
- Required extensions shown as chips — click to navigate to extensions tab
- Demo mode: show DEMO_SKILLS data

**Tab 3: Provider Defaults**

- Dropdown selectors for: Image Generation (OpenAI/Stability/auto), TTS (OpenAI/ElevenLabs), STT (OpenAI/Deepgram), Web Search (Serper/Brave/DuckDuckGo)
- Scope toggle: "Global (all agents)" vs "This agent only"
- Current selection highlighted
- Save button persists to agent config or global config based on scope

### Modify: Main dashboard overview tabs

**Voice tab (moved from `/voice`)**

- TTS provider selector + voice ID
- STT provider selector
- Test synthesis button
- Volume/speed controls
- Same content as current `/voice` page, just rendered as a tab

**Memory tab (add HyDE section)**

- Existing sections stay (browse, health, reminders, conversations, context, settings)
- New "Retrieval Strategy" section in settings sub-tab:
  - HyDE enabled/disabled toggle
  - Initial threshold slider (0.3-0.9, default 0.7)
  - Min threshold slider (0.1-0.5, default 0.3)
  - Adaptive thresholding toggle
  - Full answer granularity toggle

**`/voice` page**

- Redirect to `/dashboard/[seedId]?tab=voice`

### API Routes

**`/api/extensions/[seedId]/route.ts`** — GET: list extensions with enabled status + API key status. PATCH: enable/disable extensions.

**`/api/extensions/[seedId]/configure/route.ts`** — GET: extension overrides config. PATCH: update extension overrides.

**`/api/skills/[seedId]/route.ts`** — GET: list skills with enabled status. PATCH: enable/disable skills.

**`/api/providers/[seedId]/route.ts`** — GET: provider defaults. PATCH: update provider defaults (supports scope: global/agent).

**`/api/memory/[seedId]/hyde/route.ts`** — GET: HyDE config. PATCH: update HyDE config.

### API Client (`wunderland-api.ts`)

New methods:

- `extensions.list(seedId)` → `{ extensions: ExtensionDTO[] }`
- `extensions.update(seedId, { enabled: string[], disabled: string[] })`
- `extensions.getConfig(seedId, extensionName)` → overrides
- `extensions.updateConfig(seedId, extensionName, config)`
- `skills.list(seedId)` → `{ skills: SkillDTO[] }`
- `skills.update(seedId, { enabled: string[], disabled: string[] })`
- `providers.get(seedId)` → `{ defaults: ProviderDefaultsDTO }`
- `providers.update(seedId, defaults, scope)`
- `memory.getHydeConfig(seedId)` → `{ hyde: HydeConfigDTO }`
- `memory.updateHydeConfig(seedId, config)`

### DTOs

```typescript
interface ExtensionDTO {
  name: string;
  displayName: string;
  description: string;
  category: 'tool' | 'voice' | 'productivity';
  enabled: boolean;
  available: boolean;
  envVars?: Array<{ name: string; set: boolean }>;
  docsUrl?: string;
  requiredSecrets: string[];
  priority: number;
}

interface SkillDTO {
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  requiredTools: string[];
  requiredSecrets: string[];
  tags: string[];
}

interface ProviderDefaultsDTO {
  imageGeneration?: string;
  tts?: string;
  stt?: string;
  webSearch?: string;
  scope: 'global' | 'agent';
}

interface HydeConfigDTO {
  enabled: boolean;
  initialThreshold: number;
  minThreshold: number;
  adaptiveThreshold: boolean;
  fullAnswerGranularity: boolean;
}
```

### Demo Data

```typescript
DEMO_EXTENSIONS: ExtensionDTO[] — 12 entries covering all categories with mixed enabled/disabled and API key status
DEMO_SKILLS: SkillDTO[] — 8 entries (image-gen, reddit-bot, social-broadcast, deep-research, etc.)
DEMO_PROVIDER_DEFAULTS: ProviderDefaultsDTO — sample defaults
DEMO_HYDE_CONFIG: HydeConfigDTO — default config
```

### Components

- `ExtensionCard.tsx` — individual extension with toggle, API key status, configure button
- `ExtensionGrid.tsx` — filtered grid of ExtensionCards with category tabs + search
- `SkillRow.tsx` — individual skill with toggle and required extension chips
- `SkillList.tsx` — filterable skill list
- `ProviderDefaultsForm.tsx` — provider dropdown selectors with scope toggle
- `HydeConfigPanel.tsx` — HyDE toggle + threshold sliders
- `ApiKeyStatusBadge.tsx` — reusable green/red badge showing env var status
- `VoiceConfigTab.tsx` — voice settings extracted from `/voice` page into tab component

### Navigation

Sidebar gets new "Extensions" entry between "Memory" and "Credentials" (or similar position). The `/voice` sidebar entry either redirects or is removed in favor of the overview tab.

### Patterns to Follow

- Demo mode: `showDemo = isDemo || (ready && isAuthenticated && !isPaid)` — load from DEMO\_\* constants, never call API
- Demo banner with sign-in CTA
- `StatWidget` for summary metrics
- Tab component pattern from memory page
- API proxy routes follow the health route pattern (GET proxy to backend)
- Error/loading states with skeleton loaders

### Out of Scope

- Ollama setup wizard in UI (CLI only for now)
- Tool failure learning dashboard (Sub-project 3)
- Stealth browser config UI (Sub-project 3)
- Image generation preview/test UI (Sub-project 3)
