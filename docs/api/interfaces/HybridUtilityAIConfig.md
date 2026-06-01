# Interface: HybridUtilityAIConfig

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:31](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L31)

Base configuration for any IUtilityAI implementation.

## Extends

- [`UtilityAIConfigBase`](UtilityAIConfigBase.md)

## Properties

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:21](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L21)

Default language for processing if not specified in method options (e.g., 'en', 'es'). BCP-47 format preferred.

#### Inherited from

[`UtilityAIConfigBase`](UtilityAIConfigBase.md).[`defaultLanguage`](UtilityAIConfigBase.md#defaultlanguage)

***

### llm?

> `optional` **llm**: [`IUtilityAI`](IUtilityAI.md)

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:33](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L33)

LLM-based implementation (used for generative tasks).

***

### resourcePath?

> `optional` **resourcePath**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:23](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L23)

Path to a directory containing resource files (e.g., stop word lists, lexicons, trained models for statistical utilities).

#### Inherited from

[`UtilityAIConfigBase`](UtilityAIConfigBase.md).[`resourcePath`](UtilityAIConfigBase.md#resourcepath)

***

### statistical?

> `optional` **statistical**: [`IUtilityAI`](IUtilityAI.md)

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/HybridUtilityAI.ts:35](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/HybridUtilityAI.ts#L35)

Statistical/NLP implementation (used for deterministic tasks).

***

### utilityId?

> `optional` **utilityId**: `string`

Defined in: [packages/agentos/src/cognition/nlp/ai\_utilities/IUtilityAI.ts:19](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/nlp/ai_utilities/IUtilityAI.ts#L19)

Unique identifier for this specific utility AI service instance.

#### Inherited from

[`UtilityAIConfigBase`](UtilityAIConfigBase.md).[`utilityId`](UtilityAIConfigBase.md#utilityid)
