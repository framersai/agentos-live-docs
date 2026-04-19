# Interface: MemoryConsolidationResult

Defined in: [packages/agentos/src/memory/io/facade/types.ts:545](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/facade/types.ts#L545)

Statistics returned after a consolidation cycle completes.

## Properties

### compacted

> **compacted**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:564](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/facade/types.ts#L564)

Number of traces compacted (archived to long-term store).

***

### derived

> **derived**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:559](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/facade/types.ts#L559)

Number of new insight traces derived from clusters.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:569](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/facade/types.ts#L569)

Wall-clock time the consolidation cycle took in milliseconds.

***

### merged

> **merged**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:554](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/facade/types.ts#L554)

Number of trace pairs merged into single traces.

***

### personalityDecayed?

> `optional` **personalityDecayed**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:580](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/facade/types.ts#L580)

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

Defined in: [packages/agentos/src/memory/io/facade/types.ts:549](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/facade/types.ts#L549)

Number of traces pruned (below strength threshold).
