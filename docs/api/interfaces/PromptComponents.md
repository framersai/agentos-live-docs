# Interface: PromptComponents

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:119](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L119)

Core components that form the foundation of any prompt construction.
These are gathered from various sources (GMI state, user input, RAG) and then
augmented with dynamically selected contextual elements.

## Interface

PromptComponents

## Properties

### assembledMemoryContext?

> `optional` **assembledMemoryContext**: [`AssembledMemoryContext`](AssembledMemoryContext.md)

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:142](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L142)

Assembled cognitive memory context (personality-affected, token-budgeted). Merged with retrievedContext by the prompt template.

***

### audioInput?

> `optional` **audioInput**: [`AudioInputData`](AudioInputData.md)

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:129](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L129)

Audio input data references if the model or a pre-processing step handles audio.

***

### conversationHistory?

> `optional` **conversationHistory**: `ConversationMessage`[]

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:123](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L123)

Conversation history messages, typically an array of `Message` objects.

***

### customComponents?

> `optional` **customComponents**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:146](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L146)

Additional custom components that templates might use.

***

### retrievedContext?

> `optional` **retrievedContext**: `string` \| `object`[]

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:138](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L138)

Retrieved context from a RAG system, to be incorporated into the prompt.

***

### systemPrompts?

> `optional` **systemPrompts**: `object`[]

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:121](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L121)

System-level prompts with optional priority ordering. Higher priority usually means placed earlier or given more weight.

#### content

> **content**: `string`

#### priority?

> `optional` **priority**: `number`

#### source?

> `optional` **source**: `string`

***

### taskSpecificData?

> `optional` **taskSpecificData**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:144](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L144)

Task-specific data or parameters that need to be included in the prompt.

***

### tools?

> `optional` **tools**: [`ITool`](ITool.md)\<`any`, `any`\>[]

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:131](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L131)

Available tools and their schemas, for models that support function/tool calling.

***

### toolSchemas?

> `optional` **toolSchemas**: `Record`\<`string`, `unknown`\>[]

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:136](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L136)

Pre-formatted tool/function schemas that should be forwarded to the model as-is.
Useful when upstream logic has already normalized the schema definitions.

***

### userInput?

> `optional` **userInput**: `string` \| `null`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:125](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L125)

Current user input text.

***

### visionInputs?

> `optional` **visionInputs**: [`VisionInputData`](VisionInputData.md)[]

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:127](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/core/llm/IPromptEngine.ts#L127)

Visual inputs (images) if the target model supports vision.
