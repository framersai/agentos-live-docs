# Interface: MemoryConsolidationResult

Defined in: [packages/agentos/src/memory/io/facade/types.ts:553](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L553)

Statistics returned after a consolidation cycle completes.

## Properties

### compacted

> **compacted**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:572](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L572)

Number of traces compacted (archived to long-term store).

***

### derived

> **derived**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:567](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L567)

Number of new insight traces derived from clusters.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:577](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L577)

Wall-clock time the consolidation cycle took in milliseconds.

***

### merged

> **merged**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:562](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L562)

Number of trace pairs merged into single traces.

***

### personalityDecayed?

> `optional` **personalityDecayed**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:588](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L588)

Number of personality mutations affected by decay during this cycle.

Only populated when a [PersonalityMutationStore](../classes/PersonalityMutationStore.md) is configured
on the ConsolidationLoop. This includes both weakened mutations and
mutations pruned after falling below the strength threshold.
Zero when the store is absent or no mutations were touched.

#### Default

```ts
0
```

***

### pruned

> **pruned**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:557](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L557)

Number of traces pruned (below strength threshold).
