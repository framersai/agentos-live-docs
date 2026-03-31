# Interface: PromptEngineResult

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:227](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L227)

Comprehensive result object returned by prompt construction, containing
the formatted prompt, metadata, issues encountered, and optimization information.

## Interface

PromptEngineResult

## Properties

### cacheKey?

> `optional` **cacheKey**: `string`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:270](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L270)

An optional cache key if the result was retrieved from or stored in a cache.

***

### estimatedTokenCount?

> `optional` **estimatedTokenCount**: `number`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:236](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L236)

Estimated token count of the constructed prompt before precise provider counting.

***

### formattedToolSchemas?

> `optional` **formattedToolSchemas**: `any`[]

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:234](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L234)

Formatted tool schemas compatible with the target model's API, if tools are used.
The structure of `any[]` depends on `ModelTargetInfo.toolSupport.format`.

***

### issues?

> `optional` **issues**: `object`[]

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:240](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L240)

Any issues (errors, warnings, info) encountered during prompt construction.

#### code

> **code**: `string`

#### component?

> `optional` **component**: `string`

#### details?

> `optional` **details**: `unknown`

#### message

> **message**: `string`

#### suggestion?

> `optional` **suggestion**: `string`

#### type

> **type**: `"error"` \| `"warning"` \| `"info"`

***

### metadata

> **metadata**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:259](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L259)

Performance metrics and metadata related to the prompt construction process.

#### Index Signature

\[`key`: `string`\]: `unknown`

#### constructionTimeMs

> **constructionTimeMs**: `number`

#### historyMessagesIncluded

> **historyMessagesIncluded**: `number`

#### ragContextTokensUsed?

> `optional` **ragContextTokensUsed**: `number`

#### selectedContextualElementIds

> **selectedContextualElementIds**: `string`[]

#### templateUsed

> **templateUsed**: `string`

#### totalSystemPromptsApplied

> **totalSystemPromptsApplied**: `number`

***

### modificationDetails?

> `optional` **modificationDetails**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:251](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L251)

Details about modifications made during construction (e.g., which components were truncated).

#### addedContextualElementIds?

> `optional` **addedContextualElementIds**: `string`[]

#### originalEstimatedTokenCount?

> `optional` **originalEstimatedTokenCount**: `number`

#### removedComponents?

> `optional` **removedComponents**: `string`[]

#### summarizedComponents?

> `optional` **summarizedComponents**: `string`[]

#### truncatedComponents?

> `optional` **truncatedComponents**: `string`[]

***

### prompt

> **prompt**: [`FormattedPrompt`](../type-aliases/FormattedPrompt.md)

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:229](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L229)

The final formatted prompt ready for LLM consumption.

***

### tokenCount?

> `optional` **tokenCount**: `number`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:238](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L238)

Precise token count, if available from a tokenizer or after construction.

***

### wasTruncatedOrSummarized

> **wasTruncatedOrSummarized**: `boolean`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:249](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L249)

Indicates if content was truncated or summarized to fit token limits.
