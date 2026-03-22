# AgentOS Core Reorganization & Integration Wiring

## Goal

Reorganize `packages/agentos/src/` for maximum readability and clean architecture, wire missing integrations (skills discovery, guardrail persistence), split oversized files, and add stable barrel exports — all without losing functionality.

## Scope

- **In scope**: `packages/agentos/src/` folder hierarchy, barrel exports, file splits, backend integration wiring (`agentos.integration.ts`), guardrail persistence
- **Out of scope**: WunderlandGateway bootstrap hang (by design), Rabbithole extensions dashboard (separate spec), agentos-ext-cognitive-memory package (non-blocking — built-in pack works)

## Corrected Findings

These were initially flagged but verified as non-issues:

- Discovery engine is already initialized at `AgentOS.ts:1192` — not dead code
- Rolling memory sink renders a TODO section heading, does not leak to users
- `SECRET_ENV_MAP` covers all 37/37 required channel secrets
- `agentos-ext-cognitive-memory` being empty is non-blocking — `tool-registry.ts:53` ships a built-in pack

## Real Gaps (4)

| #   | Gap                                         | Location                                                                 | Fix                                     |
| --- | ------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------- |
| 1   | Missing barrel exports for 4 core domains   | `core/{conversation,streaming,orchestration,workflows}/`                 | Add `index.ts` files                    |
| 2   | Skills not wired as discovery source        | `agentos.integration.ts:1108` never populates `discovery.sources.skills` | Wire `@framers/agentos-skills-registry` |
| 3   | `agentos-ext-skills` not loaded by default  | Backend extension manifest omits it                                      | Add to `createCuratedManifest()` call   |
| 4   | Guardrail logger/review persistence stubbed | `backend/src/integrations/agentos/guardrails/GuardrailLogger.ts:283,364` | Replace with SQLite-backed service      |

## Architecture

### Current State

`packages/agentos/src/core/` has 27 subsystems flat at the same directory level. No domain grouping. 12 of 27 subsystems lack `index.ts` barrel files. Two API files exceed 2000 LOC each.

### Target State

Group 27 subsystems into 7 domains under `core/`. Split 2 oversized API files into focused delegates. Wire 2 missing integrations. Replace 2 stubs.

### Directory Structure

```
packages/agentos/src/
├── api/                              # Public facade
│   ├── AgentOS.ts                    # ~1100 LOC (slimmed)
│   ├── AgentOSOrchestrator.ts        # ~1200 LOC (slimmed)
│   ├── AgentOSWorkflows.ts           # Delegate: 14 workflow methods
│   ├── AgentOSDiscovery.ts           # Delegate: turn planner + discovery init
│   ├── TaskOutcomeTelemetryManager.ts # Delegate: KPI tracking (5 methods)
│   ├── StreamChunkAssembler.ts       # Delegate: chunk emission (4 methods)
│   ├── turn-phases/                  # One file per phase
│   │   ├── rolling-summary.ts        # Compaction logic (~83 LOC)
│   │   ├── long-term-memory.ts       # Retrieval + cadence (~96 LOC)
│   │   ├── conversation-history.ts   # Trimming + dedup (~48 LOC)
│   │   └── prompt-profile.ts         # Profile routing (~45 LOC)
│   ├── errors.ts                     # AgentOSServiceError (70 LOC)
│   ├── interfaces/
│   │   └── IAgentOS.ts
│   ├── types/
│   │   ├── AgentOSInput.ts
│   │   ├── AgentOSResponse.ts
│   │   └── OrchestratorConfig.ts     # Config interfaces from orchestrator
│   └── index.ts                      # Barrel
│
├── cognitive_substrate/              # KEPT — published path, no rename
│   ├── GMI.ts
│   ├── IGMI.ts
│   ├── GMIManager.ts
│   ├── GMIEvent.ts
│   ├── personas/
│   ├── persona_overlays/
│   └── index.ts
│
├── core/
│   ├── tools/                        # Elevated — used by everything
│   │   ├── ITool.ts
│   │   ├── IToolOrchestrator.ts
│   │   ├── ToolOrchestrator.ts
│   │   ├── ToolExecutor.ts
│   │   ├── permissions/
│   │   └── index.ts                  # DONE — already fixed
│   │
│   ├── intelligence/                 # LLM + reasoning capabilities
│   │   ├── llm/                      # Providers, auth, routing (preserved)
│   │   ├── structured/               # JSON schema, function calling
│   │   ├── ai-utilities/             # Renamed from ai_utilities
│   │   ├── planning/                 # Planning engine
│   │   ├── PromptProfileRouter.ts    # Absorbed from prompting/ (1 file)
│   │   └── index.ts
│   │
│   ├── safety/                       # Safety + human oversight
│   │   ├── guardrails/               # Input/output filtering
│   │   ├── primitives/               # Renamed from safety/ (circuit breaker, etc.)
│   │   ├── hitl/                     # Human-in-the-loop
│   │   ├── sandbox/                  # Code execution
│   │   └── index.ts
│   │
│   ├── agents/                       # Agent runtime + multi-agent
│   │   ├── runtime/                  # Renamed from agents/ (AgentCore, factory, pool)
│   │   ├── agency/                   # Multi-agent collectives, comm bus
│   │   ├── orchestration/            # Turn planning, telemetry
│   │   ├── conversation/             # Conversation state, rolling summaries
│   │   └── index.ts
│   │
│   ├── automation/                   # Workflows (beside orchestration, not persistence)
│   │   ├── workflows/                # Workflow engine, runtime, storage
│   │   └── index.ts
│   │
│   ├── persistence/                  # Pure data concerns
│   │   ├── storage/                  # SQL adapter, in-memory
│   │   │   └── StorageWriteHooks.ts  # Extracted from AgentOS.ts
│   │   ├── knowledge/                # Knowledge graph (in-memory + Neo4j)
│   │   ├── provenance/               # Audit trail, verification, anchoring
│   │   └── index.ts
│   │
│   ├── streaming/                    # CROSS-CUTTING (not under agents/)
│   │   ├── IStreamClient.ts
│   │   ├── StreamingManager.ts
│   │   ├── AsyncStreamClientBridge.ts # Extracted from AgentOS.ts
│   │   └── index.ts
│   │
│   ├── platform/                     # Cross-cutting infrastructure
│   │   ├── audio/                    # Audio processing, VAD
│   │   ├── language/                 # Multilingual support
│   │   ├── observability/            # Tracing, OTEL + UsageLedger
│   │   ├── evaluation/               # Eval framework, LLM judge
│   │   ├── marketplace/              # Tool marketplace
│   │   └── index.ts
│   │
│   └── index.ts                      # Domain barrel re-exporting all 7 domains
│
├── discovery/                        # Unchanged
├── extensions/                       # Unchanged
├── memory/                           # Unchanged
├── rag/                              # Unchanged
├── channels/                         # Unchanged
├── voice/                            # Unchanged
├── speech/                           # Unchanged
├── skills/                           # Unchanged
├── social-posting/                   # Unchanged
├── config/                           # Unchanged
├── types/                            # Only truly shared contracts
├── utils/                            # Unchanged
├── logging/                          # Unchanged
├── services/                         # Auth service types (if present)
├── memory_lifecycle/                 # Unchanged
├── neo4j/                            # Unchanged
├── server/                           # Unchanged
├── stubs/                            # Unchanged (imported by backend for PrismaClient proxy)
├── prisma/                           # Unchanged
└── index.ts                          # Updated barrel with compat shims
```

**Note on `cognitive_substrate`**: This path has no explicit export entry in `package.json` — it resolves via the 4-segment wildcard patterns (`./*`, `./*/*`, `./*/*/*`, `./*/*/*/*`). These wildcard entries must be preserved. Consider adding explicit exports for frequently used deep paths (e.g., `./cognitive_substrate/personas/*`) to stabilize the dependency.

**Note on Pass 1 barrel names**: Pass 1 uses current directory names (e.g., `ai_utilities`). Renames (e.g., `ai-utilities`) happen in Pass 6.

### Merges (4 tiny subsystems absorbed)

| Subsystem    | Files                    | Destination                             | Reason                                   |
| ------------ | ------------------------ | --------------------------------------- | ---------------------------------------- |
| `prompting/` | 1 file (50 LOC)          | `intelligence/PromptProfileRouter.ts`   | Only file, tightly coupled to llm/       |
| `usage/`     | 1 file (UsageLedger.ts)  | `platform/observability/UsageLedger.ts` | Usage tracking is observability          |
| `workspace/` | 2 files                  | `agents/runtime/workspace/`             | Agent workspace is part of agent runtime |
| `ui/`        | 1 file (IUIComponent.ts) | Co-located with consuming module        | Pure type definition                     |

### API File Splits

#### AgentOS.ts (2190 LOC -> ~1100 LOC)

| Extracted           | New File                                        | LOC | Contents                                                                                            |
| ------------------- | ----------------------------------------------- | --- | --------------------------------------------------------------------------------------------------- |
| Error types         | `api/errors.ts`                                 | 70  | `AgentOSServiceError` class                                                                         |
| Storage hooks       | `core/persistence/storage/StorageWriteHooks.ts` | 102 | `wrapStorageAdapterWithWriteHooks()` + types                                                        |
| Stream bridge       | `core/streaming/AsyncStreamClientBridge.ts`     | 188 | `AsyncStreamClientBridge` class                                                                     |
| Workflow delegate   | `api/AgentOSWorkflows.ts`                       | 204 | 14 workflow methods as delegate class                                                               |
| Discovery bootstrap | `api/AgentOSDiscovery.ts`                       | 201 | `initializeTurnPlanner()`, `initializeCapabilityDiscoveryEngine()`, `buildCapabilityIndexSources()` |

Stays in AgentOS.ts: `constructor`, `initialize`, `validateConfiguration`, `shutdown`, `processRequest`, `handleToolResult`, `initializeRagSubsystem`, guardrail registration, utility AI, persona/conversation/feedback thin delegation.

#### AgentOSOrchestrator.ts (2861 LOC -> ~1200 LOC)

| Extracted     | New File                             | LOC  | Contents                                                                                         |
| ------------- | ------------------------------------ | ---- | ------------------------------------------------------------------------------------------------ |
| Config types  | `api/types/OrchestratorConfig.ts`    | ~350 | All config interfaces (lines 80-650)                                                             |
| Telemetry     | `api/TaskOutcomeTelemetryManager.ts` | 191  | 5 KPI methods + 4 helper functions                                                               |
| Stream chunks | `api/StreamChunkAssembler.ts`        | 218  | `pushChunkToStream`, `pushErrorChunk`, `emitExecutionLifecycleUpdate`, `broadcastWorkflowUpdate` |
| Turn phases   | `api/turn-phases/*.ts`               | ~272 | 4 phase files: rolling-summary, long-term-memory, conversation-history, prompt-profile           |

Stays in AgentOSOrchestrator.ts: `orchestrateTurn`, `_processTurnInternal` (slimmed ~600 LOC calling phase helpers), `orchestrateToolResult`, `processGMIOutput`, `transformAndPushGMIChunk`, `constructGMITurnInput`.

### Backend Integration Wiring

#### Skills into Discovery (agentos.integration.ts)

```typescript
// In buildEmbeddedAgentOSConfig(), near line 1108:
import { getCuratedSkills } from '@framers/agentos-skills-registry/catalog';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillsCatalog = getCuratedSkills();

// Resolve base dir for loading SKILL.md content (required by CapabilityIndexSources['skills'])
const skillsRegistryDir = dirname(
  fileURLToPath(import.meta.resolve('@framers/agentos-skills-registry/catalog'))
);

const skillDescriptors = skillsCatalog.map((skill) => {
  let content = skill.description; // fallback
  try {
    const mdPath = resolve(skillsRegistryDir, '..', skill.skillPath, 'SKILL.md');
    content = readFileSync(mdPath, 'utf-8');
  } catch {
    /* use description as fallback */
  }
  return {
    name: skill.name,
    description: skill.description,
    content, // required by CapabilityIndexSources['skills']
    category: skill.category,
    tags: skill.tags,
    requiredSecrets: skill.requiredSecrets,
    requiredTools: skill.requiredTools,
    sourcePath: skill.skillPath,
  };
});

// Populate discovery sources via AgentOSConfig.turnPlanning.discovery.sources.skills:
// (AgentOS.buildCapabilityIndexSources() passes config.turnPlanning.discovery.sources.skills
//  through as overrides?.skills at AgentOS.ts:1299)
turnPlanningConfig.discovery = {
  ...turnPlanningConfig.discovery,
  sources: {
    ...turnPlanningConfig.discovery?.sources,
    skills: skillDescriptors,
  },
};
```

#### Load agentos-ext-skills by Default

```typescript
// In createCuratedManifest() call, add skills to tools list:
const curatedManifest = await createCuratedManifest({
  channels: channelPlatforms?.length ? channelPlatforms : 'none',
  tools: 'all', // Already includes 'skills' tool entry
  secrets: {},
});
// Verify 'skills' tool entry exists in TOOL_CATALOG — it does at tool-registry.ts
// The ext-skills package must be in backend's dependencies
```

#### Guardrail Persistence

New tables in `appDatabase.ts`:

```sql
CREATE TABLE IF NOT EXISTS guardrail_audit_log (
  id TEXT PRIMARY KEY,
  seed_id TEXT,
  session_id TEXT,
  guardrail_id TEXT NOT NULL,
  action TEXT NOT NULL,           -- ALLOW, BLOCK, REDACT
  direction TEXT NOT NULL,        -- input, output
  trigger_reason TEXT,
  input_snippet TEXT,
  metadata TEXT,                  -- JSON
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS guardrail_review_queue (
  id TEXT PRIMARY KEY,
  audit_log_id TEXT NOT NULL REFERENCES guardrail_audit_log(id),
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, approved, rejected
  reviewer_id TEXT,
  review_notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  reviewed_at TEXT
);
```

Replace stubs in `backend/src/integrations/agentos/guardrails/GuardrailLogger.ts`:

- L283: `logGuardrailAction()` → INSERT into `guardrail_audit_log`
- L364: `submitForReview()` → INSERT into `guardrail_review_queue`

### Compatibility Strategy

The `package.json` exports map uses 4-segment deep wildcards at L122-137. Moving files before adding compat shims will break consumers.

**Strategy**: Every moved module gets a compat re-export at the old path:

```typescript
// Old path: src/core/safety/CircuitBreaker.ts (after move to core/safety/primitives/)
// Compat shim at old location:
export * from './primitives/CircuitBreaker.js';
```

The root barrel `src/index.ts` remains the primary public API and gets updated to import from new locations. Subpath imports via `@framers/agentos/core/safety/*` continue to work via compat shims.

**Build verification**: After each pass, run:

```bash
pnpm --filter @framers/agentos typecheck
pnpm --filter @framers/agentos build
pnpm --filter voice-chat-assistant-backend typecheck
```

## Implementation Sequence

### Pass 1: Stable Barrels + Compat Shims

Add `index.ts` barrel exports for domains that lack them:

- `core/conversation/index.ts`
- `core/streaming/index.ts`
- `core/orchestration/index.ts`
- `core/workflows/index.ts` (if missing)
- `core/agents/index.ts` (if missing)
- `core/ai_utilities/index.ts` (if missing)
- `core/audio/index.ts` (if missing)

Verify build passes.

### Pass 2: Wire Skills into Discovery

- Import `getCuratedSkills` from `@framers/agentos-skills-registry/catalog`
- Map skill catalog entries to `CapabilityIndexSources['skills']` shape (requires `content: string` — load from SKILL.md files on disk, fall back to `description`)
- Populate `turnPlanningConfig.discovery.sources.skills` in `buildEmbeddedAgentOSConfig()` (see corrected code sample above — `AgentOS.buildCapabilityIndexSources()` passes these through as `overrides?.skills`)
- Add `@framers/agentos-skills-registry` to backend dependencies if not present
- Verify: agents can discover skills via `discover_capabilities` tool

### Pass 3: Load agentos-ext-skills by Default

- Add `@framers/agentos-skills` to `backend/package.json` dependencies as `workspace:*` and run `pnpm install`
- Verify `skills` entry exists in `TOOL_CATALOG` (it does)
- Confirm `createCuratedManifest({ tools: 'all' })` includes the skills tool pack
- Verify: agents have `skills_list`, `skills_read`, `skills_enable` etc. available

### Pass 4: Guardrail Persistence

- Add `guardrail_audit_log` and `guardrail_review_queue` tables to `appDatabase.ts`
- Create `backend/src/integrations/agentos/guardrails/GuardrailPersistenceService.ts`
- Replace stub at `GuardrailLogger.ts:283` with INSERT into audit log
- Replace stub at `GuardrailLogger.ts:364` with INSERT into review queue
- Wire service into guardrail stack via dependency injection
- Add basic test coverage

### Pass 5: API File Splits

Behind stable barrels (no consumer-facing path changes):

1. Extract `AgentOSServiceError` → `api/errors.ts`
2. Extract `wrapStorageAdapterWithWriteHooks` → `core/persistence/storage/StorageWriteHooks.ts`
3. Extract `AsyncStreamClientBridge` → `core/streaming/AsyncStreamClientBridge.ts`
4. Extract workflow methods → `api/AgentOSWorkflows.ts` (delegate class)
5. Extract discovery methods → `api/AgentOSDiscovery.ts` (delegate class)
6. Extract config types → `api/types/OrchestratorConfig.ts`
7. Extract telemetry → `api/TaskOutcomeTelemetryManager.ts`
8. Extract chunk assembly → `api/StreamChunkAssembler.ts`
9. Extract turn phases → `api/turn-phases/{rolling-summary,long-term-memory,conversation-history,prompt-profile}.ts`

Verify build after each extraction.

### Pass 6: Domain-Clustered Folder Moves

1. Create domain directories: `core/{intelligence,safety,agents,automation,persistence,platform}/`
2. Move subsystems:
   - `llm/`, `structured/`, `ai_utilities/` → `ai-utilities/`, `planning/`, `prompting/PromptProfileRouter.ts` → `intelligence/`
   - `guardrails/`, `safety/` → `primitives/`, `hitl/`, `sandbox/` → `safety/`
   - `agents/` → `runtime/`, `agency/`, `orchestration/`, `conversation/` → `agents/`
   - `workflows/` → `automation/`
   - `storage/`, `knowledge/`, `provenance/` → `persistence/`
   - `audio/`, `language/`, `observability/` + `usage/`, `evaluation/`, `marketplace/` → `platform/`
   - `workspace/` → `agents/runtime/workspace/`
   - `ui/IUIComponent.ts` → co-locate with consumer
3. Add compat re-exports at all old paths (including `src/core/guardrails/` → `src/core/safety/guardrails/` — backend tests import guardrails via both `core/guardrails/` and `guardrails/` wildcard paths)
4. Normalize workspace/` barrel export compat shim (`src/index.ts`exports`core/workspace`which moves to`core/agents/runtime/workspace/`)
5. Update `src/index.ts` barrel
6. Update `package.json` exports map (28 explicit + 4 wildcard entries)
7. Verify full build chain: agentos → backend → rabbithole

## Design Principles

- **Delegate classes over mixins** — explicit composition, no prototype manipulation
- **One file per turn phase** — each phase independently testable
- **Co-locate types with owning module** — only truly shared contracts in `/types`
- **Compat shims at old paths** — no consumer breakage during transition
- **Build verification after every pass** — never merge a broken state
- **cognitive_substrate stays as published path** — rename requires coordinated consumer update

## Testing Strategy

- Each pass verified with `pnpm --filter @framers/agentos typecheck && build`
- Backend verified with `pnpm --filter voice-chat-assistant-backend typecheck`
- Existing test suites run after each pass (24+ backend tests, agentos unit tests)
- New tests for: guardrail persistence service, skills discovery wiring
- No new test framework dependencies

## Implementation Status (as of 2026-03-16)

### Completed

| Pass | What                                         | Result                                                                                                |
| ---- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1    | Barrel exports for 6 core subsystems         | `conversation`, `streaming`, `orchestration`, `agents`, `ai_utilities`, `audio` — all have `index.ts` |
| 2+3  | Skills wired into discovery + ext-skills dep | 28 curated skills in `CapabilityIndexSources`, 5 skill tools available to agents                      |
| 4    | Guardrail SQLite persistence                 | `logToDatabase()` and `queueForReview()` use `StorageAdapter` with auto-created tables                |
| 5    | API file splits                              | `AgentOS.ts`: 2190→1921 (-12%), `AgentOSOrchestrator.ts`: 2861→1936 (-32%)                            |
| 5    | HybridUtilityAI implemented                  | Was 0 bytes since initial import, now 169 LOC delegate                                                |
| 6    | Domain barrel                                | `core/index.ts` groups 27 subsystems into 7 domains (no file moves)                                   |

### New Modules Created (11 files, 1556 LOC)

- `api/errors.ts` — AgentOSServiceError (34 LOC)
- `api/types/OrchestratorConfig.ts` — Config interfaces (136 LOC)
- `api/TaskOutcomeTelemetryManager.ts` — KPI windows + adaptive execution (442 LOC)
- `api/StreamChunkEmitter.ts` — Chunk assembly + emission (216 LOC)
- `api/turn-phases/rolling-summary.ts` — Compaction phase (133 LOC)
- `api/turn-phases/prompt-profile.ts` — Profile routing (66 LOC)
- `api/turn-phases/long-term-memory.ts` — Memory retrieval (144 LOC)
- `api/turn-phases/conversation-history.ts` — History assembly (75 LOC)
- `core/streaming/AsyncStreamClientBridge.ts` — Push-pull adapter (137 LOC)
- `core/ai_utilities/HybridUtilityAI.ts` — LLM+statistical hybrid (169 LOC)
- `core/index.ts` — Domain barrel (72 LOC)

### Test Status

- **1769 agentos tests**: all passing (120 files, vitest) — was 1647, +122 new
- **48 backend tests**: all passing (node:test) — was 36, +12 new (GuardrailLogger persistence)
- **Zero regressions** from refactoring, zero TS errors in test files
- **New test suites**: TaskOutcomeTelemetryManager (62), StreamChunkEmitter (20), HybridUtilityAI (25), conversation-history (7), rolling-summary (11), GuardrailLogger persistence (12)

### Final File Sizes

- `AgentOS.ts`: 2190 → 1921 LOC (-12%)
- `AgentOSOrchestrator.ts`: 2861 → 1777 LOC (-38%)

### Deferred (requires further work)

- Physical file moves into domain folders — blocked by wildcard exports in `package.json`; consumers need barrel import migration first
- `AgentOSWorkflows.ts` and `AgentOSDiscovery.ts` delegate extractions from AgentOS.ts (listed in spec but not yet implemented)
- `StreamChunkAssembler` was renamed to `StreamChunkEmitter` in implementation

## Out of Scope

- WunderlandGateway bootstrap hang (requires Nest startup refactor)
- Rabbithole extensions dashboard (separate spec: `2026-03-15-rabbithole-extensions-dashboard-design.md`)
- `agentos-ext-cognitive-memory` package completion (built-in pack is sufficient)
- SECRET_ENV_MAP expansion (already complete at 37/37)
- Rolling memory sink changes (renders heading, not user-facing leak)
