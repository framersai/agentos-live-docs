# Interface: ILongTermMemoryRetriever

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:41](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/ILongTermMemoryRetriever.ts#L41)

## Methods

### recordRetrievalFeedback()?

> `optional` **recordRetrievalFeedback**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:46](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/ILongTermMemoryRetriever.ts#L46)

#### Parameters

##### input

[`LongTermMemoryFeedbackInput`](LongTermMemoryFeedbackInput.md)

#### Returns

`Promise`\<`void`\>

***

### retrieveLongTermMemory()

> **retrieveLongTermMemory**(`input`): `Promise`\<[`LongTermMemoryRetrievalResult`](LongTermMemoryRetrievalResult.md) \| `null`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:42](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/ILongTermMemoryRetriever.ts#L42)

#### Parameters

##### input

[`LongTermMemoryRetrievalInput`](LongTermMemoryRetrievalInput.md)

#### Returns

`Promise`\<[`LongTermMemoryRetrievalResult`](LongTermMemoryRetrievalResult.md) \| `null`\>
