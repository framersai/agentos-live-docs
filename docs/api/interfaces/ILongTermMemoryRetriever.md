# Interface: ILongTermMemoryRetriever

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:41](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L41)

## Methods

### recordRetrievalFeedback()?

> `optional` **recordRetrievalFeedback**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:46](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L46)

#### Parameters

##### input

[`LongTermMemoryFeedbackInput`](LongTermMemoryFeedbackInput.md)

#### Returns

`Promise`\<`void`\>

***

### retrieveLongTermMemory()

> **retrieveLongTermMemory**(`input`): `Promise`\<[`LongTermMemoryRetrievalResult`](LongTermMemoryRetrievalResult.md) \| `null`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:42](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/conversation/ILongTermMemoryRetriever.ts#L42)

#### Parameters

##### input

[`LongTermMemoryRetrievalInput`](LongTermMemoryRetrievalInput.md)

#### Returns

`Promise`\<[`LongTermMemoryRetrievalResult`](LongTermMemoryRetrievalResult.md) \| `null`\>
