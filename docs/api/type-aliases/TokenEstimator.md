# Type Alias: TokenEstimator()

> **TokenEstimator** = (`content`, `modelId?`) => `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:385](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L385)

Function signature for estimating token counts.
This is passed to templates to allow them to make token-aware decisions.

## Parameters

### content

`string`

### modelId?

`string`

## Returns

`Promise`\<`number`\>
