# Interface: MetacognitiveSignal

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:139](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/mechanisms/types.ts#L139)

Metacognitive signal produced by FOK detection.

## Properties

### feelingOfKnowing

> **feelingOfKnowing**: `number`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:143](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/mechanisms/types.ts#L143)

Feeling-of-knowing score, 0 (no idea) to 1 (certain it exists).

***

### partialInfo?

> `optional` **partialInfo**: `string`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:145](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/mechanisms/types.ts#L145)

Partial info: entities, emotion, approximate timeframe.

***

### traceId

> **traceId**: `string`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:141](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/mechanisms/types.ts#L141)

***

### type

> **type**: `"low_confidence"` \| `"tip_of_tongue"` \| `"high_confidence"`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:140](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/mechanisms/types.ts#L140)
