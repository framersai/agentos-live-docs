# Interface: ILongTermMemoryRetriever

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:43](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/conversation/ILongTermMemoryRetriever.ts#L43)

## Methods

### recordRetrievalFeedback()?

> `optional` **recordRetrievalFeedback**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:48](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/conversation/ILongTermMemoryRetriever.ts#L48)

#### Parameters

##### input

[`LongTermMemoryFeedbackInput`](LongTermMemoryFeedbackInput.md)

#### Returns

`Promise`\<`void`\>

***

### retrieveLongTermMemory()

> **retrieveLongTermMemory**(`input`): `Promise`\<[`LongTermMemoryRetrievalResult`](LongTermMemoryRetrievalResult.md) \| `null`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:44](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/conversation/ILongTermMemoryRetriever.ts#L44)

#### Parameters

##### input

[`LongTermMemoryRetrievalInput`](LongTermMemoryRetrievalInput.md)

#### Returns

`Promise`\<[`LongTermMemoryRetrievalResult`](LongTermMemoryRetrievalResult.md) \| `null`\>
