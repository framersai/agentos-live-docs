# Interface: ProspectiveMemoryItem

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:26](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L26)

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:29](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L29)

What the agent should remember to do.

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L49)

Creation timestamp.

***

### cueEmbedding?

> `optional` **cueEmbedding**: `number`[]

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:37](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L37)

For context_based: embedding of the cue phrase.

***

### cueText?

> `optional` **cueText**: `string`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:39](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L39)

For context_based: raw cue text (for display).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:27](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L27)

***

### importance

> **importance**: `number`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:43](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L43)

Importance / priority.

***

### recurring

> **recurring**: `boolean`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L47)

Whether to re-trigger (recurring).

***

### similarityThreshold?

> `optional` **similarityThreshold**: `number`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:41](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L41)

Minimum similarity for context-based triggers.

#### Default

```ts
0.7
```

***

### sourceTraceId?

> `optional` **sourceTraceId**: `string`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:51](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L51)

Source trace ID (if linked to a memory trace).

***

### triggerAt?

> `optional` **triggerAt**: `number`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:33](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L33)

For time_based: Unix ms when this should fire.

***

### triggered

> **triggered**: `boolean`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:45](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L45)

Whether this has been triggered and delivered.

***

### triggerEvent?

> `optional` **triggerEvent**: `string`

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:35](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L35)

For event_based: event name to match.

***

### triggerType

> **triggerType**: [`ProspectiveTriggerType`](../type-aliases/ProspectiveTriggerType.md)

Defined in: [packages/agentos/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts:31](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/prospective/ProspectiveMemoryManager.ts#L31)

How this memory is triggered.
