# Interface: ProcessingOptions

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:117](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L117)

Defines fine-grained control options for how AgentOS processes an individual turn.
These options can override system defaults or persona-specific settings for the duration
of the current request, allowing for dynamic adjustments to GMI behavior and output.

## Interface

ProcessingOptions

## Properties

### customFlags?

> `optional` **customFlags**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:129](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L129)

***

### debugMode?

> `optional` **debugMode**: `boolean`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:127](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L127)

***

### disableAdaptation?

> `optional` **disableAdaptation**: `boolean`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:126](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L126)

***

### forceNewConversation?

> `optional` **forceNewConversation**: `boolean`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:128](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L128)

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:124](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L124)

***

### maxToolCallIterations?

> `optional` **maxToolCallIterations**: `number`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:119](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L119)

***

### preferredModelId?

> `optional` **preferredModelId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:120](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L120)

***

### preferredProviderId?

> `optional` **preferredProviderId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:121](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L121)

***

### responseFormat?

> `optional` **responseFormat**: `object`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:125](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L125)

#### type

> **type**: `string`

***

### streamUICommands?

> `optional` **streamUICommands**: `boolean`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:118](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L118)

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:122](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L122)

***

### topP?

> `optional` **topP**: `number`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:123](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSInput.ts#L123)
