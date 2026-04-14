# Interface: TokenUsage

Defined in: [packages/agentos/src/api/generateText.ts:82](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L82)

Token consumption figures reported by the provider for a single completion call.
All values are approximate and provider-dependent.

## Properties

### completionTokens

> **completionTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:86](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L86)

Number of tokens in the model's response.

***

### costUSD?

> `optional` **costUSD**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:90](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L90)

Total cost reported by the provider across all steps, when available.

***

### promptTokens

> **promptTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:84](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L84)

Number of tokens in the prompt / input sent to the model.

***

### totalTokens

> **totalTokens**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:88](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L88)

Sum of `promptTokens` and `completionTokens`.
