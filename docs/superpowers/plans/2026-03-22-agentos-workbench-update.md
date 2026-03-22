# AgentOS Workbench Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the AgentOS Workbench to support guardrail extension packs (5-pack system with security tier picker), a curated skills browser, and a cognitive memory dashboard.

**Architecture:** Replace the old regex/keyword guardrail editor with the real AgentOS extension pack system. Add a skills browser to Settings. Add a top-level Memory tab with overview, timeline, and inspector sub-views. Backend adds routes for skills and memory; guardrail routes are updated.

**Tech Stack:** React 18, Vite 5, Tailwind CSS, Zustand 5, Fastify (backend), lucide-react, react-markdown

**Spec:** `docs/superpowers/specs/2026-03-22-agentos-workbench-update-design.md`

---

## File Map

All paths relative to `apps/agentos-workbench/`.

### Feature 1: Guardrail Pack Manager

| Action | File                                      |
| ------ | ----------------------------------------- |
| DELETE | `src/components/GuardrailsConfig.tsx`     |
| DELETE | `src/components/GuardrailManager.tsx`     |
| CREATE | `src/components/GuardrailPackManager.tsx` |
| MODIFY | `src/components/SettingsPanel.tsx`        |
| MODIFY | `backend/src/routes/agentos.ts`           |
| MODIFY | `backend/src/mockData.ts`                 |

### Feature 2: Skills Browser

| Action | File                               |
| ------ | ---------------------------------- |
| CREATE | `src/components/SkillBrowser.tsx`  |
| CREATE | `src/components/SkillCard.tsx`     |
| CREATE | `src/components/SkillDetail.tsx`   |
| MODIFY | `src/components/SettingsPanel.tsx` |
| CREATE | `backend/src/routes/skills.ts`     |
| MODIFY | `backend/src/index.ts`             |

### Feature 3: Cognitive Memory Dashboard

| Action | File                                 |
| ------ | ------------------------------------ |
| CREATE | `src/components/MemoryDashboard.tsx` |
| CREATE | `src/components/MemoryOverview.tsx`  |
| CREATE | `src/components/MemoryTimeline.tsx`  |
| CREATE | `src/components/MemoryInspector.tsx` |
| CREATE | `src/state/memoryStore.ts`           |
| MODIFY | `src/state/uiStore.ts`               |
| MODIFY | `src/App.tsx`                        |
| CREATE | `backend/src/routes/memory.ts`       |
| MODIFY | `backend/src/index.ts`               |

---

## Task 1: GuardrailPackManager component

**Files:**

- Create: `apps/agentos-workbench/src/components/GuardrailPackManager.tsx`

- [ ] **Step 1: Create GuardrailPackManager.tsx**

A self-contained React component with:

1. **State**: `tier` (string, default `'balanced'`), `packs` (Record of 5 booleans), `liveStatus` (optional per-pack stats)
2. **TIER_PACK_DEFAULTS** const mapping each tier to default pack booleans (same as Wunderland SecurityTiers)
3. **Security Tier Picker**: 5 radio buttons with labels and one-line descriptions. On change → update `tier` and reset `packs` to tier defaults.
4. **Pack Toggles**: 5 checkboxes, each showing pack name, description, status badge (uses `packStatus` prop or defaults to 'not installed'), and "custom" badge when value differs from tier default.
5. **onConfigChange callback prop**: called with `{ tier, packs }` whenever anything changes.

Use Tailwind classes matching the existing workbench styling (cards use `bg-[var(--surface)] border border-[var(--border)]` pattern). Use `Shield`, `Brain`, `Target`, `Code`, `Search` icons from lucide-react.

- [ ] **Step 2: Verify component renders in isolation**

Import into SettingsPanel temporarily to verify it renders.

- [ ] **Step 3: Commit**

```bash
cd apps/agentos-workbench
git add src/components/GuardrailPackManager.tsx
git commit -m "feat: add GuardrailPackManager component with tier picker + 5-pack toggles"
git push origin master
```

---

## Task 2: Wire GuardrailPackManager into Settings, delete old components

**Files:**

- Delete: `apps/agentos-workbench/src/components/GuardrailsConfig.tsx`
- Delete: `apps/agentos-workbench/src/components/GuardrailManager.tsx`
- Modify: `apps/agentos-workbench/src/components/SettingsPanel.tsx`

- [ ] **Step 1: Update SettingsPanel.tsx**

Read the full `SettingsPanel.tsx`. Replace the `GuardrailManager` import and usage with `GuardrailPackManager`:

```tsx
// Remove:
import { GuardrailManager, type SerializableGuardrail } from './GuardrailManager';
// Add:
import { GuardrailPackManager } from './GuardrailPackManager';
```

Remove the `guardrails` state (`useState<SerializableGuardrail[]>`) and replace the `<GuardrailManager>` JSX with `<GuardrailPackManager>`.

Add a Settings sub-nav with tabs: LLM | Guardrails | Skills | Extensions | Secrets | Storage. Use a simple `activeSettingsTab` state.

- [ ] **Step 2: Delete old components**

```bash
rm src/components/GuardrailsConfig.tsx src/components/GuardrailManager.tsx
```

- [ ] **Step 3: Update backend guardrail route**

In `backend/src/routes/agentos.ts`, update the `GET /guardrails` handler to return the 5-pack format:

```typescript
fastify.get('/guardrails', async () => {
  return {
    tier: 'balanced',
    packs: [
      {
        id: 'pii-redaction',
        name: 'PII Redaction',
        description: 'Detect and redact personal info',
        installed: false,
        enabled: true,
      },
      {
        id: 'ml-classifiers',
        name: 'ML Classifiers',
        description: 'Toxicity, injection, jailbreak via ONNX BERT',
        installed: false,
        enabled: false,
      },
      {
        id: 'topicality',
        name: 'Topicality',
        description: 'Embedding-based topic enforcement + drift detection',
        installed: false,
        enabled: false,
      },
      {
        id: 'code-safety',
        name: 'Code Safety',
        description: 'OWASP Top 10 code scanning (25 regex rules)',
        installed: false,
        enabled: true,
      },
      {
        id: 'grounding-guard',
        name: 'Grounding Guard',
        description: 'RAG-grounded hallucination detection via NLI',
        installed: false,
        enabled: false,
      },
    ],
  };
});
```

Add `POST /guardrails/configure` that accepts `{ tier, packs }` and stores in memory.

- [ ] **Step 4: Verify end-to-end**

Start the workbench, navigate to Settings, verify the tier picker and pack toggles render. Change tier, verify checkboxes update. Toggle a pack manually, verify "custom" badge appears.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: replace old guardrail editor with GuardrailPackManager + update backend"
git push origin master
```

---

## Task 3: Backend skills routes

**Files:**

- Create: `apps/agentos-workbench/backend/src/routes/skills.ts`
- Modify: `apps/agentos-workbench/backend/src/index.ts`

- [ ] **Step 1: Create skills.ts route file**

Follow the pattern in `backend/src/routes/evaluation.ts` (Fastify plugin pattern):

```typescript
import { FastifyInstance } from 'fastify';

/** Mock skill data matching @framers/agentos-skills-registry format */
const MOCK_SKILLS = [
  {
    name: 'web-search',
    description: 'Search the web for information using multiple providers',
    category: 'information',
    tags: ['search', 'web', 'research'],
    emoji: '🔍',
    primaryEnv: 'SERPER_API_KEY',
    requiresTools: ['web-search'],
    enabled: false,
  },
  {
    name: 'coding-agent',
    description: 'Write, debug, and refactor code across multiple languages',
    category: 'coding',
    tags: ['code', 'programming', 'debug'],
    emoji: '💻',
    primaryEnv: null,
    requiresTools: ['shell_execute', 'file_read', 'file_write'],
    enabled: false,
  },
  // ... 8-10 representative skills with varied categories
];

export default async function skillRoutes(fastify: FastifyInstance) {
  fastify.get('/skills', async () => MOCK_SKILLS);

  fastify.get('/skills/:name', async (req) => {
    const { name } = req.params as { name: string };
    const skill = MOCK_SKILLS.find((s) => s.name === name);
    if (!skill) return fastify.httpErrors.notFound();
    return {
      ...skill,
      content: `# ${skill.name}\n\nSkill markdown content would be loaded from SKILL.md...`,
    };
  });

  fastify.post('/skills/enable', async (req) => {
    const { name } = req.body as { name: string };
    const skill = MOCK_SKILLS.find((s) => s.name === name);
    if (skill) skill.enabled = true;
    return { ok: true };
  });

  fastify.post('/skills/disable', async (req) => {
    const { name } = req.body as { name: string };
    const skill = MOCK_SKILLS.find((s) => s.name === name);
    if (skill) skill.enabled = false;
    return { ok: true };
  });

  fastify.get('/skills/active', async () => MOCK_SKILLS.filter((s) => s.enabled));
}
```

- [ ] **Step 2: Register in backend/src/index.ts**

Read `backend/src/index.ts`, find where other route plugins are registered (`fastify.register(...)`) and add:

```typescript
import skillRoutes from './routes/skills.js';
fastify.register(skillRoutes, { prefix: '/api/agentos' });
```

- [ ] **Step 3: Test routes**

Start backend, verify:

```bash
curl http://localhost:3001/api/agentos/skills | jq '.[0]'
curl http://localhost:3001/api/agentos/skills/web-search | jq '.name'
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/routes/skills.ts backend/src/index.ts
git commit -m "feat: add backend skill routes (list, detail, enable, disable)"
git push origin master
```

---

## Task 4: SkillBrowser + SkillCard + SkillDetail components

**Files:**

- Create: `apps/agentos-workbench/src/components/SkillBrowser.tsx`
- Create: `apps/agentos-workbench/src/components/SkillCard.tsx`
- Create: `apps/agentos-workbench/src/components/SkillDetail.tsx`
- Modify: `apps/agentos-workbench/src/components/SettingsPanel.tsx`

- [ ] **Step 1: Create SkillCard.tsx**

Compact card component for the grid:

- Props: `skill` (name, description, category, emoji, requiresTools, primaryEnv, enabled), `onToggle`, `onSelect`
- Renders: emoji + name, category badge, description, tool pills, env indicator, toggle switch
- Click → calls `onSelect`

- [ ] **Step 2: Create SkillDetail.tsx**

Expanded detail panel:

- Props: `skill` (with `content` markdown), `onClose`, `onToggle`
- Renders: full SKILL.md via react-markdown, frontmatter metadata table, required tools with status, env vars with status, enable/disable button
- Close button returns to grid

- [ ] **Step 3: Create SkillBrowser.tsx**

Container component:

- Fetches skills from `GET /api/agentos/skills` via agentosClient (add `getSkills()` method)
- State: `skills[]`, `search` string, `categoryFilter`, `selectedSkill` (name or null)
- Search filters by name + description + tags
- Category dropdown: all / information / coding / security / voice / social / productivity / system
- Active count: "N of M skills active"
- Renders: search bar + filter + SkillCard grid, or SkillDetail when selected

- [ ] **Step 4: Add getSkills to agentosClient.ts**

Read `src/lib/agentosClient.ts`. Add:

```typescript
export async function getSkills(): Promise<Skill[]> {
  const res = await fetch(`${baseUrl}/api/agentos/skills`);
  return res.json();
}
export async function getSkillDetail(name: string): Promise<SkillDetail> {
  const res = await fetch(`${baseUrl}/api/agentos/skills/${name}`);
  return res.json();
}
export async function enableSkill(name: string): Promise<void> {
  await fetch(`${baseUrl}/api/agentos/skills/enable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}
export async function disableSkill(name: string): Promise<void> {
  await fetch(`${baseUrl}/api/agentos/skills/disable`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
}
```

- [ ] **Step 5: Wire into SettingsPanel**

Add "Skills" as a Settings sub-tab. When active, render `<SkillBrowser />`.

- [ ] **Step 6: Verify end-to-end**

Start workbench + backend. Navigate to Settings → Skills. Verify grid renders with mock skills. Search. Filter by category. Click a skill to see detail. Toggle enable/disable.

- [ ] **Step 7: Commit**

```bash
git add src/components/SkillBrowser.tsx src/components/SkillCard.tsx src/components/SkillDetail.tsx src/components/SettingsPanel.tsx src/lib/agentosClient.ts
git commit -m "feat: add Skills Browser with search, filter, card grid, and detail view"
git push origin master
```

---

## Task 5: Backend memory routes

**Files:**

- Create: `apps/agentos-workbench/backend/src/routes/memory.ts`
- Modify: `apps/agentos-workbench/backend/src/index.ts`

- [ ] **Step 1: Create memory.ts route file**

```typescript
import { FastifyInstance } from 'fastify';

/** Mock memory data for the cognitive memory dashboard */
const mockMemoryEntries = {
  episodic: [
    {
      id: 'ep-1',
      content: 'User asked about billing refund policy',
      confidence: 0.85,
      timestamp: Date.now() - 180000,
      source: 'conversation',
      tags: ['billing'],
    },
    {
      id: 'ep-2',
      content: 'User prefers formal communication style',
      confidence: 0.72,
      timestamp: Date.now() - 900000,
      source: 'observation',
      tags: ['style'],
    },
  ],
  semantic: [
    {
      id: 'sem-1',
      content: 'Company refund policy allows returns within 30 days',
      confidence: 0.95,
      timestamp: Date.now() - 3600000,
      source: 'rag',
      tags: ['policy'],
    },
    {
      id: 'sem-2',
      content: 'Business hours are 9am-5pm EST',
      confidence: 0.9,
      timestamp: Date.now() - 7200000,
      source: 'rag',
      tags: ['hours'],
    },
  ],
  procedural: [
    {
      id: 'proc-1',
      content: 'Always use formal greeting for this user',
      confidence: 1.0,
      timestamp: Date.now() - 86400000,
      source: 'learned',
      tags: ['greeting'],
    },
  ],
  working: {
    tokens: 4200,
    maxTokens: 8000,
    activeTurns: 3,
    summarizedTurns: 2,
    rollingSummary: 'User is a premium customer inquiring about refund policy for a recent charge.',
  },
};

const mockTimeline = [
  {
    timestamp: Date.now() - 180000,
    operation: 'WRITE',
    category: 'episodic',
    content: 'User asked about billing refund policy',
    metadata: { confidence: 0.85 },
  },
  {
    timestamp: Date.now() - 175000,
    operation: 'RETRIEVE',
    category: 'semantic',
    content: 'Company refund policy is 30 days',
    metadata: { relevance: 0.92, source: 'rag' },
  },
  {
    timestamp: Date.now() - 60000,
    operation: 'SUMMARIZE',
    category: 'working',
    content: 'Compressed turns 1-5 into rolling summary',
    metadata: { tokensSaved: 2400 },
  },
];

export default async function memoryRoutes(fastify: FastifyInstance) {
  fastify.get('/memory/stats', async () => ({
    episodic: {
      count: mockMemoryEntries.episodic.length,
      newest: mockMemoryEntries.episodic[0]?.timestamp,
    },
    semantic: { count: mockMemoryEntries.semantic.length },
    procedural: { count: mockMemoryEntries.procedural.length },
    working: {
      tokens: mockMemoryEntries.working.tokens,
      maxTokens: mockMemoryEntries.working.maxTokens,
    },
  }));

  fastify.get('/memory/timeline', async (req) => {
    const { since } = req.query as { since?: string };
    const sinceTs = since ? parseInt(since, 10) : 0;
    return mockTimeline.filter((e) => e.timestamp > sinceTs);
  });

  fastify.get('/memory/entries', async (req) => {
    const { type } = req.query as { type?: string };
    if (type === 'working') return mockMemoryEntries.working;
    if (type && type in mockMemoryEntries) return (mockMemoryEntries as any)[type];
    return mockMemoryEntries;
  });

  fastify.get('/memory/working', async () => mockMemoryEntries.working);

  fastify.delete('/memory/entries/:id', async (req) => {
    const { id } = req.params as { id: string };
    for (const cat of ['episodic', 'semantic', 'procedural'] as const) {
      const idx = mockMemoryEntries[cat].findIndex((e) => e.id === id);
      if (idx >= 0) {
        mockMemoryEntries[cat].splice(idx, 1);
        return { ok: true };
      }
    }
    return fastify.httpErrors.notFound();
  });
}
```

- [ ] **Step 2: Register in backend/src/index.ts**

```typescript
import memoryRoutes from './routes/memory.js';
fastify.register(memoryRoutes, { prefix: '/api/agentos' });
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/routes/memory.ts backend/src/index.ts
git commit -m "feat: add backend memory routes (stats, timeline, entries, working, delete)"
git push origin master
```

---

## Task 6: Memory Zustand store + API client methods

**Files:**

- Create: `apps/agentos-workbench/src/state/memoryStore.ts`
- Modify: `apps/agentos-workbench/src/lib/agentosClient.ts`

- [ ] **Step 1: Add memory API methods to agentosClient.ts**

```typescript
export async function getMemoryStats() {
  const res = await fetch(`${baseUrl}/api/agentos/memory/stats`);
  return res.json();
}
export async function getMemoryTimeline(since?: number) {
  const url = since
    ? `${baseUrl}/api/agentos/memory/timeline?since=${since}`
    : `${baseUrl}/api/agentos/memory/timeline`;
  const res = await fetch(url);
  return res.json();
}
export async function getMemoryEntries(type?: string) {
  const url = type
    ? `${baseUrl}/api/agentos/memory/entries?type=${type}`
    : `${baseUrl}/api/agentos/memory/entries`;
  const res = await fetch(url);
  return res.json();
}
export async function getWorkingMemory() {
  const res = await fetch(`${baseUrl}/api/agentos/memory/working`);
  return res.json();
}
export async function deleteMemoryEntry(id: string) {
  await fetch(`${baseUrl}/api/agentos/memory/entries/${id}`, { method: 'DELETE' });
}
```

- [ ] **Step 2: Create memoryStore.ts**

```typescript
import { create } from 'zustand';
import {
  getMemoryStats,
  getMemoryTimeline,
  getMemoryEntries,
  getWorkingMemory,
  deleteMemoryEntry,
} from '@/lib/agentosClient';

interface MemoryState {
  stats: any | null;
  timeline: any[];
  entries: Record<string, any[]>;
  working: any | null;
  loading: boolean;
  error: string | null;
  activeSubTab: 'overview' | 'timeline' | 'inspector';
  setActiveSubTab: (tab: 'overview' | 'timeline' | 'inspector') => void;
  fetchStats: () => Promise<void>;
  fetchTimeline: (since?: number) => Promise<void>;
  fetchEntries: (type?: string) => Promise<void>;
  fetchWorking: () => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
}

export const useMemoryStore = create<MemoryState>()((set, get) => ({
  stats: null,
  timeline: [],
  entries: {},
  working: null,
  loading: false,
  error: null,
  activeSubTab: 'overview',
  setActiveSubTab: (tab) => set({ activeSubTab: tab }),
  fetchStats: async () => {
    try {
      set({ loading: true });
      const stats = await getMemoryStats();
      set({ stats, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },
  fetchTimeline: async (since) => {
    try {
      const timeline = await getMemoryTimeline(since);
      set({ timeline });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
  fetchEntries: async (type) => {
    try {
      const data = await getMemoryEntries(type);
      set((s) => ({ entries: { ...s.entries, ...(type ? { [type]: data } : data) } }));
    } catch (e: any) {
      set({ error: e.message });
    }
  },
  fetchWorking: async () => {
    try {
      const working = await getWorkingMemory();
      set({ working });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
  removeEntry: async (id) => {
    try {
      await deleteMemoryEntry(id);
      set((s) => {
        const entries = { ...s.entries };
        for (const k of Object.keys(entries)) {
          entries[k] = entries[k].filter((e: any) => e.id !== id);
        }
        return { entries };
      });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
}));
```

- [ ] **Step 3: Commit**

```bash
git add src/state/memoryStore.ts src/lib/agentosClient.ts
git commit -m "feat: add memory Zustand store + API client methods"
git push origin master
```

---

## Task 7: Memory Dashboard components

**Files:**

- Create: `apps/agentos-workbench/src/components/MemoryOverview.tsx`
- Create: `apps/agentos-workbench/src/components/MemoryTimeline.tsx`
- Create: `apps/agentos-workbench/src/components/MemoryInspector.tsx`
- Create: `apps/agentos-workbench/src/components/MemoryDashboard.tsx`

- [ ] **Step 1: Create MemoryOverview.tsx**

4 summary cards in a 2x2 grid:

- Episodic: `Brain` icon, count, most recent timestamp
- Semantic: `Database` icon, count
- Procedural: `Cog` icon, count
- Working: `Gauge` icon, tokens/maxTokens bar, rolling summary preview

Health indicator: green/yellow/red based on working memory usage.

Fetches from `useMemoryStore().fetchStats()` on mount.

- [ ] **Step 2: Create MemoryTimeline.tsx**

Chronological event feed:

- Each entry: timestamp, operation badge (WRITE/RETRIEVE/CONSOLIDATE/SUMMARIZE/DELETE with colors), category, content snippet, metadata
- Filter bar: operation type checkboxes, category dropdown
- Auto-refresh on interval or manual refresh button

Fetches from `useMemoryStore().fetchTimeline()`.

- [ ] **Step 3: Create MemoryInspector.tsx**

Collapsible tree browser:

- 4 top-level categories (Episodic/Semantic/Procedural/Working)
- Each expandable to show entries
- Entry shows: content (truncated), confidence badge, timestamp, source tag
- Click to expand full content + all metadata
- Delete button per entry (with confirm)
- Search bar across all entries
- Working memory section shows token bar + rolling summary

Fetches from `useMemoryStore().fetchEntries()`.

- [ ] **Step 4: Create MemoryDashboard.tsx**

Container with 3 sub-tabs (Overview / Timeline / Inspector):

```tsx
const { activeSubTab, setActiveSubTab } = useMemoryStore();
```

Renders the active sub-view. Tab bar at top with pill-style toggles.

- [ ] **Step 5: Commit**

```bash
git add src/components/MemoryOverview.tsx src/components/MemoryTimeline.tsx src/components/MemoryInspector.tsx src/components/MemoryDashboard.tsx
git commit -m "feat: add Memory Dashboard with overview, timeline, and inspector views"
git push origin master
```

---

## Task 8: Wire Memory tab into App.tsx

**Files:**

- Modify: `apps/agentos-workbench/src/state/uiStore.ts`
- Modify: `apps/agentos-workbench/src/App.tsx`

- [ ] **Step 1: Update uiStore.ts**

Add `'memory'` to the `LeftPanelKey` type:

```typescript
type LeftPanelKey =
  | 'compose'
  | 'personas'
  | 'agency'
  | 'workflows'
  | 'evaluation'
  | 'planning'
  | 'memory';
```

- [ ] **Step 2: Update App.tsx**

Read the full App.tsx. Add the Memory tab:

1. Import `MemoryDashboard`:

```typescript
import { MemoryDashboard } from '@/components/MemoryDashboard';
```

2. Find the tab buttons (search for the pattern that renders compose/personas/agency/workflows/evaluation/planning tabs). Add a "Memory" tab button with a `Brain` icon from lucide-react.

3. Find the conditional rendering that shows the active panel content. Add:

```tsx
{
  activePanel === 'memory' && <MemoryDashboard />;
}
```

- [ ] **Step 3: Verify end-to-end**

Start workbench + backend. Click Memory tab. Verify Overview cards render with mock data. Switch to Timeline. Switch to Inspector. Expand a memory entry. Delete one (verify it disappears).

- [ ] **Step 4: Commit**

```bash
git add src/state/uiStore.ts src/App.tsx
git commit -m "feat: add Memory tab to workbench main navigation"
git push origin master
```

---

## Task 9: Final verification + cleanup

- [ ] **Step 1: Full manual test**

1. Start backend: `cd apps/agentos-workbench/backend && npx tsx src/index.ts`
2. Start frontend: `cd apps/agentos-workbench && pnpm dev`
3. Test Guardrails: Settings → Guardrails → change tier → verify packs update → toggle manually → verify "custom" badge
4. Test Skills: Settings → Skills → search → filter → select → view detail → enable/disable
5. Test Memory: Memory tab → Overview (4 cards) → Timeline (events) → Inspector (tree + search + delete)

- [ ] **Step 2: Remove any unused imports**

Search for imports of deleted files (`GuardrailsConfig`, `GuardrailManager`). Remove any remaining references.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: cleanup unused guardrail imports"
git push origin master
```

- [ ] **Step 4: Update monorepo pointer**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add apps/agentos-workbench
git commit -m "feat(workbench): add guardrail packs, skills browser, memory dashboard"
git push origin master
```
