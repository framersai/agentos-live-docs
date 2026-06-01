# Class: LLMUtilityAI

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:65](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L65)

## Interface

IUtilityAI
Defines the contract for a comprehensive Utility AI service.

## Implements

- [`IUtilityAI`](../interfaces/IUtilityAI.md)
- [`IPromptEngineUtilityAI`](../interfaces/IPromptEngineUtilityAI.md)

## Constructors

### Constructor

> **new LLMUtilityAI**(`utilityId?`): `LLMUtilityAI`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:72](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L72)

#### Parameters

##### utilityId?

`string`

#### Returns

`LLMUtilityAI`

## Properties

### utilityId

> `readonly` **utilityId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:66](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L66)

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`utilityId`](../interfaces/IUtilityAI.md#utilityid)

## Methods

### analyzeSentiment()

> **analyzeSentiment**(`text`, `options?`): `Promise`\<[`SentimentResult`](../interfaces/SentimentResult.md)\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:309](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L309)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:465](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L465)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:395](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L395)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:590](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L590)

#### Returns

`Promise`\<\{ `dependencies?`: `object`[]; `details?`: `any`; `isHealthy`: `boolean`; \}\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`checkHealth`](../interfaces/IUtilityAI.md#checkhealth)

***

### classifyText()

> **classifyText**(`textToClassify`, `options`): `Promise`\<`ClassificationResult`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:257](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L257)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:337](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L337)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:287](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L287)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:445](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L445)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:77](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L77)

#### Parameters

##### config

[`LLMUtilityAIConfig`](../interfaces/LLMUtilityAIConfig.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`initialize`](../interfaces/IUtilityAI.md#initialize)

***

### loadTrainedModel()

> **loadTrainedModel**(): `Promise`\<\{ `message?`: `string`; `success`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:618](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L618)

#### Returns

`Promise`\<\{ `message?`: `string`; `success`: `boolean`; \}\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`loadTrainedModel`](../interfaces/IUtilityAI.md#loadtrainedmodel)

***

### normalizeText()

> **normalizeText**(`text`, `options?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:421](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L421)

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

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:204](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L204)

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

> **saveTrainedModel**(): `Promise`\<\{ `message?`: `string`; `pathOrStoreId?`: `string`; `success`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:615](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L615)

#### Returns

`Promise`\<\{ `message?`: `string`; `pathOrStoreId?`: `string`; `success`: `boolean`; \}\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`saveTrainedModel`](../interfaces/IUtilityAI.md#savetrainedmodel)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:622](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L622)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`shutdown`](../interfaces/IUtilityAI.md#shutdown)

***

### stemTokens()

> **stemTokens**(`tokens`, `_options?`): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:389](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L389)

#### Parameters

##### tokens

`string`[]

##### \_options?

[`StemmingOptions`](../interfaces/StemmingOptions.md)

#### Returns

`Promise`\<`string`[]\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`stemTokens`](../interfaces/IUtilityAI.md#stemtokens)

***

### summarize()

> **summarize**(`textToSummarize`, `options?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:177](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L177)

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

### summarizeConversationHistory()

> **summarizeConversationHistory**(`messages`, `targetTokenCount`, `modelInfo`, `preserveImportantMessages?`): `Promise`\<\{ `finalTokenCount`: `number`; `messagesSummarized`: `number`; `originalTokenCount`: `number`; `summaryMessages`: `ConversationMessage`[]; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:516](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L516)

Summarizes conversation history to fit within token constraints, attempting to preserve key information.

#### Parameters

##### messages

readonly `ConversationMessage`[]

The array of conversation messages to summarize.

##### targetTokenCount

`number`

The desired maximum token count for the summary.

##### modelInfo

`Readonly`\<[`ModelTargetInfo`](../interfaces/ModelTargetInfo.md)\>

Information about the model for which the summary is being prepared.

##### preserveImportantMessages?

`boolean`

If true, attempt to identify and keep important messages verbatim.

#### Returns

`Promise`\<\{ `finalTokenCount`: `number`; `messagesSummarized`: `number`; `originalTokenCount`: `number`; `summaryMessages`: `ConversationMessage`[]; \}\>

A summary (which might be a single system message or a condensed list of messages),
and metadata about the summarization.

#### Implementation of

[`IPromptEngineUtilityAI`](../interfaces/IPromptEngineUtilityAI.md).[`summarizeConversationHistory`](../interfaces/IPromptEngineUtilityAI.md#summarizeconversationhistory)

***

### summarizeRAGContext()

> **summarizeRAGContext**(`context`, `targetTokenCount`, `modelInfo`, `preserveSourceAttribution?`): `Promise`\<\{ `finalTokenCount`: `number`; `originalTokenCount`: `number`; `preservedSources?`: `string`[]; `summary`: `string`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:561](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L561)

Summarizes retrieved RAG context to fit token limits, ideally preserving source attribution if possible.

#### Parameters

##### context

The RAG context to summarize.

`string` | readonly `object`[]

##### targetTokenCount

`number`

The desired maximum token count for the summarized context.

##### modelInfo

`Readonly`\<[`ModelTargetInfo`](../interfaces/ModelTargetInfo.md)\>

Information about the model.

##### preserveSourceAttribution?

`boolean`

If true, attempt to retain source information in the summary.

#### Returns

`Promise`\<\{ `finalTokenCount`: `number`; `originalTokenCount`: `number`; `preservedSources?`: `string`[]; `summary`: `string`; \}\>

The summarized text and metadata.

#### Implementation of

[`IPromptEngineUtilityAI`](../interfaces/IPromptEngineUtilityAI.md).[`summarizeRAGContext`](../interfaces/IPromptEngineUtilityAI.md#summarizeragcontext)

***

### tokenize()

> **tokenize**(`text`, `options?`): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:360](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L360)

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

> **trainModel**(): `Promise`\<\{ `message?`: `string`; `modelId?`: `string`; `success`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:612](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L612)

#### Returns

`Promise`\<\{ `message?`: `string`; `modelId?`: `string`; `success`: `boolean`; \}\>

#### Implementation of

[`IUtilityAI`](../interfaces/IUtilityAI.md).[`trainModel`](../interfaces/IUtilityAI.md#trainmodel)
