# Class: HybridUtilityAI

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:46](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L46)

Routes each utility method to the most appropriate backend:
- **LLM**: summarization, classification, keyword extraction, JSON repair
- **Statistical**: tokenization, stemming, n-grams, readability, similarity
- **Either with preference**: sentiment, language detection

If the preferred backend is unavailable, falls back to the other.

## Implements

- [`IUtilityAI`](../interfaces/IUtilityAI.md)

## Constructors

### Constructor

> **new HybridUtilityAI**(`config`): `HybridUtilityAI`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:51](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L51)

#### Parameters

##### config

[`HybridUtilityAIConfig`](../interfaces/HybridUtilityAIConfig.md)

#### Returns

`HybridUtilityAI`

## Properties

### utilityId

> `readonly` **utilityId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:47](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L47)

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`utilityId`](../interfaces/IUtilityAI.md#utilityid)

## Methods

### analyzeSentiment()

> **analyzeSentiment**(`text`, `options?`): `Promise`\<[`SentimentResult`](../interfaces/SentimentResult.md)\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:129](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L129)

#### Parameters

##### text

`string`

##### options?

[`SentimentAnalysisOptions`](../interfaces/SentimentAnalysisOptions.md)

#### Returns

`Promise`\<[`SentimentResult`](../interfaces/SentimentResult.md)\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`analyzeSentiment`](../interfaces/IUtilityAI.md#analyzesentiment)

***

### calculateReadability()

> **calculateReadability**(`text`, `options`): `Promise`\<[`ReadabilityResult`](../interfaces/ReadabilityResult.md)\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:119](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L119)

#### Parameters

##### text

`string`

##### options

[`ReadabilityOptions`](../interfaces/ReadabilityOptions.md)

#### Returns

`Promise`\<[`ReadabilityResult`](../interfaces/ReadabilityResult.md)\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`calculateReadability`](../interfaces/IUtilityAI.md#calculatereadability)

***

### calculateSimilarity()

> **calculateSimilarity**(`text1`, `text2`, `options?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:123](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L123)

#### Parameters

##### text1

`string`

##### text2

`string`

##### options?

[`SimilarityOptions`](../interfaces/SimilarityOptions.md)

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`calculateSimilarity`](../interfaces/IUtilityAI.md#calculatesimilarity)

***

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `dependencies?`: `object`[]; `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:139](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L139)

#### Returns

`Promise`\<\{ `dependencies?`: `object`[]; `details?`: `any`; `isHealthy`: `boolean`; \}\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`checkHealth`](../interfaces/IUtilityAI.md#checkhealth)

***

### classifyText()

> **classifyText**(`textToClassify`, `options`): `Promise`\<`ClassificationResult`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:81](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L81)

#### Parameters

##### textToClassify

`string`

##### options

[`ClassificationOptions`](../interfaces/ClassificationOptions.md)

#### Returns

`Promise`\<`ClassificationResult`\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`classifyText`](../interfaces/IUtilityAI.md#classifytext)

***

### detectLanguage()

> **detectLanguage**(`text`, `options?`): `Promise`\<[`LanguageDetectionResult`](../interfaces/LanguageDetectionResult.md)[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L133)

#### Parameters

##### text

`string`

##### options?

[`LanguageDetectionOptions`](../interfaces/LanguageDetectionOptions.md)

#### Returns

`Promise`\<[`LanguageDetectionResult`](../interfaces/LanguageDetectionResult.md)[]\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`detectLanguage`](../interfaces/IUtilityAI.md#detectlanguage)

***

### extractKeywords()

> **extractKeywords**(`textToAnalyze`, `options?`): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:85](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L85)

#### Parameters

##### textToAnalyze

`string`

##### options?

[`KeywordExtractionOptions`](../interfaces/KeywordExtractionOptions.md)

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`extractKeywords`](../interfaces/IUtilityAI.md#extractkeywords)

***

### generateNGrams()

> **generateNGrams**(`tokens`, `options`): `Promise`\<`Record`\<`number`, `string`[][]\>\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:115](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L115)

#### Parameters

##### tokens

`string`[]

##### options

[`NGramOptions`](../interfaces/NGramOptions.md)

#### Returns

`Promise`\<`Record`\<`number`, `string`[][]\>\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`generateNGrams`](../interfaces/IUtilityAI.md#generatengrams)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:60](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L60)

#### Parameters

##### config

[`UtilityAIConfigBase`](../interfaces/UtilityAIConfigBase.md) & `Record`\<`string`, `any`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`initialize`](../interfaces/IUtilityAI.md#initialize)

***

### normalizeText()

> **normalizeText**(`text`, `options?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:111](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L111)

#### Parameters

##### text

`string`

##### options?

[`TextNormalizationOptions`](../interfaces/TextNormalizationOptions.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`normalizeText`](../interfaces/IUtilityAI.md#normalizetext)

***

### parseJsonSafe()

> **parseJsonSafe**\<`T`\>(`jsonString`, `options?`): `Promise`\<`T` \| `null`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:89](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L89)

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

[`ParseJsonOptions`](../interfaces/ParseJsonOptions.md)\<`T`\>

Options for parsing and fixing.

#### Returns

`Promise`\<`T` \| `null`\>

The parsed object, or null if parsing and fixing fail.

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`parseJsonSafe`](../interfaces/IUtilityAI.md#parsejsonsafe)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:163](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L163)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`shutdown`](../interfaces/IUtilityAI.md#shutdown)

***

### stemTokens()

> **stemTokens**(`tokens`, `options?`): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:107](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L107)

#### Parameters

##### tokens

`string`[]

##### options?

[`StemmingOptions`](../interfaces/StemmingOptions.md)

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`stemTokens`](../interfaces/IUtilityAI.md#stemtokens)

***

### summarize()

> **summarize**(`textToSummarize`, `options?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:77](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L77)

#### Parameters

##### textToSummarize

`string`

##### options?

[`SummarizationOptions`](../interfaces/SummarizationOptions.md)

#### Returns

`Promise`\<`string`\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`summarize`](../interfaces/IUtilityAI.md#summarize)

***

### tokenize()

> **tokenize**(`text`, `options?`): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:103](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L103)

#### Parameters

##### text

`string`

##### options?

[`TokenizationOptions`](../interfaces/TokenizationOptions.md)

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`tokenize`](../interfaces/IUtilityAI.md#tokenize)
