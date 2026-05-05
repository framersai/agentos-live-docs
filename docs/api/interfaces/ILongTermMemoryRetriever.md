# Interface: ILongTermMemoryRetriever

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:43](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/conversation/ILongTermMemoryRetriever.ts#L43)

## Methods

### recordRetrievalFeedback()?

> `optional` **recordRetrievalFeedback**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:48](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/conversation/ILongTermMemoryRetriever.ts#L48)

#### Parameters

##### input

[`LongTermMemoryFeedbackInput`](LongTermMemoryFeedbackInput.md)

#### Returns

`Promise`\<`void`\>

***

### retrieveLongTermMemory()

> **retrieveLongTermMemory**(`input`): `Promise`\<[`LongTermMemoryRetrievalResult`](LongTermMemoryRetrievalResult.md) \| `null`\>

Defined in: [packages/agentos/src/core/conversation/ILongTermMemoryRetriever.ts:44](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/conversation/ILongTermMemoryRetriever.ts#L44)

#### Parameters

##### input

[`LongTermMemoryRetrievalInput`](LongTermMemoryRetrievalInput.md)

#### Returns

`Promise`\<[`LongTermMemoryRetrievalResult`](LongTermMemoryRetrievalResult.md) \| `null`\>
