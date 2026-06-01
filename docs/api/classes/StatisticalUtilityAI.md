# Class: StatisticalUtilityAI

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:89](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L89)

## Interface

IUtilityAI
Defines the contract for a comprehensive Utility AI service.

## Implements

- [`IUtilityAI`](../interfaces/IUtilityAI.md)

## Constructors

### Constructor

> **new StatisticalUtilityAI**(`utilityId?`): `StatisticalUtilityAI`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:135](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L135)

#### Parameters

##### utilityId?

`string`

#### Returns

`StatisticalUtilityAI`

## Properties

### utilityId

> `readonly` **utilityId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:90](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L90)

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`utilityId`](../interfaces/IUtilityAI.md#utilityid)

## Methods

### analyzeSentiment()

> **analyzeSentiment**(`text`, `options?`): `Promise`\<[`SentimentResult`](../interfaces/SentimentResult.md)\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:460](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L460)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:607](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L607)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:392](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L392)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:664](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L664)

#### Returns

`Promise`\<\{ `dependencies?`: `object`[]; `details?`: `any`; `isHealthy`: `boolean`; \}\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`checkHealth`](../interfaces/IUtilityAI.md#checkhealth)

***

### classifyText()

> **classifyText**(`textToClassify`, `options`): `Promise`\<`ClassificationResult`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:290](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L290)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:521](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L521)

Detect the language of a text string using trigram frequency analysis.

Uses a Cavnar & Trenkle style algorithm that compares the input text's
trigram frequency profile against pre-computed reference profiles for 20+
languages.  Accuracy improves with longer text; passages under 10
characters return `'und'` (undetermined).

#### Parameters

##### text

`string`

The input text to analyse.

##### options?

[`LanguageDetectionOptions`](../interfaces/LanguageDetectionOptions.md)

`maxCandidates` controls how many ranked results to
                 return (default 3).  The `method` field is accepted but
                 only `'n_gram'` (the default) is supported by this
                 statistical implementation.

#### Returns

`Promise`\<[`LanguageDetectionResult`](../interfaces/LanguageDetectionResult.md)[]\>

Ranked array of `{ language, confidence }` where `language` is
         an ISO 639-1 code (e.g. `'en'`, `'fr'`) and `confidence` is
         in the range 0-1.

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`detectLanguage`](../interfaces/IUtilityAI.md#detectlanguage)

***

### extractKeywords()

> **extractKeywords**(`textToAnalyze`, `options?`): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:355](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L355)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:586](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L586)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:147](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L147)

#### Parameters

##### config

[`StatisticalUtilityAIConfig`](../interfaces/StatisticalUtilityAIConfig.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`initialize`](../interfaces/IUtilityAI.md#initialize)

***

### loadTrainedModel()

> **loadTrainedModel**(`modelId`, `modelType?`, `storagePath?`): `Promise`\<\{ `message?`: `string`; `success`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:744](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L744)

#### Parameters

##### modelId

`string`

##### modelType?

`string`

##### storagePath?

`string`

#### Returns

`Promise`\<\{ `message?`: `string`; `success`: `boolean`; \}\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`loadTrainedModel`](../interfaces/IUtilityAI.md#loadtrainedmodel)

***

### normalizeText()

> **normalizeText**(`text`, `options?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:542](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L542)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:787](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L787)

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

### saveTrainedModel()

> **saveTrainedModel**(`modelId`, `modelType?`, `storagePath?`): `Promise`\<\{ `message?`: `string`; `pathOrStoreId?`: `string`; `success`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:716](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L716)

#### Parameters

##### modelId

`string`

##### modelType?

`string`

##### storagePath?

`string`

#### Returns

`Promise`\<\{ `message?`: `string`; `pathOrStoreId?`: `string`; `success`: `boolean`; \}\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`saveTrainedModel`](../interfaces/IUtilityAI.md#savetrainedmodel)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:803](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L803)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`shutdown`](../interfaces/IUtilityAI.md#shutdown)

***

### stemTokens()

> **stemTokens**(`tokens`, `options?`): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:386](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L386)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:263](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L263)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:368](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L368)

#### Parameters

##### text

`string`

##### options?

[`TokenizationOptions`](../interfaces/TokenizationOptions.md)

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`tokenize`](../interfaces/IUtilityAI.md#tokenize)

***

### trainModel()

> **trainModel**(`trainingData`, `modelType`, `trainingOptions?`): `Promise`\<\{ `message?`: `string`; `modelId?`: `string`; `success`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/StatisticalUtilityAI.ts:680](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/StatisticalUtilityAI.ts#L680)

#### Parameters

##### trainingData

`object`[]

##### modelType

`string`

##### trainingOptions?

###### alpha?

`number`

###### modelId?

`string`

###### stemmer?

`"porter"` \| `"lancaster"`

#### Returns

`Promise`\<\{ `message?`: `string`; `modelId?`: `string`; `success`: `boolean`; \}\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`trainModel`](../interfaces/IUtilityAI.md#trainmodel)
