# Function: buildDefaultPlan()

> **buildDefaultPlan**(`strategy`, `overrides?`): [`RetrievalPlan`](../interfaces/RetrievalPlan.md)

Defined in: [packages/agentos/src/rag/unified/types.ts:364](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L364)

Creates a sensible default [RetrievalPlan](../interfaces/RetrievalPlan.md) for a given strategy level.

This is the canonical way to construct a plan when the classifier does not
produce a full plan (e.g., legacy tier-based classification, heuristic mode,
or fallback scenarios).

Strategy defaults:
- **none**: All sources disabled, no HyDE, no memory, no research.
- **simple**: Vector + BM25 + memory (episodic, semantic). No HyDE.
- **moderate**: All sources enabled. HyDE with 1 hypothesis. Memory with
  episodic + semantic. RAPTOR layers 0-1. Graph depth 2.
- **complex**: All sources enabled. HyDE with 3 hypotheses. Full memory.
  Deep research. RAPTOR all layers. Graph depth 3.

## Parameters

### strategy

`RetrievalStrategy`

The base retrieval strategy.

### overrides?

`Partial`\<[`RetrievalPlan`](../interfaces/RetrievalPlan.md)\>

Optional partial overrides to apply on top of defaults.

## Returns

[`RetrievalPlan`](../interfaces/RetrievalPlan.md)

A complete [RetrievalPlan](../interfaces/RetrievalPlan.md).

## Example

```typescript
// Simple plan with defaults
const plan = buildDefaultPlan('moderate');

// Complex plan with custom temporal preferences
const plan = buildDefaultPlan('complex', {
  temporal: { preferRecent: true, recencyBoost: 1.5, maxAgeMs: 86_400_000 },
});
```
