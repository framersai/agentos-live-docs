# Interface: AgentOSInput

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:79](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L79)

## Properties

### agencyRequest?

> `optional` **agencyRequest**: [`AgencyInvocationRequest`](AgencyInvocationRequest.md)

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:103](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L103)

***

### audioInput?

> `optional` **audioInput**: [`AudioInputData`](AudioInputData.md)

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:86](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L86)

***

### conversationId?

> `optional` **conversationId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:96](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L96)

***

### detectedLanguages?

> `optional` **detectedLanguages**: `object`[]

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:91](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L91)

Optional detected languages supplied externally (highest confidence first).

#### code

> **code**: `string`

#### confidence

> **confidence**: `number`

***

### disabledSessionSkillIds?

> `optional` **disabledSessionSkillIds**: `string`[]

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:107](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L107)

***

### languageHint?

> `optional` **languageHint**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:89](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L89)

Optional explicit language hint from UI (BCP-47 or ISO 639-1).

***

### memoryControl?

> `optional` **memoryControl**: [`AgentOSMemoryControl`](AgentOSMemoryControl.md)

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:101](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L101)

Optional memory control input. Stored in conversation metadata so settings persist across turns.
Use this to disable long-term memory for a conversation or enable user/org scope when desired.

***

### options?

> `optional` **options**: [`ProcessingOptions`](ProcessingOptions.md)

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:104](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L104)

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:82](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L82)

Optional organization context used for org-scoped memory + multi-tenant routing.

***

### selectedPersonaId?

> `optional` **selectedPersonaId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:87](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L87)

***

### sessionId

> **sessionId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:83](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L83)

***

### skillPromptContext?

> `optional` **skillPromptContext**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:106](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L106)

***

### targetLanguage?

> `optional` **targetLanguage**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:93](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L93)

Optional target language override (skips negotiation if supported).

***

### textInput

> **textInput**: `string` \| `null`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:84](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L84)

***

### userApiKeys?

> `optional` **userApiKeys**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:94](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L94)

***

### userContextOverride?

> `optional` **userContextOverride**: `Partial`\<[`UserContext`](UserContext.md)\>

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:105](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L105)

***

### userFeedback?

> `optional` **userFeedback**: [`UserFeedbackPayload`](UserFeedbackPayload.md)

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:95](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L95)

***

### userId

> **userId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:80](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L80)

***

### visionInputs?

> `optional` **visionInputs**: [`VisionInputData`](VisionInputData.md)[]

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:85](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L85)

***

### workflowRequest?

> `optional` **workflowRequest**: [`WorkflowInvocationRequest`](WorkflowInvocationRequest.md)

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:102](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSInput.ts#L102)
