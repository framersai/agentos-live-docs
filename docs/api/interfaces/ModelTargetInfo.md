# Interface: ModelTargetInfo

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:154](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L154)

Information about the target AI model that affects prompt construction.
This guides template selection, token limits, and capability-specific formatting.

## Interface

ModelTargetInfo

## Properties

### audioSupport?

> `optional` **audioSupport**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:192](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L192)

Audio input support configuration (more likely for pre-processing than direct model input).

#### requiresTranscription?

> `optional` **requiresTranscription**: `boolean`

#### supported

> **supported**: `boolean`

***

### capabilities

> **capabilities**: `string`[]

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:167](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L167)

A list of functional capabilities of the model (e.g., 'tool_use', 'vision_input', 'json_mode').

***

### maxContextTokens

> **maxContextTokens**: `number`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:160](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L160)

Maximum context length in tokens supported by the model.

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:156](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L156)

Unique identifier of the target model (e.g., "gpt-4o", "ollama/llama3").

***

### optimalContextTokens?

> `optional` **optimalContextTokens**: `number`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:165](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L165)

Optional: Optimal context length for best performance/cost-efficiency, if different from max.
Prompts might be targeted to this length.

***

### optimizationHints?

> `optional` **optimizationHints**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:197](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L197)

Model-specific hints for optimizing prompt construction or token budgeting.

#### optimalHistoryMessages?

> `optional` **optimalHistoryMessages**: `number`

#### preferredSystemPromptLength?

> `optional` **preferredSystemPromptLength**: `number`

#### tokenBudgetingStrategy?

> `optional` **tokenBudgetingStrategy**: `"aggressive_truncate"` \| `"summarize_old"` \| `"balanced"`

***

### promptFormatType

> **promptFormatType**: `string`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:175](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L175)

The type of prompt format the model expects.
'openai_chat': Standard OpenAI chat completion format (array of messages).
'anthropic_messages': Anthropic Messages API format (messages array + optional system prompt).
'generic_completion': A single string prompt for older completion-style models.
'custom': A custom format handled by a specific template.

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:158](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L158)

Identifier of the provider hosting the model (e.g., "openai", "ollama").

***

### toolSupport

> **toolSupport**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:177](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L177)

Configuration for tool/function calling support.

#### format

> **format**: `string`

Format expected by the model for tool definitions and calls.

#### maxToolsPerCall?

> `optional` **maxToolsPerCall**: `number`

Maximum number of tools that can be defined or called in a single interaction.

#### supported

> **supported**: `boolean`

***

### visionSupport?

> `optional` **visionSupport**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:185](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L185)

Vision input support configuration.

#### maxImageResolution?

> `optional` **maxImageResolution**: `string`

#### maxImages?

> `optional` **maxImages**: `number`

#### supported

> **supported**: `boolean`

#### supportedFormats?

> `optional` **supportedFormats**: `string`[]
