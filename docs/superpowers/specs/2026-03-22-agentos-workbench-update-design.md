# AgentOS Workbench Update — Design Specification

**Date:** 2026-03-22
**Status:** Approved
**Author:** Claude (brainstorming session)
**Scope:** High-priority batch (3 features): Guardrail Packs, Skills Browser, Cognitive Memory Dashboard

## Summary

Update the AgentOS Workbench (React + Vite developer cockpit) to support the latest AgentOS APIs. Three features in this batch:

1. **Guardrail Pack Manager** — replace the old regex/keyword rule editor with the real 5-pack extension system (security tier picker, per-pack toggles, live status)
2. **Skills Browser** — new searchable skill catalog showing all 28+ curated SKILL.md files with enable/disable, content preview, and dependency info
3. **Cognitive Memory Dashboard** — new top-level "Memory" tab with overview cards, operation timeline, and memory inspector (episodic/semantic/procedural/working)

## Non-Goals

- Channels UI (37 adapters — separate sub-project)
- Social posting UI (separate sub-project)
- Speech/Voice config (separate sub-project)
- Knowledge graph visualization (separate sub-project)
- Multimodal RAG (separate sub-project, extends existing RAG dashboard)
- Style Adaptation UI (separate sub-project)
- Capability Discovery UI (separate sub-project)

---

## Architecture

### Overall Layout Changes

The workbench layout stays the same (two-column: left tabs + right session inspector). Changes:

1. **New top-level tab: "Memory"** — added alongside Compose/Personas/Agency/Workflows/Evaluation/Planning (7 tabs total)
2. **Settings panel overhauled** — existing Settings gets reorganized:
   - **LLM** — provider config (existing, unchanged)
   - **Guardrails** — new GuardrailPackManager (replaces old GuardrailManager + GuardrailsConfig)
   - **Skills** — new SkillBrowser
   - **Extensions** — existing ExtensionManager (unchanged)
   - **Secrets** — existing SecretManager (unchanged)
   - **Storage** — existing StorageDashboard (unchanged)

### Tech Stack (unchanged)

- React 18, Vite 5, Tailwind CSS, Zustand, lucide-react icons
- Backend: Fastify (bundled)
- Local runtime: `localAgentRuntime.ts` with direct AgentOS instantiation

---

## Feature 1: Guardrail Pack Manager

### Files

| Action | File                                                 |
| ------ | ---------------------------------------------------- |
| DELETE | `src/components/GuardrailsConfig.tsx`                |
| DELETE | `src/components/GuardrailManager.tsx`                |
| CREATE | `src/components/GuardrailPackManager.tsx`            |
| MODIFY | `src/components/SettingsPanel.tsx` (swap old → new)  |
| MODIFY | `backend/src/routes/agentos.ts` (add pack endpoints) |

### Component: GuardrailPackManager

```tsx
/**
 * Replaces the old regex/keyword guardrail editor with the real
 * AgentOS 5-pack extension system.
 *
 * Top section: Security tier radio buttons (dangerous → paranoid)
 * Middle section: 5 guardrail pack checkboxes with status indicators
 * Bottom section: Live evaluation status (when connected)
 */
```

**Security Tier Picker:**

- 5 radio buttons: dangerous / permissive / balanced / strict / paranoid
- Each shows a one-line description
- Changing tier auto-updates pack checkboxes to tier defaults

**Pack Toggles (5 checkboxes):**

| Pack            | Description                                          | Tier Defaults |
| --------------- | ---------------------------------------------------- | ------------- |
| PII Redaction   | Detect and redact personal info (SSN, names, emails) | balanced+     |
| ML Classifiers  | Toxicity, injection, jailbreak via ONNX BERT         | strict+       |
| Topicality      | Embedding-based topic enforcement + drift detection  | paranoid      |
| Code Safety     | OWASP Top 10 code scanning (25 regex rules)          | permissive+   |
| Grounding Guard | RAG-grounded hallucination detection via NLI         | paranoid      |

Each toggle shows:

- Checkbox (checked/unchecked)
- Pack name + one-line description
- Status badge: "loaded" (green) / "not installed" (gray) / "error" (red)
- "custom" badge if user overrode tier default

**Live Status Section (when connected to running instance):**

- Per-pack: last action (ALLOW/FLAG/BLOCK), timestamp, evaluation count
- Total memory usage across all loaded packs
- Collapsed by default, expandable

**Tier defaults mapping** (same as Wunderland SecurityTiers):

```typescript
const TIER_PACK_DEFAULTS: Record<string, Record<string, boolean>> = {
  dangerous: {
    piiRedaction: false,
    mlClassifiers: false,
    topicality: false,
    codeSafety: false,
    groundingGuard: false,
  },
  permissive: {
    piiRedaction: false,
    mlClassifiers: false,
    topicality: false,
    codeSafety: true,
    groundingGuard: false,
  },
  balanced: {
    piiRedaction: true,
    mlClassifiers: false,
    topicality: false,
    codeSafety: true,
    groundingGuard: false,
  },
  strict: {
    piiRedaction: true,
    mlClassifiers: true,
    topicality: false,
    codeSafety: true,
    groundingGuard: false,
  },
  paranoid: {
    piiRedaction: true,
    mlClassifiers: true,
    topicality: true,
    codeSafety: true,
    groundingGuard: true,
  },
};
```

### Backend Routes

```
GET  /api/agentos/guardrails          → list packs with install status + live stats
POST /api/agentos/guardrails/configure → save { tier, packs } config
```

The existing `GET /api/agentos/guardrails` route is updated to return the 5-pack format instead of the old category-based format.

### Local Mode

`localAgentRuntime.ts` creates the `AgentOS` instance. The guardrail config is passed via manifest packs:

```typescript
// Dynamic import of available packs
const packs = [];
if (config.guardrails.piiRedaction) {
  try {
    const { createPiiRedactionGuardrail } = await import('@framers/agentos-ext-pii-redaction');
    packs.push({ factory: () => createPiiRedactionGuardrail({ redactionStyle: 'placeholder' }) });
  } catch {
    /* not installed */
  }
}
// ... same for other 4 packs
```

---

## Feature 2: Skills Browser

### Files

| Action | File                                                        |
| ------ | ----------------------------------------------------------- |
| CREATE | `src/components/SkillBrowser.tsx`                           |
| CREATE | `src/components/SkillCard.tsx`                              |
| CREATE | `src/components/SkillDetail.tsx`                            |
| MODIFY | `src/components/SettingsPanel.tsx` (add Skills sub-section) |
| CREATE | `backend/src/routes/skills.ts`                              |
| MODIFY | `backend/src/index.ts` (register skills routes)             |

### Component: SkillBrowser

```tsx
/**
 * Searchable, filterable catalog of all curated SKILL.md files
 * from @framers/agentos-skills-registry.
 *
 * Top: search bar + category filter dropdown + "N of M skills active" summary
 * Body: card grid of skills
 * Detail: expanded view with full SKILL.md markdown content
 */
```

**Search + Filter:**

- Text input: searches name, description, tags
- Category dropdown: all / security / information / coding / voice / social / productivity / system
- Active count: "3 of 28 skills active"

**SkillCard (compact, in grid):**

- Emoji + name (from frontmatter `metadata.agentos.emoji` + `name`)
- Category badge
- One-line `description` from frontmatter
- Required tools (e.g., "web-search, pii_scan") — from `requires_tools`
- Required env var indicator (from `metadata.agentos.primaryEnv`)
- Enable/disable toggle
- Click → expand to SkillDetail

**SkillDetail (expanded view):**

- Full SKILL.md content rendered as markdown (react-markdown, already a dependency)
- Frontmatter fields displayed as metadata table
- Required tools list with install status (installed vs missing)
- Required env vars with set/unset status (from SecretStore)
- "Enable" / "Disable" button

### Backend Routes

```
GET  /api/agentos/skills           → list all skills (name, description, category, tags, emoji, requires_tools, primaryEnv)
GET  /api/agentos/skills/:name     → get full SKILL.md content + parsed frontmatter
POST /api/agentos/skills/enable    → { name } → enable skill for current session
POST /api/agentos/skills/disable   → { name } → disable skill
GET  /api/agentos/skills/active    → list currently enabled skills
```

The backend uses `@framers/agentos-skills-registry` to enumerate skills and `@framers/agentos-skills` (the runtime loader) to manage enabled state.

### Local Mode

In local mode, skills are loaded directly from the registry:

```typescript
import { SKILLS_CATALOG } from '@framers/agentos-skills-registry';
// Each entry has: name, description, category, tags, content (full markdown)
```

The `SkillRegistry` from `@framers/agentos` manages the active skill set. Enabling a skill adds it to the `SkillSnapshot` that gets injected into the system prompt.

---

## Feature 3: Cognitive Memory Dashboard

### Files

| Action | File                                            |
| ------ | ----------------------------------------------- |
| CREATE | `src/components/MemoryDashboard.tsx`            |
| CREATE | `src/components/MemoryOverview.tsx`             |
| CREATE | `src/components/MemoryTimeline.tsx`             |
| CREATE | `src/components/MemoryInspector.tsx`            |
| CREATE | `src/components/MemoryEntryCard.tsx`            |
| MODIFY | `src/App.tsx` (add Memory tab)                  |
| CREATE | `src/state/memoryStore.ts` (Zustand store)      |
| CREATE | `backend/src/routes/memory.ts`                  |
| MODIFY | `backend/src/index.ts` (register memory routes) |

### Component: MemoryDashboard

Top-level tab component with 3 sub-views via internal tabs:

```tsx
/**
 * Cognitive memory inspection and management.
 *
 * Sub-tabs:
 * - Overview: summary cards for each memory type
 * - Timeline: chronological log of memory operations
 * - Inspector: browse and search stored memories
 */
```

### Sub-view: MemoryOverview

4 summary cards (grid layout):

| Card           | Shows                                                                         |
| -------------- | ----------------------------------------------------------------------------- |
| **Episodic**   | Count, most recent memory, temporal range                                     |
| **Semantic**   | Count, top categories, knowledge graph node count                             |
| **Procedural** | Count, active patterns/skills                                                 |
| **Working**    | Current context tokens, max tokens, compression ratio, rolling summary status |

Plus a "Memory Health" indicator:

- Green: all stores healthy
- Yellow: working memory near capacity (>80% tokens used)
- Red: memory write failures or store errors

### Sub-view: MemoryTimeline

Chronological event feed showing:

```
[12:34:56] WRITE episodic  "User asked about billing refund policy" (confidence: 0.85)
[12:34:57] RETRIEVE semantic  "Company refund policy is 30 days" (relevance: 0.92, from RAG)
[12:35:01] CONSOLIDATE episodic→semantic  "Billing inquiries are common for this user"
[12:35:12] SUMMARIZE working  Compressed turns 1-5 into rolling summary (saved 2400 tokens)
```

Each entry shows:

- Timestamp
- Operation type: WRITE / RETRIEVE / CONSOLIDATE / SUMMARIZE / DELETE
- Memory category (episodic/semantic/procedural/working)
- Content snippet (truncated)
- Metadata (confidence, relevance, source, token count)

Filterable by operation type and memory category.

### Sub-view: MemoryInspector

Tree browser:

```
▼ Episodic (24 entries)
  ├── "User asked about billing..."  [0.85]  3min ago
  ├── "User prefers formal tone..."  [0.72]  15min ago
  └── ...
▼ Semantic (12 entries)
  ├── "Refund policy: 30 days..."  [0.95]  from RAG
  ├── "Company hours: 9am-5pm..."  [0.90]  from RAG
  └── ...
▼ Procedural (3 entries)
  ├── "Use formal greeting..."  [active]
  └── ...
▼ Working Memory
  ├── Context window: 4,200 / 8,000 tokens
  ├── Rolling summary: "User is a premium customer inquiring about..."
  └── Active turns: 3 (2 summarized)
```

Each entry expandable to show full content + all metadata.

Search bar searches across all memory stores.
Delete button per entry (with confirmation).

### Zustand Store: memoryStore

```typescript
interface MemoryState {
  overview: MemoryOverviewData | null;
  timeline: MemoryTimelineEvent[];
  entries: Record<MemoryCategory, MemoryEntry[]>;
  loading: boolean;
  error: string | null;
  // Actions
  fetchOverview: () => Promise<void>;
  fetchTimeline: (since?: number) => Promise<void>;
  fetchEntries: (category: MemoryCategory) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}
```

### Backend Routes

```
GET    /api/agentos/memory/stats                → { episodic: { count, newest }, semantic: { count }, ... }
GET    /api/agentos/memory/timeline?since=ts     → MemoryTimelineEvent[]
GET    /api/agentos/memory/entries?type=episodic  → MemoryEntry[] (paginated)
GET    /api/agentos/memory/working               → { tokens, maxTokens, rollingSummary, activeTurns }
DELETE /api/agentos/memory/entries/:id            → delete a memory entry
```

In connected mode, these route through to the AgentOS backend's memory subsystem.

In local mode, reads from `ConversationManager` (working memory), `ILongTermMemoryRetriever` (episodic/semantic), and the local `IRollingSummaryMemorySink`.

---

## Testing Strategy

### E2E (Playwright)

1. **Guardrails**: Navigate to Settings → Guardrails. Select "strict" tier. Verify PII, ML, Code Safety checkboxes are checked, Topicality and Grounding are unchecked. Toggle one pack manually, verify "custom" badge appears.
2. **Skills**: Navigate to Settings → Skills. Verify card grid renders. Search for "web-search". Verify card appears with correct emoji and description. Click to expand, verify markdown renders.
3. **Memory**: Navigate to Memory tab. Verify overview cards render (may show zeros in standalone mode). Switch to Timeline sub-tab. Switch to Inspector sub-tab.

### Unit (Node test runner)

1. Backend skill routes: mock `@framers/agentos-skills-registry`, verify list/detail/enable/disable
2. Backend memory routes: mock memory stores, verify stats/timeline/entries/delete
3. Guardrail tier defaults: verify TIER_PACK_DEFAULTS mapping is consistent with Wunderland SecurityTiers

---

## Implementation Sequence

1. **GuardrailPackManager** — delete old components, create new, wire into Settings
2. **Backend skill routes** — create routes, register in index
3. **SkillBrowser + SkillCard + SkillDetail** — create components, wire into Settings
4. **Backend memory routes** — create routes, register in index
5. **memoryStore** — create Zustand store
6. **MemoryDashboard + sub-views** — create components, add Memory tab to App.tsx
7. **Verification** — Playwright tests, manual testing in both connected and local modes
