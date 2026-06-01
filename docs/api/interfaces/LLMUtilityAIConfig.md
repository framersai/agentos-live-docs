# Interface: LLMUtilityAIConfig

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:48](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L48)

Base configuration for any IUtilityAI implementation.

## Extends

- [`UtilityAIConfigBase`](UtilityAIConfigBase.md)

## Properties

### classificationModelId?

> `optional` **classificationModelId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:55](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L55)

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:21](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L21)

Default language for processing if not specified in method options (e.g., 'en', 'es'). BCP-47 format preferred.

#### Inherited from

[`UtilityAIConfigBase`](UtilityAIConfigBase.md).[`defaultLanguage`](UtilityAIConfigBase.md#defaultlanguage)

***

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:50](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L50)

***

### defaultProviderId?

> `optional` **defaultProviderId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:51](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L51)

***

### jsonFixerModelId?

> `optional` **jsonFixerModelId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:59](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L59)

***

### keywordModelId?

> `optional` **keywordModelId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:56](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L56)

***

### languageDetectionModelId?

> `optional` **languageDetectionModelId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:58](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L58)

***

### llmProviderManager

> **llmProviderManager**: [`AIModelProviderManager`](../classes/AIModelProviderManager.md)

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:49](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L49)

***

### readabilityEstimationModelId?

> `optional` **readabilityEstimationModelId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:62](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L62)

***

### resourcePath?

> `optional` **resourcePath**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:23](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L23)

Path to a directory containing resource files (e.g., stop word lists, lexicons, trained models for statistical utilities).

#### Inherited from

[`UtilityAIConfigBase`](UtilityAIConfigBase.md).[`resourcePath`](UtilityAIConfigBase.md#resourcepath)

***

### semanticSimilarityModelId?

> `optional` **semanticSimilarityModelId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:60](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L60)

***

### sentimentModelId?

> `optional` **sentimentModelId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:57](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L57)

***

### summarizationModelId?

> `optional` **summarizationModelId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:54](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L54)

***

### textNormalizationModelId?

> `optional` **textNormalizationModelId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/LLMUtilityAI.ts:61](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/LLMUtilityAI.ts#L61)

***

### utilityId?

> `optional` **utilityId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:19](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L19)

Unique identifier for this specific utility AI service instance.

#### Inherited from

[`UtilityAIConfigBase`](UtilityAIConfigBase.md).[`utilityId`](UtilityAIConfigBase.md#utilityid)
