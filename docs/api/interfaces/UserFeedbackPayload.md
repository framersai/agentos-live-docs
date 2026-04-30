# Interface: UserFeedbackPayload

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:26](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L26)

Defines the structure for user-provided feedback on a GMI's performance or a specific message.
This feedback is crucial for the GMI's adaptive learning capabilities and for system analytics.

## Interface

UserFeedbackPayload

## Properties

### correctedContent?

> `optional` **correctedContent**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:31](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L31)

***

### customData?

> `optional` **customData**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:33](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L33)

***

### rating?

> `optional` **rating**: `"positive"` \| `"negative"` \| `"neutral"`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:27](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L27)

***

### score?

> `optional` **score**: `number`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:28](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L28)

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:30](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L30)

***

### targetMessageId?

> `optional` **targetMessageId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:32](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L32)

***

### text?

> `optional` **text**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:29](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L29)
