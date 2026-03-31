# Interface: TokenUsage

Defined in: [packages/agentos/src/api/generateText.ts:54](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateText.ts#L54)

Token consumption figures reported by the provider for a single completion call.
All values are approximate and provider-dependent.

## Properties

### completionTokens

> **completionTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:58](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateText.ts#L58)

Number of tokens in the model's response.

***

### costUSD?

> `optional` **costUSD**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:62](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateText.ts#L62)

Total cost reported by the provider across all steps, when available.

***

### promptTokens

> **promptTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:56](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateText.ts#L56)

Number of tokens in the prompt / input sent to the model.

***

### totalTokens

> **totalTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:60](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/generateText.ts#L60)

Sum of `promptTokens` and `completionTokens`.
