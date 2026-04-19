# Interface: IPromptEngineUtilityAI

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:394](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L394)

Interface for utility AI services that assist the PromptEngine with complex
content processing tasks like summarization and relevance analysis, specifically
tailored for prompt construction needs.
This is a focused interface used internally by the PromptEngine.

## Interface

IPromptEngineUtilityAI

## Methods

### analyzeContentRelevance()?

> `optional` **analyzeContentRelevance**(`content`, `executionContext`, `modelInfo`): `Promise`\<\{ `importanceScore`: `number`; `keywords?`: `string`[]; `relevanceScore`: `number`; `topics?`: `string`[]; \}\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:447](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L447)

Analyzes a piece of content for its relevance and importance within the current execution context.
This can be used to prioritize which content to include or how to emphasize it.

#### Parameters

##### content

`string`

The text content to analyze.

##### executionContext

`Readonly`\<[`PromptExecutionContext`](PromptExecutionContext.md)\>

The current execution context.

##### modelInfo

`Readonly`\<[`ModelTargetInfo`](ModelTargetInfo.md)\>

Information about the model.

#### Returns

`Promise`\<\{ `importanceScore`: `number`; `keywords?`: `string`[]; `relevanceScore`: `number`; `topics?`: `string`[]; \}\>

Scores and extracted metadata.

***

### summarizeConversationHistory()

> **summarizeConversationHistory**(`messages`, `targetTokenCount`, `modelInfo`, `preserveImportantMessages?`): `Promise`\<\{ `finalTokenCount`: `number`; `messagesSummarized`: `number`; `originalTokenCount`: `number`; `summaryMessages`: `ConversationMessage`[]; \}\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:405](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L405)

Summarizes conversation history to fit within token constraints, attempting to preserve key information.

#### Parameters

##### messages

readonly `ConversationMessage`[]

The array of conversation messages to summarize.

##### targetTokenCount

`number`

The desired maximum token count for the summary.

##### modelInfo

`Readonly`\<[`ModelTargetInfo`](ModelTargetInfo.md)\>

Information about the model for which the summary is being prepared.

##### preserveImportantMessages?

`boolean`

If true, attempt to identify and keep important messages verbatim.

#### Returns

`Promise`\<\{ `finalTokenCount`: `number`; `messagesSummarized`: `number`; `originalTokenCount`: `number`; `summaryMessages`: `ConversationMessage`[]; \}\>

A summary (which might be a single system message or a condensed list of messages),
and metadata about the summarization.

***

### summarizeRAGContext()

> **summarizeRAGContext**(`context`, `targetTokenCount`, `modelInfo`, `preserveSourceAttribution?`): `Promise`\<\{ `finalTokenCount`: `number`; `originalTokenCount`: `number`; `preservedSources?`: `string`[]; `summary`: `string`; \}\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:426](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/llm/IPromptEngine.ts#L426)

Summarizes retrieved RAG context to fit token limits, ideally preserving source attribution if possible.

#### Parameters

##### context

The RAG context to summarize.

`string` | readonly `object`[]

##### targetTokenCount

`number`

The desired maximum token count for the summarized context.

##### modelInfo

`Readonly`\<[`ModelTargetInfo`](ModelTargetInfo.md)\>

Information about the model.

##### preserveSourceAttribution?

`boolean`

If true, attempt to retain source information in the summary.

#### Returns

`Promise`\<\{ `finalTokenCount`: `number`; `originalTokenCount`: `number`; `preservedSources?`: `string`[]; `summary`: `string`; \}\>

The summarized text and metadata.
