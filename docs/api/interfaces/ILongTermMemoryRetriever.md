# Interface: ILongTermMemoryRetriever

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:41](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ILongTermMemoryRetriever.ts#L41)

## Methods

### recordRetrievalFeedback()?

> `optional` **recordRetrievalFeedback**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:46](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ILongTermMemoryRetriever.ts#L46)

#### Parameters

##### input

[`LongTermMemoryFeedbackInput`](LongTermMemoryFeedbackInput.md)

#### Returns

`Promise`\<`void`\>

***

### retrieveLongTermMemory()

> **retrieveLongTermMemory**(`input`): `Promise`\<[`LongTermMemoryRetrievalResult`](LongTermMemoryRetrievalResult.md) \| `null`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:42](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/ILongTermMemoryRetriever.ts#L42)

#### Parameters

##### input

[`LongTermMemoryRetrievalInput`](LongTermMemoryRetrievalInput.md)

#### Returns

`Promise`\<[`LongTermMemoryRetrievalResult`](LongTermMemoryRetrievalResult.md) \| `null`\>
