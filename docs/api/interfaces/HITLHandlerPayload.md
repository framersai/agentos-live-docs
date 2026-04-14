# Interface: HITLHandlerPayload

Defined in: [packages/agentos/src/extensions/types.ts:294](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/types.ts#L294)

HITL handler payload for custom human interaction handlers.
Handlers receive human interaction requests and manage the approval/response flow.

## Properties

### checkHealth()?

> `optional` **checkHealth**: () => `Promise`\<\{ `healthy`: `boolean`; `message?`: `string`; \}\>

Defined in: [packages/agentos/src/extensions/types.ts:309](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/types.ts#L309)

Optional function to check handler health/connectivity

#### Returns

`Promise`\<\{ `healthy`: `boolean`; `message?`: `string`; \}\>

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:298](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/types.ts#L298)

Handler description

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:296](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/types.ts#L296)

Handler name (e.g., 'slack-approvals', 'email-notifications', 'ui-modal')

***

### sendNotification()

> **sendNotification**: (`notification`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:302](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/types.ts#L302)

Handler function for sending notifications

#### Parameters

##### notification

###### requestId

`string`

###### summary

`string`

###### type

`string`

###### urgency

`string`

#### Returns

`Promise`\<`void`\>

***

### supportedTypes

> **supportedTypes**: (`"approval"` \| `"clarification"` \| `"edit"` \| `"escalation"` \| `"checkpoint"`)[]

Defined in: [packages/agentos/src/extensions/types.ts:300](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/types.ts#L300)

Types of interactions this handler supports
