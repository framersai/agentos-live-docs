# Interface: StandaloneMemoryRollingSummarySinkOptions

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:85](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/integration/StandaloneMemoryBridge.ts#L85)

## Properties

### atomicDocImportance?

> `optional` **atomicDocImportance**: `number`

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:102](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/integration/StandaloneMemoryBridge.ts#L102)

Importance assigned to atomic `memory_json` item traces.

#### Default

```ts
1.0
```

***

### baseTags?

> `optional` **baseTags**: `string`[]

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:90](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/integration/StandaloneMemoryBridge.ts#L90)

Tags added to every persisted rolling-memory trace.

#### Default

```ts
['agentos', 'long_term_memory']
```

***

### summaryImportance?

> `optional` **summaryImportance**: `number`

Defined in: [packages/agentos/src/memory/io/integration/StandaloneMemoryBridge.ts:96](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/integration/StandaloneMemoryBridge.ts#L96)

Importance assigned to summary snapshot traces.

#### Default

```ts
0.9
```
