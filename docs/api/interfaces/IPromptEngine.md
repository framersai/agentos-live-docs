# Interface: IPromptEngine

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:470](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L470)

Core interface for the PromptEngine, responsible for intelligent and adaptive
prompt construction based on rich contextual information and persona definitions.

The PromptEngine serves as the central orchestrator for AgentOS's sophisticated
prompting system, capable of dynamically selecting contextual elements,
managing token budgets, integrating multi-modal content, and optimizing
prompts for different AI models and interaction patterns.

## Interface

IPromptEngine

## Methods

### clearCache()

> **clearCache**(`selectivePattern?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:615](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L615)

**`Async`**

Clears internal caches used by the PromptEngine (e.g., for prompt construction results
or token counts). This can be used to free memory or to force re-computation for
debugging or after configuration changes.

#### Parameters

##### selectivePattern?

`string`

Optional. A pattern or key to clear only specific
cache entries (e.g., "modelId:gpt-4o*"). If omitted, the entire cache is cleared.
The exact format of the pattern is implementation-dependent.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the cache clearing operation is complete.

***

### constructPrompt()

> **constructPrompt**(`baseComponents`, `modelTargetInfo`, `executionContext?`, `templateName?`): `Promise`\<[`PromptEngineResult`](PromptEngineResult.md)\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:517](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L517)

**`Async`**

The primary method for constructing an adaptive and contextually relevant prompt.
This orchestrates the entire pipeline: contextual element evaluation and selection,
augmentation of base components, token budget management (including truncation and
summarization), and final formatting using a model-appropriate template.

#### Parameters

##### baseComponents

`Readonly`\<[`PromptComponents`](PromptComponents.md)\>

The core, static components of the prompt,
such as system instructions, conversation history, and current user input. These are read-only
to prevent unintended modification by the method.

##### modelTargetInfo

`Readonly`\<[`ModelTargetInfo`](ModelTargetInfo.md)\>

Detailed information about the target AI model,
including its ID, provider, capabilities, token limits, and expected prompt format. This is crucial
for tailoring the prompt effectively.

##### executionContext?

`Readonly`\<[`PromptExecutionContext`](PromptExecutionContext.md)\>

Optional. The rich runtime context,
including active persona, working memory, user state, and task details. This drives the
dynamic selection and application of contextual prompt elements.

##### templateName?

`string`

Optional. The explicit name of a prompt template to use.
If not provided, the engine selects a default template based on `modelTargetInfo.promptFormatType`
or the `defaultTemplateName` from its configuration.

#### Returns

`Promise`\<[`PromptEngineResult`](PromptEngineResult.md)\>

A promise resolving to a `PromptEngineResult` object,
which contains the final formatted prompt, along with metadata about its construction,
token counts, any issues encountered, and modifications made.

#### Throws

If a non-recoverable error occurs during any stage of prompt
construction (e.g., template not found, critical component missing, tokenization failure).

***

### estimateTokenCount()

> **estimateTokenCount**(`content`, `modelId?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:556](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L556)

**`Async`**

Estimates the token count for a given piece of text, optionally using a specific model ID
to inform a more precise estimation if available (e.g., using a model-specific tokenizer).
This is used internally for token budgeting and can also be exposed as a utility.

#### Parameters

##### content

`string`

The text content for which to estimate token count.

##### modelId?

`string`

Optional. The ID of the target model. If provided, the engine may
attempt a more precise tokenization based on this model's characteristics.

#### Returns

`Promise`\<`number`\>

A promise resolving to the estimated number of tokens.

***

### evaluateCriteria()

> **evaluateCriteria**(`criteria`, `context`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:540](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L540)

**`Async`**

Evaluates whether a given set of `ContextualPromptElementCriteria` is satisfied by the current
`PromptExecutionContext`. This method is the core of the dynamic adaptation logic, determining
which contextual elements are relevant and should be incorporated into the prompt.
It supports checking various context aspects like mood, user skill, task hints, working memory values, etc.

#### Parameters

##### criteria

`Readonly`\<[`ContextualPromptElementCriteria`](ContextualPromptElementCriteria.md)\>

The criteria defined within a `ContextualPromptElement`
from the persona definition. These criteria specify the conditions under which the element applies.

##### context

`Readonly`\<[`PromptExecutionContext`](PromptExecutionContext.md)\>

The current execution context against which
the criteria are evaluated.

#### Returns

`Promise`\<`boolean`\>

A promise resolving to `true` if all conditions within the criteria
are met (respecting logical operators like AND/OR if defined in criteria), `false` otherwise.

#### Throws

If criteria evaluation encounters an unexpected error (e.g., accessing
a non-existent working memory key specified in a query).

***

### getEngineStatistics()

> **getEngineStatistics**(): `Promise`\<\{ `averageConstructionTimeMs`: `number`; `cacheStats`: \{ `currentSize`: `number`; `effectivenessRatio`: `number`; `hits`: `number`; `maxSize?`: `number`; `misses`: `number`; \}; `contextualElementUsage`: `Record`\<`string`, \{ `averageEvaluationTimeMs?`: `number`; `count`: `number`; \}\>; `errorRatePerType`: `Record`\<`string`, `number`\>; `performanceTimers`: `Record`\<`string`, \{ `averageTimeMs`: `number`; `count`: `number`; `totalTimeMs`: `number`; \}\>; `tokenCountingStats`: \{ `averageAccuracy?`: `number`; `operations`: `number`; \}; `totalPromptsConstructed`: `number`; \}\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:626](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L626)

**`Async`**

Retrieves current performance and usage statistics from the PromptEngine.
This data can be used for monitoring, optimization, and understanding engine behavior.

#### Returns

`Promise`\<\{ `averageConstructionTimeMs`: `number`; `cacheStats`: \{ `currentSize`: `number`; `effectivenessRatio`: `number`; `hits`: `number`; `maxSize?`: `number`; `misses`: `number`; \}; `contextualElementUsage`: `Record`\<`string`, \{ `averageEvaluationTimeMs?`: `number`; `count`: `number`; \}\>; `errorRatePerType`: `Record`\<`string`, `number`\>; `performanceTimers`: `Record`\<`string`, \{ `averageTimeMs`: `number`; `count`: `number`; `totalTimeMs`: `number`; \}\>; `tokenCountingStats`: \{ `averageAccuracy?`: `number`; `operations`: `number`; \}; `totalPromptsConstructed`: `number`; \}\>

A promise resolving to an object containing
various statistics like total prompts constructed, average construction time,
cache hit rate, error rates, and usage of contextual elements.

***

### initialize()

> **initialize**(`config`, `utilityAI?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:490](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L490)

**`Async`**

Initializes the PromptEngine with its configuration and an optional utility AI service.
This method must be called successfully before any prompt construction.

#### Parameters

##### config

[`PromptEngineConfig`](PromptEngineConfig.md)

The comprehensive configuration for the engine,
including template definitions, token counting strategies, history management rules,
contextual element selection parameters, performance settings, and debugging options.

##### utilityAI?

[`IPromptEngineUtilityAI`](IPromptEngineUtilityAI.md)

An optional utility AI service instance, conforming to
`IPromptEngineUtilityAI`, used for advanced content processing tasks like summarization
of conversation history or RAG context within the prompt construction pipeline.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the engine is fully initialized and ready.

#### Throws

If the provided configuration is invalid or if a critical
initialization step fails (e.g., loading default templates).

#### Example

```ts
const engine = new PromptEngine();
await engine.initialize(myAppConfig.promptEngine, myUtilityAIService);
```

***

### registerTemplate()

> **registerTemplate**(`templateName`, `templateFunction`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:572](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L572)

**`Async`**

Registers a new prompt template function with the engine. This allows for extending
the engine's capabilities to support new LLM providers, model families, or specialized
prompt formatting requirements dynamically at runtime.

#### Parameters

##### templateName

`string`

A unique name to identify the template. If a template with
this name already exists, it will be overwritten (a warning may be logged).

##### templateFunction

[`PromptTemplateFunction`](../type-aliases/PromptTemplateFunction.md)

The function that implements the template logic.
It receives `PromptComponents`, `ModelTargetInfo`, selected `ContextualPromptElement[]`,
engine `config`, and a `tokenEstimatorFn`, and must return a `FormattedPrompt`.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the template is successfully registered.

#### Throws

If the `templateName` is invalid or `templateFunction` is not a function.

***

### validatePromptConfiguration()

> **validatePromptConfiguration**(`components`, `modelTargetInfo`, `executionContext?`): `Promise`\<\{ `issues`: `object`[]; `isValid`: `boolean`; `recommendations?`: `string`[]; \}\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:588](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L588)

**`Async`**

Validates a given set of prompt components and model information against the engine's
understanding of best practices and potential issues. Useful for development, debugging
persona definitions, or providing feedback to users designing prompts.

#### Parameters

##### components

`Readonly`\<[`PromptComponents`](PromptComponents.md)\>

The prompt components to validate.

##### modelTargetInfo

`Readonly`\<[`ModelTargetInfo`](ModelTargetInfo.md)\>

Information about the target model.

##### executionContext?

`Readonly`\<[`PromptExecutionContext`](PromptExecutionContext.md)\>

Optional. The context in which these
components would be used, allowing for context-aware validation.

#### Returns

`Promise`\<\{ `issues`: `object`[]; `isValid`: `boolean`; `recommendations?`: `string`[]; \}\>

An object containing a boolean `isValid` (true if no errors), a list of `issues` found
(errors or warnings with messages and suggestions), and a list of `recommendations` for improvement.
