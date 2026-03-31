# Interface: SpreadingActivationInput

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:23](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/SpreadingActivation.ts#L23)

## Properties

### config?

> `optional` **config**: [`SpreadingActivationConfig`](SpreadingActivationConfig.md)

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:27](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/SpreadingActivation.ts#L27)

***

### getNeighbors()

> **getNeighbors**: (`nodeId`) => `object`[] \| `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:26](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/SpreadingActivation.ts#L26)

Get neighbors with edge weights. Can be sync or async.

#### Parameters

##### nodeId

`string`

#### Returns

`object`[] \| `Promise`\<`object`[]\>

***

### seedIds

> **seedIds**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:24](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/SpreadingActivation.ts#L24)
