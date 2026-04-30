# Interface: PromptExecutionContext

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L76)

Comprehensive execution context that drives dynamic prompt construction.
This context is assembled by the GMI and contains all relevant information
needed for intelligent contextual element selection and prompt adaptation.

## Interface

PromptExecutionContext

## Properties

### activePersona

> **activePersona**: [`IPersonaDefinition`](IPersonaDefinition.md)

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:78](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L78)

The currently active persona definition, guiding overall behavior and prompt structure.

***

### conversationSignals?

> `optional` **conversationSignals**: `string`[]

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:92](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L92)

Signals detected in the conversation (e.g., 'user_confused', 'task_completed_successfully').

***

### currentMood?

> `optional` **currentMood**: `string`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:82](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L82)

Current mood state of the GMI, which can influence tone and element selection.

***

### customContext?

> `optional` **customContext**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:94](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L94)

Custom context flags for specialized prompting scenarios or A/B testing.

***

### interactionHistorySummary?

> `optional` **interactionHistorySummary**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:98](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L98)

Historical interaction patterns that inform adaptation (e.g., preferred response styles).

#### commonTopics?

> `optional` **commonTopics**: `string`[]

#### lastInteractionTimestamp?

> `optional` **lastInteractionTimestamp**: `string`

#### problematicInteractionCount

> **problematicInteractionCount**: `number`

#### successfulInteractionCount

> **successfulInteractionCount**: `number`

***

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:90](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L90)

Target language for the response (BCP-47 code, e.g., 'en-US', 'fr-FR').

***

### sessionMetadata?

> `optional` **sessionMetadata**: `object`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:106](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L106)

Current session metadata (e.g., duration, number of turns).

#### interactionCountInSession

> **interactionCountInSession**: `number`

#### sessionDurationSeconds

> **sessionDurationSeconds**: `number`

#### userEngagementLevel?

> `optional` **userEngagementLevel**: `"low"` \| `"medium"` \| `"high"`

***

### taskComplexity?

> `optional` **taskComplexity**: `string`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:88](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L88)

Assessed complexity level of the current task (e.g., 'simple', 'complex').

***

### taskHint?

> `optional` **taskHint**: `string`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:86](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L86)

Hint about the current task type (e.g., 'coding', 'writing', 'data_analysis').

***

### userPreferences?

> `optional` **userPreferences**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:96](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L96)

User-specific preferences that affect prompting (e.g., verbosity, preferred formats).

***

### userSkillLevel?

> `optional` **userSkillLevel**: `string`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:84](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L84)

Assessed or declared user skill level (e.g., 'beginner', 'expert') relevant to the task.

***

### workingMemory

> **workingMemory**: `IWorkingMemory`

Defined in: [packages/agentos/src/core/llm/IPromptEngine.ts:80](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/llm/IPromptEngine.ts#L80)

Access to the GMI's working memory for dynamic value retrieval (e.g., user preferences, GMI traits).
