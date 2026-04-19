# Interface: SpreadingActivationInput

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:23](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/SpreadingActivation.ts#L23)

## Properties

### config?

> `optional` **config**: [`SpreadingActivationConfig`](SpreadingActivationConfig.md)

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:27](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/SpreadingActivation.ts#L27)

***

### getNeighbors()

> **getNeighbors**: (`nodeId`) => `object`[] \| `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:26](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/SpreadingActivation.ts#L26)

Get neighbors with edge weights. Can be sync or async.

#### Parameters

##### nodeId

`string`

#### Returns

`object`[] \| `Promise`\<`object`[]\>

***

### seedIds

> **seedIds**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:24](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/SpreadingActivation.ts#L24)
