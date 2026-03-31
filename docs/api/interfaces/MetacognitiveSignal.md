# Interface: MetacognitiveSignal

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:137](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L137)

Metacognitive signal produced by FOK detection.

## Properties

### feelingOfKnowing

> **feelingOfKnowing**: `number`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:141](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L141)

Feeling-of-knowing score, 0 (no idea) to 1 (certain it exists).

***

### partialInfo?

> `optional` **partialInfo**: `string`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:143](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L143)

Partial info: entities, emotion, approximate timeframe.

***

### traceId

> **traceId**: `string`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:139](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L139)

***

### type

> **type**: `"low_confidence"` \| `"tip_of_tongue"` \| `"high_confidence"`

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:138](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/types.ts#L138)
