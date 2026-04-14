# Interface: LLMJudgeConfig

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:17](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L17)

Configuration for LLM Judge

## Properties

### llmProvider

> **llmProvider**: [`AIModelProviderManager`](../classes/AIModelProviderManager.md)

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:19](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L19)

LLM provider manager

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:21](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L21)

Model to use for judging

***

### providerId?

> `optional` **providerId**: `string`

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:23](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L23)

Provider ID

***

### systemPrompt?

> `optional` **systemPrompt**: `string`

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:27](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L27)

Custom system prompt for the judge

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:25](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L25)

Temperature for judging (lower = more consistent)
