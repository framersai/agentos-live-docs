# AgentOS Core Reorganization — Implementation Guide

Complete record of all changes made on 2026-03-15/16 for verification.

---

## Overview

Reorganized `packages/agentos/src/` for readability, wired missing integrations, split oversized files, added 134 new tests, removed dead code. Zero regressions across 1817 total tests.

---

## 1. Integration Wiring

### 1.1 Skills Wired into Discovery Sources

**File changed**: `backend/src/integrations/agentos/agentos.integration.ts`

**What**: Added import of `getCuratedSkills` from `@framers/agentos-skills-registry/catalog`. In `buildEmbeddedAgentOSConfig()`, after the discovery config block (~line 1143), loads all 28 curated skills, reads their SKILL.md content from disk, maps them to `CapabilityIndexSources['skills']` shape (with required `content`, `name`, `description`, `category`, `tags`, `requiredSecrets`, `requiredTools`, `sourcePath` fields), and populates `turnPlanningConfig.discovery.sources.skills`. Auto-enables discovery when skills are available.

**Why**: `AgentOS.buildCapabilityIndexSources()` at `AgentOS.ts:1299` passes `overrides?.skills` through, but the backend never populated that source. Agents couldn't discover skills via the `discover_capabilities` meta-tool.

**Verify**:

```bash
grep -n "getCuratedSkills" backend/src/integrations/agentos/agentos.integration.ts
grep -n "sources.*skills" backend/src/integrations/agentos/agentos.integration.ts
```

### 1.2 agentos-ext-skills Added to Backend

**File changed**: `backend/package.json`

**What**: Added `"@framers/agentos-skills": "workspace:*"` to dependencies. The `skills` entry already exists in `TOOL_CATALOG` at `packages/agentos-extensions-registry/src/tool-registry.ts`, so `createCuratedManifest({ tools: 'all' })` now loads the skills extension pack, giving agents access to `skills_list`, `skills_read`, `skills_enable`, `skills_status`, `skills_install` tools.

**Verify**:

```bash
grep "agentos-ext-skills" backend/package.json
```

### 1.3 Guardrail SQLite Persistence

**File changed**: `backend/src/integrations/agentos/guardrails/GuardrailLogger.ts`

**What**:

- Added `StorageAdapter` import from `@framers/sql-storage-adapter`
- Replaced `databaseUrl?: string` config with `storageAdapter?: StorageAdapter`
- Added `ensureTables()` method that creates `guardrail_audit_log` and `guardrail_review_queue` tables on first use
- Replaced `logToDatabase()` stub (was `console.debug('not implemented')`) with real INSERT into `guardrail_audit_log` with 13 columns (id, seed_id, session_id, guardrail_id, stage, action, severity, trigger_reason, reason_code, input_snippet, modified_snippet, metadata as JSON, escalated)
- Replaced `queueForReview()` stub (was `console.log`) with real INSERT into `guardrail_review_queue` (id, audit_log_id, status='pending')
- Both methods handle errors gracefully (catch + console.error, no throw)

**Verify**:

```bash
grep -n "guardrail_audit_log\|guardrail_review_queue\|storageAdapter" backend/src/integrations/agentos/guardrails/GuardrailLogger.ts
```

---

## 2. Barrel Exports (6 new index.ts files)

**Files created** (all in `packages/agentos/src/core/`):

- `conversation/index.ts` — exports ConversationContext, ConversationManager, ConversationMessage, ILongTermMemoryRetriever, IRollingSummaryMemorySink, LongTermMemoryPolicy, RollingSummaryCompactor
- `streaming/index.ts` — exports IStreamClient, StreamingManager, AsyncStreamClientBridge
- `orchestration/index.ts` — exports IAgentOrchestrator, AgentOrchestrator, TurnPlanner, SqlTaskOutcomeTelemetryStore, helpers
- `agents/index.ts` — exports IAgent, IAgentFactory, AgentCore, AgentFactory, AgentPoolAgent, AgentPoolConfig
- `ai_utilities/index.ts` — exports IUtilityAI, LLMUtilityAI, StatisticalUtilityAI, HybridUtilityAI
- `audio/index.ts` — exports AdaptiveVAD, AudioProcessor, EnvironmentalCalibrator, SilenceDetector

**Why**: 12 of 27 core subsystems lacked barrel exports. These stabilize import paths before any future domain restructuring.

**Verify**:

```bash
for d in conversation streaming orchestration agents ai_utilities audio; do
  echo "=== $d ===" && cat packages/agentos/src/core/$d/index.ts
done
```

---

## 3. Domain Barrel

**File created**: `packages/agentos/src/core/index.ts` (72 LOC)

**What**: Groups all 27 core subsystems into 7 navigable domains via section comments and re-exports:

- **INTELLIGENCE**: llm, structured, ai_utilities, planning, prompting
- **SAFETY**: guardrails, safety (primitives), hitl, sandbox
- **AGENTS**: agents, agency, orchestration, conversation, streaming
- **TOOLS**: tools
- **AUTOMATION**: workflows
- **PERSISTENCE**: storage, knowledge, provenance
- **PLATFORM**: audio, language, observability, evaluation, marketplace, workspace

**Why**: The flat 27-subsystem structure was hard to navigate. This provides domain-level grouping without moving files (which would break wildcard exports in `package.json`).

**Verify**:

```bash
head -20 packages/agentos/src/core/index.ts
```

---

## 4. API File Splits

### 4.1 From AgentOS.ts (2190 → 1921 LOC, -12%)

| Extracted                       | New File                                        | LOC |
| ------------------------------- | ----------------------------------------------- | --- |
| `AgentOSServiceError` class     | `src/api/errors.ts`                             | 34  |
| `AsyncStreamClientBridge` class | `src/core/streaming/AsyncStreamClientBridge.ts` | 137 |

**AgentOS.ts changes**:

- Line ~253: Replaced 70-line class with `import { AgentOSServiceError } from './errors'` + re-export
- Line ~1918: Replaced 188-line class with `import { AsyncStreamClientBridge } from '../core/streaming/AsyncStreamClientBridge'`

### 4.2 From AgentOSOrchestrator.ts (2861 → 1777 LOC, -38%)

| Extracted                                 | New File                                      | LOC |
| ----------------------------------------- | --------------------------------------------- | --- |
| Config types (11 interfaces)              | `src/api/types/OrchestratorConfig.ts`         | 136 |
| Telemetry manager (5 methods + 4 helpers) | `src/api/TaskOutcomeTelemetryManager.ts`      | 442 |
| Chunk emission (3 methods)                | `src/api/StreamChunkEmitter.ts`               | 216 |
| Rolling summary phase                     | `src/api/turn-phases/rolling-summary.ts`      | 133 |
| Prompt profile phase                      | `src/api/turn-phases/prompt-profile.ts`       | 66  |
| Long-term memory phase                    | `src/api/turn-phases/long-term-memory.ts`     | 144 |
| Conversation history phase                | `src/api/turn-phases/conversation-history.ts` | 75  |

**AgentOSOrchestrator.ts changes**:

- Lines 80-710: Config type definitions replaced with `export type {...} from './types/OrchestratorConfig'` + necessary `import type {...}`
- Class property: `taskOutcomeKpiWindows` + `taskOutcomeAlertState` Maps replaced with `private telemetry!: TaskOutcomeTelemetryManager`
- Class property: added `private chunks!: StreamChunkEmitter`
- `initialize()`: Creates `TaskOutcomeTelemetryManager` and `StreamChunkEmitter` delegates, calls `telemetry.loadPersistedWindows()`
- All `this.pushChunkToStream(` → `this.chunks.pushChunk(`
- All `this.pushErrorChunk(` → `this.chunks.pushError(`
- All `this.emitExecutionLifecycleUpdate(` → `this.chunks.emitLifecycleUpdate(`
- All `this.updateTaskOutcomeKpi(` → `this.telemetry.updateKpi(`
- All `this.maybeApplyAdaptiveExecutionPolicy(` → `this.telemetry.maybeApplyAdaptivePolicy(`
- All `this.maybeBuildTaskOutcomeAlert(` → `this.telemetry.maybeBuildAlert(`
- `evaluateTaskOutcome()` local function removed, imported from `TaskOutcomeTelemetryManager`
- Rolling summary block (~90 LOC) replaced with `executeRollingSummaryPhase()` call
- Prompt profile block (~44 LOC) replaced with `executePromptProfilePhase()` call
- Long-term memory block (~96 LOC) replaced with `executeLongTermMemoryPhase()` call
- Conversation history block (~48 LOC) replaced with `assembleConversationHistory()` call
- Dead functions removed: `normalizeMode`, `pickByMode`, `normalizeTaskOutcomeOverride`, `normalizeRequestedToolFailureMode`
- `shutdown()`: `this.taskOutcomeKpiWindows.clear()` → `this.telemetry?.kpiWindows.clear()`

**Verify**:

```bash
wc -l packages/agentos/src/api/AgentOS.ts packages/agentos/src/api/AgentOSOrchestrator.ts
# Expected: ~1921 and ~1777
ls packages/agentos/src/api/errors.ts packages/agentos/src/api/types/OrchestratorConfig.ts packages/agentos/src/api/TaskOutcomeTelemetryManager.ts packages/agentos/src/api/StreamChunkEmitter.ts packages/agentos/src/api/turn-phases/*.ts packages/agentos/src/core/streaming/AsyncStreamClientBridge.ts
```

---

## 5. HybridUtilityAI Implementation

**File changed**: `packages/agentos/src/core/ai_utilities/HybridUtilityAI.ts`

**What**: Was 0 bytes since initial import. Now 169 LOC implementing the `IUtilityAI` interface. Delegates to LLM-based or statistical implementations based on task type:

- LLM-preferred: `summarize`, `classifyText`, `extractKeywords`
- Statistical-preferred: `tokenize`, `stemTokens`, `normalizeText`, `generateNGrams`, `calculateReadability`, `calculateSimilarity`, `analyzeSentiment`, `detectLanguage`
- Two-phase: `parseJsonSafe` (try stat first, fall back to LLM repair)
- `checkHealth` aggregates both backends, `shutdown` calls both

**Verify**:

```bash
wc -l packages/agentos/src/core/ai_utilities/HybridUtilityAI.ts
# Expected: 169 (not 0)
```

---

## 6. New Tests (134 total)

### 6.1 Agentos Tests (+122, vitest)

| File                                                         | Tests | Coverage                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/api/__tests__/TaskOutcomeTelemetryManager.test.ts`      | 62    | evaluateTaskOutcome heuristics, customFlags overrides (bool/num/string), sanitizeKpiEntry validation, config resolution defaults+overrides, KPI window management, rolling cap, adaptive execution policy, alert generation with cooldown                                                                                   |
| `src/api/__tests__/StreamChunkEmitter.test.ts`               | 20    | All 9 chunk types (TEXT_DELTA, ERROR, FINAL_RESPONSE, SYSTEM_PROGRESS, TOOL_CALL_REQUEST, TOOL_RESULT_EMISSION, UI_COMMAND, WORKFLOW_UPDATE, METADATA_UPDATE), unknown type fallback, language negotiation metadata, trace metadata for specific types, pushError convenience, emitLifecycleUpdate, graceful error handling |
| `src/core/ai_utilities/tests/HybridUtilityAI.test.ts`        | 25    | Constructor validation, LLM-preferred delegation, stat-preferred delegation, fallback when one backend missing, parseJsonSafe two-phase, checkHealth aggregation, shutdown                                                                                                                                                  |
| `src/api/turn-phases/__tests__/conversation-history.test.ts` | 7     | null context, role filtering, user message dedup, rolling summary trimming with head+tail, cross-set dedup                                                                                                                                                                                                                  |
| `src/api/turn-phases/__tests__/rolling-summary.test.ts`      | 11    | Disabled config, profile selection by mode, compaction success, metadata persistence, error handling, edge cases                                                                                                                                                                                                            |

### 6.2 Backend Tests (+12, node:test)

| File                                                                                | Tests | Coverage                                                                                                                                                                                                |
| ----------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/integrations/agentos/guardrails/__tests__/GuardrailLogger.persistence.spec.ts` | 12    | Table creation, BLOCK/SANITIZE/ALLOW persistence, metadata JSON serialization, review queue escalation, content truncation (500 chars), graceful error handling, no-adapter fallback, getStats accuracy |

**Verify**:

```bash
cd packages/agentos && npx vitest run --reporter=dot 2>&1 | tail -5
# Expected: 1769 passed (120 files)

cd ../../backend && node --test --import tsx src/integrations/agentos/guardrails/__tests__/GuardrailLogger.persistence.spec.ts 2>&1 | tail -5
# Expected: 12 pass, 0 fail
```

---

## 7. Dead Code Removed

From `AgentOSOrchestrator.ts`, removed functions that were duplicated in delegate modules:

| Function                              | Was at line | Now lives in                                                    |
| ------------------------------------- | ----------- | --------------------------------------------------------------- |
| `normalizeMode()`                     | 166         | `turn-phases/rolling-summary.ts` (as `pickByMode` internal)     |
| `pickByMode()`                        | 170         | `turn-phases/rolling-summary.ts`                                |
| `normalizeTaskOutcomeOverride()`      | 212         | `TaskOutcomeTelemetryManager.ts`                                |
| `normalizeRequestedToolFailureMode()` | 287         | `TaskOutcomeTelemetryManager.ts`                                |
| `evaluateTaskOutcome()`               | 361         | `TaskOutcomeTelemetryManager.ts` (imported)                     |
| `resolveTaskOutcomeTelemetryConfig()` | 419         | `TaskOutcomeTelemetryManager.ts` (imported)                     |
| `resolveAdaptiveExecutionConfig()`    | 440         | `TaskOutcomeTelemetryManager.ts` (imported)                     |
| `sanitizeKpiEntry()`                  | 455         | `TaskOutcomeTelemetryManager.ts` (imported)                     |
| Duplicate `import type {...}` block   | 113-126     | Redundant — `export type` already makes types locally available |

---

## 8. Docs Updated

### 8.1 Design Spec

**File**: `docs/superpowers/specs/2026-03-15-agentos-core-reorg-design.md`

Added "Implementation Status" section with: completed passes table, new modules list (11 files, LOC), test status (1769+48), final file sizes (AgentOS.ts -12%, AgentOSOrchestrator.ts -38%), deferred items (physical file moves, AgentOSWorkflows.ts, AgentOSDiscovery.ts).

### 8.2 Deep Dive Doc

**File**: `AGENTOS_IMPLEMENTATION_DEEP_DIVE.md`

Updated `AsyncStreamClientBridge` path reference from `AgentOS.ts:1338-1539` to `core/streaming/AsyncStreamClientBridge.ts`.

---

## 9. What Was NOT Changed

- **No files moved between directories** — all subsystems stay at their current paths. Domain grouping is via barrel re-exports only.
- **No external API changes** — all `@framers/agentos` exports remain accessible at the same paths via wildcard exports in `package.json`
- **`cognitive_substrate/`** — kept as published path, no rename
- **`SECRET_ENV_MAP`** — already complete (37/37), no changes needed
- **Rolling memory sink** — renders a TODO section heading (not user-facing), no changes needed
- **`agentos-ext-cognitive-memory`** — empty package is non-blocking (built-in pack at `tool-registry.ts:53`)
- **WunderlandGateway** — disabled by design (Socket.IO hangs Nest startup)
- **`AgentOSWorkflows.ts`** — workflow delegate extraction deferred
- **`AgentOSDiscovery.ts`** — discovery bootstrap extraction deferred

---

## 10. Build Verification Commands

```bash
# Agentos package build
pnpm --filter @framers/agentos build
# Expected: "Processed 330 files"

# Backend typecheck
cd backend && npx tsc --noEmit --project tsconfig.build.json
# Expected: no output (clean)

# Agentos full test suite
cd packages/agentos && npx vitest run --reporter=dot
# Expected: 1769 passed (120 files)

# Backend tests (original + new guardrail persistence)
cd backend && node --test --import tsx \
  src/__tests__/guardrails.service.test.ts \
  src/__tests__/extensions.service.test.ts \
  src/__tests__/common.infrastructure.test.ts \
  src/__tests__/appDatabase.test.ts \
  src/integrations/agentos/guardrails/__tests__/GuardrailLogger.persistence.spec.ts
# Expected: 48 pass, 0 fail

# Empty files check
find packages/agentos/src -name "*.ts" -size 0
# Expected: no output

# Test TS errors check
cd packages/agentos && npx tsc --noEmit 2>&1 | grep "error TS" | grep -E "test\.ts|spec\.ts"
# Expected: no output
```

---

## 11. Commit History

### Parent repo (14 commits)

```
98a9f9cb chore: final audit fixes — dead code removal, test types, spec update
28f6cbd5 test: add 12 GuardrailLogger persistence tests
dad9f01e docs: update spec + deep dive with implementation results
393913c3 chore: update submodule + docs with 122 new tests
a293264c chore: update agentos submodule — StreamChunkEmitter extraction
59a828e8 chore: update agentos submodule — telemetry delegate wired in
8d1bd09d chore: update agentos submodule — domain barrel, HybridUtilityAI
4c77e5eb chore: update agentos submodule — barrel exports + file splits
5eb135db feat: implement guardrail SQLite persistence
5eb1d686 feat: wire curated skills into discovery + add ext-skills dep
8fa4225b docs: fix spec review issues in agentos reorg design
d5aab92a docs: add agentos core reorganization design spec
```

### Agentos submodule (12 commits)

```
f966c76a refactor: remove dead code from AgentOSOrchestrator
9e038bc0 fix: correct test type mismatches against actual interfaces
0023ce09 test: add 122 tests for extracted modules
006934c4 refactor: extract 4 turn-phase helpers + wire StreamChunkEmitter
d80bd95b refactor: wire TaskOutcomeTelemetryManager into orchestrator
a9b64448 refactor: extract StreamChunkEmitter delegate from orchestrator
42b819cc feat: add domain-organized barrel for core subsystems
c3ad19ef refactor: extract orchestrator config types to OrchestratorConfig.ts
189f090d feat: implement HybridUtilityAI (was empty placeholder)
8764f531 refactor: extract AgentOSServiceError and AsyncStreamClientBridge
7dee359a feat: extract TaskOutcomeTelemetryManager delegate class
60757217 feat: add barrel exports for 6 core subsystems
```
