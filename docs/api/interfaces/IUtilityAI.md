# Interface: IUtilityAI

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:185](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L185)

## Interface

IUtilityAI
Defines the contract for a comprehensive Utility AI service.

## Properties

### utilityId

> `readonly` **utilityId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:186](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L186)

## Methods

### analyzeSentiment()

> **analyzeSentiment**(`text`, `options?`): `Promise`\<[`SentimentResult`](SentimentResult.md)\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:197](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L197)

#### Parameters

##### text

`string`

##### options?

[`SentimentAnalysisOptions`](SentimentAnalysisOptions.md)

#### Returns

`Promise`\<[`SentimentResult`](SentimentResult.md)\>

***

### calculateReadability()

> **calculateReadability**(`text`, `options`): `Promise`\<[`ReadabilityResult`](ReadabilityResult.md)\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:201](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L201)

#### Parameters

##### text

`string`

##### options

[`ReadabilityOptions`](ReadabilityOptions.md)

#### Returns

`Promise`\<[`ReadabilityResult`](ReadabilityResult.md)\>

***

### calculateSimilarity()

> **calculateSimilarity**(`text1`, `text2`, `options?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:196](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L196)

#### Parameters

##### text1

`string`

##### text2

`string`

##### options?

[`SimilarityOptions`](SimilarityOptions.md)

#### Returns

`Promise`\<`number`\>

***

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `dependencies?`: `object`[]; `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:214](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L214)

#### Returns

`Promise`\<\{ `dependencies?`: `object`[]; `details?`: `any`; `isHealthy`: `boolean`; \}\>

***

### classifyText()

> **classifyText**(`textToClassify`, `options`): `Promise`\<`ClassificationResult`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:192](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L192)

#### Parameters

##### textToClassify

`string`

##### options

[`ClassificationOptions`](ClassificationOptions.md)

#### Returns

`Promise`\<`ClassificationResult`\>

***

### detectLanguage()

> **detectLanguage**(`text`, `options?`): `Promise`\<[`LanguageDetectionResult`](LanguageDetectionResult.md)[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:198](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L198)

#### Parameters

##### text

`string`

##### options?

[`LanguageDetectionOptions`](LanguageDetectionOptions.md)

#### Returns

`Promise`\<[`LanguageDetectionResult`](LanguageDetectionResult.md)[]\>

***

### extractKeywords()

> **extractKeywords**(`textToAnalyze`, `options?`): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:193](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L193)

#### Parameters

##### textToAnalyze

`string`

##### options?

[`KeywordExtractionOptions`](KeywordExtractionOptions.md)

#### Returns

`Promise`\<`string`[]\>

***

### generateNGrams()

> **generateNGrams**(`tokens`, `options`): `Promise`\<`Record`\<`number`, `string`[][]\>\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:200](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L200)

#### Parameters

##### tokens

`string`[]

##### options

[`NGramOptions`](NGramOptions.md)

#### Returns

`Promise`\<`Record`\<`number`, `string`[][]\>\>

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:188](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L188)

#### Parameters

##### config

[`UtilityAIConfigBase`](UtilityAIConfigBase.md) & `Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

***

### loadTrainedModel()?

> `optional` **loadTrainedModel**(`modelTypeOrId`, `pathOrStoreId?`): `Promise`\<\{ `message?`: `string`; `success`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:225](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L225)

#### Parameters

##### modelTypeOrId

`string`

##### pathOrStoreId?

`string`

#### Returns

`Promise`\<\{ `message?`: `string`; `success`: `boolean`; \}\>

***

### normalizeText()

> **normalizeText**(`text`, `options?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:199](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L199)

#### Parameters

##### text

`string`

##### options?

[`TextNormalizationOptions`](TextNormalizationOptions.md)

#### Returns

`Promise`\<`string`\>

***

### parseJsonSafe()

> **parseJsonSafe**\<`T`\>(`jsonString`, `options?`): `Promise`\<`T` \| `null`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:211](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L211)

Safely parses a string that is expected to be JSON, potentially using an LLM to fix common issues.

#### Type Parameters

##### T

`T` = `any`

The expected type of the parsed JSON object.

#### Parameters

##### jsonString

`string`

The string to parse.

##### options?

[`ParseJsonOptions`](ParseJsonOptions.md)\<`T`\>

Options for parsing and fixing.

#### Returns

`Promise`\<`T` \| `null`\>

The parsed object, or null if parsing and fixing fail.

***

### saveTrainedModel()?

> `optional` **saveTrainedModel**(`modelTypeOrId`, `pathOrStoreId?`): `Promise`\<\{ `message?`: `string`; `pathOrStoreId?`: `string`; `success`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:224](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L224)

#### Parameters

##### modelTypeOrId

`string`

##### pathOrStoreId?

`string`

#### Returns

`Promise`\<\{ `message?`: `string`; `pathOrStoreId?`: `string`; `success`: `boolean`; \}\>

***

### shutdown()?

> `optional` **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:215](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L215)

#### Returns

`Promise`\<`void`\>

***

### stemTokens()

> **stemTokens**(`tokens`, `options?`): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:195](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L195)

#### Parameters

##### tokens

`string`[]

##### options?

[`StemmingOptions`](StemmingOptions.md)

#### Returns

`Promise`\<`string`[]\>

***

### summarize()

> **summarize**(`textToSummarize`, `options?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:191](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L191)

#### Parameters

##### textToSummarize

`string`

##### options?

[`SummarizationOptions`](SummarizationOptions.md)

#### Returns

`Promise`\<`string`\>

***

### tokenize()

> **tokenize**(`text`, `options?`): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:194](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L194)

#### Parameters

##### text

`string`

##### options?

[`TokenizationOptions`](TokenizationOptions.md)

#### Returns

`Promise`\<`string`[]\>

***

### trainModel()?

> `optional` **trainModel**(`trainingData`, `modelType`, `trainingOptions?`): `Promise`\<\{ `message?`: `string`; `modelId?`: `string`; `success`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:218](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L218)

#### Parameters

##### trainingData

`any`[]

##### modelType

`string`

##### trainingOptions?

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<\{ `message?`: `string`; `modelId?`: `string`; `success`: `boolean`; \}\>
