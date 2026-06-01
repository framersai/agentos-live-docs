# Type Alias: TokenEstimator()

> **TokenEstimator** = (`content`, `modelId?`) => `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:385](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/core/llm/IPromptEngine.ts#L385)

Function signature for estimating token counts.
This is passed to templates to allow them to make token-aware decisions.

## Parameters

### content

`string`

### modelId?

`string`

## Returns

`Promise`\<`number`\>
