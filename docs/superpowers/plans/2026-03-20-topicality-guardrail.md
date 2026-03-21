# Topicality Guardrail Extension Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an embedding-based topicality guardrail with allowed/forbidden topic enforcement, session-aware drift detection via EMA, structured topic descriptors with preset libraries, and a shared `cosineSimilarity` utility.

**Architecture:** `TopicEmbeddingIndex` pre-computes centroid vectors for topic descriptors. `TopicDriftTracker` maintains per-session EMA of message embeddings. `TopicalityGuardrail` implements `IGuardrailService` combining both for input evaluation. Injectable `embeddingFn` for testability. All in a self-contained extension pack.

**Tech Stack:** TypeScript, vitest, `cosineSimilarity` from shared utils, `EmbeddingManager` via `ISharedServiceRegistry`

**Spec:** `docs/superpowers/specs/2026-03-20-topicality-guardrail-design.md`

---

## File Map

Shared utility (modified):

| File                                                   | Change | Purpose                         |
| ------------------------------------------------------ | ------ | ------------------------------- |
| `packages/agentos/src/core/utils/text-utils.ts`        | Modify | Add `cosineSimilarity` function |
| `packages/agentos/tests/core/utils/text-utils.spec.ts` | Modify | Add cosine similarity tests     |

Topicality pack (all new) under `packages/agentos/src/extensions/packs/topicality/`:

| File                      | Purpose                                                                                                                                       |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `types.ts`                | `TopicDescriptor`, `TopicMatch`, `DriftConfig`, `DriftResult`, `TopicState`, `TopicalityPackOptions`, `DEFAULT_DRIFT_CONFIG`, `TOPIC_PRESETS` |
| `TopicEmbeddingIndex.ts`  | Centroid embedding index — build, match, matchByVector, isOnTopic, isOnTopicByVector                                                          |
| `TopicDriftTracker.ts`    | Per-session EMA drift detection — update, pruneStale, clear                                                                                   |
| `TopicalityGuardrail.ts`  | `IGuardrailService` impl — forbidden check → allowed check → drift check                                                                      |
| `tools/CheckTopicTool.ts` | `ITool` for on-demand topic matching                                                                                                          |
| `index.ts`                | `createTopicalityPack()` factory + `createExtensionPack()` bridge                                                                             |
| `topicality.skill.md`     | SKILL.md for agent awareness                                                                                                                  |

Tests under `packages/agentos/tests/extensions/packs/topicality/`:

| Test File                     | Covers                                                                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| `TopicEmbeddingIndex.spec.ts` | Build, match, matchByVector, isOnTopic, empty topics                                     |
| `TopicDriftTracker.spec.ts`   | EMA update, drift streak, streak limit, session cleanup, concurrent sessions             |
| `TopicalityGuardrail.spec.ts` | Forbidden → BLOCK, off-topic → FLAG, on-topic → null, drift, scope, graceful degradation |
| `CheckTopicTool.spec.ts`      | Tool schema, execute, topic matches                                                      |
| `index.spec.ts`               | Pack factory, descriptors, presets, createExtensionPack bridge                           |

---

## Task 1: Add cosineSimilarity to shared utils

**Files:**

- Modify: `packages/agentos/src/core/utils/text-utils.ts`
- Modify: `packages/agentos/tests/core/utils/text-utils.spec.ts`

- [ ] **Step 1: Add tests for cosineSimilarity**

Add to the existing `text-utils.spec.ts`:

```typescript
describe('cosineSimilarity', () => {
  it('returns 1.0 for identical vectors', () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBeCloseTo(1.0);
  });
  it('returns 0 for orthogonal vectors', () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });
  it('returns -1.0 for opposite vectors', () => {
    expect(cosineSimilarity([1, 0], [-1, 0])).toBeCloseTo(-1.0);
  });
  it('returns 0 for different dimensions', () => {
    expect(cosineSimilarity([1, 2], [1, 2, 3])).toBe(0);
  });
  it('returns 0 for empty vectors', () => {
    expect(cosineSimilarity([], [])).toBe(0);
  });
  it('returns 0 for zero vector', () => {
    expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
  });
  it('handles non-unit vectors correctly', () => {
    expect(cosineSimilarity([2, 0], [4, 0])).toBeCloseTo(1.0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && pnpm vitest run tests/core/utils/text-utils.spec.ts
```

- [ ] **Step 3: Add cosineSimilarity to text-utils.ts**

Add after the existing `estimateTokens` function:

```typescript
/**
 * Compute cosine similarity between two numeric vectors.
 * Returns -1.0 (opposite) to 1.0 (identical). Returns 0 for mismatched dimensions or empty/zero vectors.
 * Consolidates 6+ duplicate implementations across the codebase.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0,
    normA = 0,
    normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && pnpm vitest run tests/core/utils/text-utils.spec.ts
```

- [ ] **Step 5: Commit and push**

```bash
cd packages/agentos
git add src/core/utils/text-utils.ts tests/core/utils/text-utils.spec.ts
git commit -m "feat: add cosineSimilarity to shared text-utils (consolidates 6+ copies)"
git push origin master
```

---

## Task 2: Core types + presets

**Files:**

- Create: `packages/agentos/src/extensions/packs/topicality/types.ts`

- [ ] **Step 1: Create directories**

```bash
cd packages/agentos
mkdir -p src/extensions/packs/topicality/tools
mkdir -p tests/extensions/packs/topicality
```

- [ ] **Step 2: Write types.ts**

Create `src/extensions/packs/topicality/types.ts` with ALL types from the spec:

- `TopicDescriptor` interface (id, name, description, examples)
- `TopicMatch` interface (topicId, topicName, similarity — clamped to 0-1)
- `DriftConfig` interface (alpha, driftThreshold, driftStreakLimit, sessionTimeoutMs, maxSessions)
- `DEFAULT_DRIFT_CONFIG` const
- `DriftResult` interface (onTopic, currentSimilarity, nearestTopic, driftStreak, driftLimitExceeded)
- `TopicState` interface (runningEmbedding, messageCount, lastTopicScore, driftStreak, lastSeenAt)
- `TopicalityPackOptions` interface (allowedTopics, forbiddenTopics, allowedThreshold, forbiddenThreshold, offTopicAction, forbiddenAction, enableDriftDetection, drift, embeddingFn, guardrailScope)
- `TOPIC_PRESETS` const (customerSupport, codingAssistant, commonUnsafe — from spec Section 2)

Full TSDoc on every type, property, and constant.

- [ ] **Step 3: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/topicality/types.ts
git commit -m "feat(topicality): add core types, TopicDescriptor, DriftConfig, and TOPIC_PRESETS"
git push origin master
```

---

## Task 3: TopicEmbeddingIndex

**Files:**

- Create: `packages/agentos/src/extensions/packs/topicality/TopicEmbeddingIndex.ts`
- Create: `packages/agentos/tests/extensions/packs/topicality/TopicEmbeddingIndex.spec.ts`

- [ ] **Step 1: Write the failing test**

Use a mock embedding function that returns deterministic vectors:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { TopicEmbeddingIndex } from '../../../../src/extensions/packs/topicality/TopicEmbeddingIndex';
import type { TopicDescriptor } from '../../../../src/extensions/packs/topicality/types';

/** Mock embedding: returns a simple vector based on text length */
const mockEmbeddingFn = vi.fn(async (texts: string[]) =>
  texts.map((t) => {
    // Deterministic: text "billing" → [1, 0, 0], "tech" → [0, 1, 0], etc.
    const hash = t.length % 3;
    return hash === 0 ? [1, 0, 0] : hash === 1 ? [0, 1, 0] : [0, 0, 1];
  })
);

const topics: TopicDescriptor[] = [
  {
    id: 'billing',
    name: 'Billing',
    description: 'Payment questions',
    examples: ['refund', 'charge'],
  },
  { id: 'tech', name: 'Tech Support', description: 'Technical help', examples: ['bug', 'error'] },
];

describe('TopicEmbeddingIndex', () => {
  it('isBuilt is false before build()', () => {
    const index = new TopicEmbeddingIndex(mockEmbeddingFn);
    expect(index.isBuilt).toBe(false);
  });

  it('isBuilt is true after build()', async () => {
    const index = new TopicEmbeddingIndex(mockEmbeddingFn);
    await index.build(topics);
    expect(index.isBuilt).toBe(true);
  });

  it('match() returns sorted results', async () => {
    const index = new TopicEmbeddingIndex(mockEmbeddingFn);
    await index.build(topics);
    const matches = await index.match('test query');
    expect(matches.length).toBe(2);
    expect(matches[0].similarity).toBeGreaterThanOrEqual(matches[1].similarity);
  });

  it('matchByVector() works without embedding call', async () => {
    const index = new TopicEmbeddingIndex(mockEmbeddingFn);
    await index.build(topics);
    const callsBefore = mockEmbeddingFn.mock.calls.length;
    const matches = index.matchByVector([1, 0, 0]);
    expect(mockEmbeddingFn.mock.calls.length).toBe(callsBefore); // no new calls
    expect(matches.length).toBe(2);
  });

  it('isOnTopic() returns true when above threshold', async () => {
    const index = new TopicEmbeddingIndex(mockEmbeddingFn);
    await index.build(topics);
    const result = await index.isOnTopic('test', 0.1);
    expect(result.onTopic).toBe(true);
    expect(result.nearestTopic).not.toBeNull();
  });

  it('isOnTopicByVector() with high threshold returns false', async () => {
    const index = new TopicEmbeddingIndex(mockEmbeddingFn);
    await index.build(topics);
    const result = index.isOnTopicByVector([0.1, 0.1, 0.1], 0.99);
    // Vector [0.1,0.1,0.1] is equidistant from all centroids
    // Similarity will be well below 0.99
    expect(result.onTopic).toBe(false);
  });

  it('handles empty topics', async () => {
    const index = new TopicEmbeddingIndex(mockEmbeddingFn);
    await index.build([]);
    const matches = await index.match('test');
    expect(matches).toHaveLength(0);
  });

  it('similarity is clamped to 0-1', async () => {
    const index = new TopicEmbeddingIndex(mockEmbeddingFn);
    await index.build(topics);
    const matches = index.matchByVector([-1, 0, 0]); // opposite direction
    for (const m of matches) {
      expect(m.similarity).toBeGreaterThanOrEqual(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/topicality/TopicEmbeddingIndex.spec.ts
```

- [ ] **Step 3: Write TopicEmbeddingIndex**

Create `src/extensions/packs/topicality/TopicEmbeddingIndex.ts`:

Key implementation:

- `build(topics)`: collect all texts `[desc, ...examples]` for all topics into one flat array, call `embeddingFn` once (batched), then split results per topic and compute centroids (component-wise average)
- `matchByVector(embedding)`: compare against all centroids via `cosineSimilarity` from `core/utils/text-utils`, clamp to `Math.max(0, ...)`, sort descending
- `match(text)`: embed text first via `embeddingFn([text])`, then call `matchByVector`
- `isOnTopicByVector(embedding, threshold)`: call `matchByVector`, check if any similarity > threshold
- `isOnTopic(text, threshold)`: embed + `isOnTopicByVector`

Import `cosineSimilarity` from `../../../core/utils/text-utils`.
Import `TopicDescriptor`, `TopicMatch` from `./types`.

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/topicality/TopicEmbeddingIndex.spec.ts
```

- [ ] **Step 5: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/topicality/TopicEmbeddingIndex.ts tests/extensions/packs/topicality/TopicEmbeddingIndex.spec.ts
git commit -m "feat(topicality): add TopicEmbeddingIndex with centroid embedding and matchByVector"
git push origin master
```

---

## Task 4: TopicDriftTracker

**Files:**

- Create: `packages/agentos/src/extensions/packs/topicality/TopicDriftTracker.ts`
- Create: `packages/agentos/tests/extensions/packs/topicality/TopicDriftTracker.spec.ts`

- [ ] **Step 1: Write the failing test**

Test cases:

- First message sets running embedding (no drift)
- EMA updates correctly (alpha weighting)
- Drift streak increments when below threshold
- Drift streak resets when on-topic
- driftLimitExceeded triggers at streak limit
- Multiple concurrent sessions tracked independently
- pruneStale removes expired sessions
- clear removes all sessions
- Respects maxSessions (prunes when exceeded)

Use a mock `TopicEmbeddingIndex` with a `matchByVector` that returns configurable similarity.

- [ ] **Step 2: Run test to verify it fails**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/topicality/TopicDriftTracker.spec.ts
```

- [ ] **Step 3: Write TopicDriftTracker**

Key implementation:

- `Map<string, TopicState>` keyed by sessionId
- `update(sessionId, messageEmbedding, allowedIndex)`:
  - Get or create session state
  - First message: `runningEmbedding = messageEmbedding`
  - Subsequent: EMA formula `running[i] = alpha * message[i] + (1-alpha) * running[i]`
  - Call `allowedIndex.isOnTopicByVector(runningEmbedding, driftThreshold)`
  - If on-topic: reset driftStreak to 0
  - If drifting: increment driftStreak
  - `driftLimitExceeded = driftStreak >= driftStreakLimit`
  - Update `lastSeenAt`
  - If map.size > maxSessions: call `pruneStale()`
- `pruneStale()`: delete entries where `now - lastSeenAt > sessionTimeoutMs`
- `clear()`: clear map

- [ ] **Step 4: Run test to verify it passes**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/topicality/TopicDriftTracker.spec.ts
```

- [ ] **Step 5: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/topicality/TopicDriftTracker.ts tests/extensions/packs/topicality/TopicDriftTracker.spec.ts
git commit -m "feat(topicality): add TopicDriftTracker with EMA drift detection"
git push origin master
```

---

## Task 5: TopicalityGuardrail

**Files:**

- Create: `packages/agentos/src/extensions/packs/topicality/TopicalityGuardrail.ts`
- Create: `packages/agentos/tests/extensions/packs/topicality/TopicalityGuardrail.spec.ts`

- [ ] **Step 1: Write the failing test**

Test cases:

- Forbidden topic match → BLOCK with reasonCode 'TOPICALITY_FORBIDDEN'
- Off-topic message → FLAG with reasonCode 'TOPICALITY_OFF_TOPIC'
- On-topic message → null (pass)
- Drift detection triggers → FLAG with reasonCode 'TOPICALITY_DRIFT'
- guardrailScope: 'output' makes evaluateInput return null
- No topics configured → returns null (no-op)
- Embedding failure → fail-open (returns null, logs warning)
- Builds topic index lazily on first call
- Metadata includes matchedTopic/nearestTopic with similarity scores

Use mock embeddingFn and mock ISharedServiceRegistry.

- [ ] **Step 2: Run test to verify it fails**

- [ ] **Step 3: Write TopicalityGuardrail**

Key implementation:

- Constructor takes `(services, options, embeddingFn?)`
- `config = { evaluateStreamingChunks: false, canSanitize: false }`
- Creates `TopicEmbeddingIndex` for allowed topics and one for forbidden topics
- Creates `TopicDriftTracker` if `enableDriftDetection !== false`
- `evaluateInput(payload)`:
  1. If scope is 'output', return null
  2. Get text from `payload.input.textInput`, if empty return null
  3. Lazy build indices on first call
  4. Embed text ONCE: `const [embedding] = await embeddingFn([text])`
  5. Check forbidden: `forbiddenIndex.matchByVector(embedding)` → if any > forbiddenThreshold → return BLOCK/FLAG
  6. Check allowed: `allowedIndex.isOnTopicByVector(embedding, allowedThreshold)` → if off-topic → return BLOCK/FLAG
  7. Check drift: `driftTracker.update(sessionId, embedding, allowedIndex)` → if driftLimitExceeded → return BLOCK/FLAG
  8. Return null (pass)

Import `GuardrailAction` from `../../../core/guardrails/IGuardrailService`.

- [ ] **Step 4: Run test to verify it passes**

- [ ] **Step 5: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/topicality/TopicalityGuardrail.ts tests/extensions/packs/topicality/TopicalityGuardrail.spec.ts
git commit -m "feat(topicality): add TopicalityGuardrail with forbidden/allowed/drift detection"
git push origin master
```

---

## Task 6: CheckTopicTool + Pack factory

**Files:**

- Create: `packages/agentos/src/extensions/packs/topicality/tools/CheckTopicTool.ts`
- Create: `packages/agentos/src/extensions/packs/topicality/index.ts`
- Create: `packages/agentos/tests/extensions/packs/topicality/CheckTopicTool.spec.ts`
- Create: `packages/agentos/tests/extensions/packs/topicality/index.spec.ts`

- [ ] **Step 1: Write CheckTopicTool**

Implements `ITool` with:

- `id = 'check_topic'`, `name = 'check_topic'`, `category = 'security'`, `hasSideEffects = false`
- `inputSchema` with `text` (required string)
- `execute()` embeds text, checks against both indices, returns topic matches

- [ ] **Step 2: Write index.ts pack factory**

Follow the exact pattern from PII/ML classifier packs:

- Mutable `state = { services }` pattern
- `buildComponents()` function that creates guardrail + tool
- `resolveEmbeddingFn()` — use `options.embeddingFn` if provided, otherwise resolve from `ISharedServiceRegistry`
- `onActivate` upgrades services and rebuilds
- `onDeactivate` clears drift tracker
- `get descriptors()` getter returns guardrail (priority 3) + tool
- `createExtensionPack(context)` bridge
- `export * from './types'`

- [ ] **Step 3: Write tests for both**

CheckTopicTool tests: tool properties, execute returns topic matches.
index.spec.ts tests: pack name/version, 2 descriptors (guardrail + tool), descriptor IDs, createExtensionPack bridge, preset loading.

- [ ] **Step 4: Run all topicality tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/topicality/
```

- [ ] **Step 5: Commit and push**

```bash
cd packages/agentos
git add src/extensions/packs/topicality/tools/ src/extensions/packs/topicality/index.ts tests/extensions/packs/topicality/CheckTopicTool.spec.ts tests/extensions/packs/topicality/index.spec.ts
git commit -m "feat(topicality): add CheckTopicTool and createTopicalityPack factory"
git push origin master
```

---

## Task 7: Barrel export + package.json + SKILL.md + registry

**Files:**

- Modify: `packages/agentos/src/extensions/index.ts`
- Modify: `packages/agentos/package.json`
- Create: `packages/agentos-skills-registry/registry/curated/topicality/SKILL.md`
- Modify: `packages/agentos-extensions-registry/src/tool-registry.ts`

- [ ] **Step 1: Add barrel export in agentos submodule**

In `src/extensions/index.ts`, add:

```typescript
export {
  createTopicalityPack,
  createExtensionPack as createTopicalityExtensionPack,
} from './packs/topicality';
```

- [ ] **Step 2: Add package.json exports entry**

In `package.json`, add:

```json
"./extensions/packs/topicality": {
  "import": "./dist/extensions/packs/topicality/index.js",
  "default": "./dist/extensions/packs/topicality/index.js",
  "types": "./dist/extensions/packs/topicality/index.d.ts"
}
```

- [ ] **Step 3: Commit and push agentos submodule**

```bash
cd packages/agentos
git add src/extensions/index.ts package.json
git commit -m "feat(topicality): add barrel export + package.json exports path"
git push origin master
```

- [ ] **Step 4: Create SKILL.md (from monorepo root)**

Create `packages/agentos-skills-registry/registry/curated/topicality/SKILL.md` with content from spec.

- [ ] **Step 5: Add extension registry entry**

Add to `TOOL_CATALOG` in `packages/agentos-extensions-registry/src/tool-registry.ts`:

```typescript
{
  packageName: '@framers/agentos-ext-topicality',
  name: 'topicality',
  category: 'integration',
  available: true,
  displayName: 'Topicality Guardrail',
  description: 'Embedding-based topic enforcement with allowed/forbidden topics and session-aware drift detection.',
  requiredSecrets: [],
  defaultPriority: 3,
  envVars: [],
  docsUrl: '/docs/extensions/built-in/topicality',
},
```

- [ ] **Step 6: Commit and push from monorepo root**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/agentos-skills-registry/registry/curated/topicality/
git add packages/agentos-extensions-registry/src/tool-registry.ts
git commit -m "feat(topicality): add SKILL.md and extension registry entry"
```

---

## Task 8: Full verification

- [ ] **Step 1: Run all topicality tests**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/packs/topicality/
```

- [ ] **Step 2: Run all extension tests (regression)**

```bash
cd packages/agentos && pnpm vitest run tests/extensions/
```

- [ ] **Step 3: Run shared utils tests**

```bash
cd packages/agentos && pnpm vitest run tests/core/utils/
```

- [ ] **Step 4: Run guardrail dispatcher tests**

```bash
cd packages/agentos && pnpm vitest run tests/core/guardrails/
```

- [ ] **Step 5: Update monorepo submodule pointer and push**

```bash
cd /Users/johnn/Documents/git/voice-chat-assistant
git add packages/agentos
git commit -m "chore: update agentos submodule — topicality guardrail extension complete"
git push origin master
```
