# Type Alias: PromptTemplateFunction()

> **PromptTemplateFunction** = (`components`, `modelInfo`, `selectedContextualElements`, `config`, `estimateTokenCountFn`) => `Promise`\<[`FormattedPrompt`](FormattedPrompt.md)\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:372](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/llm/IPromptEngine.ts#L372)

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
