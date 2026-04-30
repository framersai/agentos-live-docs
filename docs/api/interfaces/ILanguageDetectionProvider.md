# Interface: ILanguageDetectionProvider

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:43](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L43)

Pluggable detection provider interface.
Providers SHOULD return an ordered list with the highest confidence first.

## Properties

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:44](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L44)

***

### isInitialized

> `readonly` **isInitialized**: `boolean`

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:45](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L45)

## Methods

### detect()

> **detect**(`text`): `Promise`\<[`DetectedLanguageResult`](DetectedLanguageResult.md)[]\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:49](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L49)

Detect language from plain text.

#### Parameters

##### text

`string`

#### Returns

`Promise`\<[`DetectedLanguageResult`](DetectedLanguageResult.md)[]\>

***

### detectFromAudio()?

> `optional` **detectFromAudio**(`audio`): `Promise`\<[`DetectedLanguageResult`](DetectedLanguageResult.md)[]\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L51)

Optional audio-based detection (e.g., short clip classification).

#### Parameters

##### audio

`Buffer`

#### Returns

`Promise`\<[`DetectedLanguageResult`](DetectedLanguageResult.md)[]\>

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L47)

Perform any async setup (API key validation, model warm-up).

#### Returns

`Promise`\<`void`\>

***

### shutdown()?

> `optional` **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/nlp/language/interfaces.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/nlp/language/interfaces.ts#L53)

Dispose resources (close handles, free model memory).

#### Returns

`Promise`\<`void`\>
