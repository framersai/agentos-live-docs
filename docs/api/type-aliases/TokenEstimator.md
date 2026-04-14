# Type Alias: TokenEstimator()

> **TokenEstimator** = (`content`, `modelId?`) => `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:385](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L385)

Function signature for estimating token counts.
This is passed to templates to allow them to make token-aware decisions.

## Parameters

### content

`string`

### modelId?

`string`

## Returns

`Promise`\<`number`\>
