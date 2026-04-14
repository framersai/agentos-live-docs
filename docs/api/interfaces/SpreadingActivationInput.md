# Interface: SpreadingActivationInput

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:23](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/SpreadingActivation.ts#L23)

## Properties

### config?

> `optional` **config**: [`SpreadingActivationConfig`](SpreadingActivationConfig.md)

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:27](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/SpreadingActivation.ts#L27)

***

### getNeighbors()

> **getNeighbors**: (`nodeId`) => `object`[] \| `Promise`\<`object`[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:26](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/SpreadingActivation.ts#L26)

Get neighbors with edge weights. Can be sync or async.

#### Parameters

##### nodeId

`string`

#### Returns

`object`[] \| `Promise`\<`object`[]\>

***

### seedIds

> **seedIds**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/SpreadingActivation.ts:24](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/SpreadingActivation.ts#L24)
