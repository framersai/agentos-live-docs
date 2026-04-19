# Type Alias: TokenEstimator()

> **TokenEstimator** = (`content`, `modelId?`) => `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:385](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L385)

Function signature for estimating token counts.
This is passed to templates to allow them to make token-aware decisions.

## Parameters

### content

`string`

### modelId?

`string`

## Returns

`Promise`\<`number`\>
