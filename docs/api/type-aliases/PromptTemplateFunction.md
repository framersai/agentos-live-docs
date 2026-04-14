# Type Alias: PromptTemplateFunction()

> **PromptTemplateFunction** = (`components`, `modelInfo`, `selectedContextualElements`, `config`, `estimateTokenCountFn`) => `Promise`\<[`FormattedPrompt`](FormattedPrompt.md)\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:372](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/llm/IPromptEngine.ts#L372)

Function signature for prompt template implementations.
Templates are responsible for taking all processed prompt components and
formatting them into the final `FormattedPrompt` structure required by a specific
LLM provider or model type.

## Parameters

### components

`Readonly`\<[`PromptComponents`](../interfaces/PromptComponents.md)\>

The core and augmented prompt components.

### modelInfo

`Readonly`\<[`ModelTargetInfo`](../interfaces/ModelTargetInfo.md)\>

Information about the target AI model.

### selectedContextualElements

`ReadonlyArray`\<[`ContextualPromptElement`](../interfaces/ContextualPromptElement.md)\>

Contextual elements chosen for this prompt.

### config

`Readonly`\<[`PromptEngineConfig`](../interfaces/PromptEngineConfig.md)\>

A read-only view of the PromptEngine's current configuration.

### estimateTokenCountFn

(`content`, `modelId?`) => `Promise`\<`number`\>

A function to estimate token counts, useful within templates.

## Returns

`Promise`\<[`FormattedPrompt`](FormattedPrompt.md)\>

A promise that resolves to the final, formatted prompt.
