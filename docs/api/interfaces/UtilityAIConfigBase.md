# Interface: UtilityAIConfigBase

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:17](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L17)

Base configuration for any IUtilityAI implementation.

## Extended by

- [`LLMUtilityAIConfig`](LLMUtilityAIConfig.md)
- [`StatisticalUtilityAIConfig`](StatisticalUtilityAIConfig.md)
- [`HybridUtilityAIConfig`](HybridUtilityAIConfig.md)

## Properties

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:21](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L21)

Default language for processing if not specified in method options (e.g., 'en', 'es'). BCP-47 format preferred.

***

### resourcePath?

> `optional` **resourcePath**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:23](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L23)

Path to a directory containing resource files (e.g., stop word lists, lexicons, trained models for statistical utilities).

***

### utilityId?

> `optional` **utilityId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:19](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L19)

Unique identifier for this specific utility AI service instance.
