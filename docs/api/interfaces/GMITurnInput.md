# Interface: GMITurnInput

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:197](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/IGMI.ts#L197)

Represents a single turn of input to the GMI.

## Interface

GMITurnInput

## Properties

### content

> **content**: `string` \| `Record`\<`string`, `any`\> \| [`ToolCallResult`](ToolCallResult.md) \| [`ToolCallResult`](ToolCallResult.md)[] \| `Record`\<`string`, `any`\>[]

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:202](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/IGMI.ts#L202)

***

### interactionId

> **interactionId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:198](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/IGMI.ts#L198)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\> & `object`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:206](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/IGMI.ts#L206)

#### Type Declaration

##### capabilityDiscovery?

> `optional` **capabilityDiscovery**: \{ `fallbackReason?`: `string`; `kind?`: `string`; `promptContext?`: `string`; `query?`: `string`; `result?`: `any`; `selectedToolNames?`: `string`[]; \} \| `null`

Optional capability discovery payload for this turn.
`result` is intentionally `any` to avoid hard-coupling the GMI contract to
a specific discovery-engine type.

##### conversationHistoryForPrompt?

> `optional` **conversationHistoryForPrompt**: `any`[]

Optional conversation history snapshot to use for prompt construction.
When provided, the GMI should prefer this over any internal ephemeral history so
persona switches share conversation memory.

##### executionPolicy?

> `optional` **executionPolicy**: \{ `plannerVersion?`: `string`; `toolFailureMode?`: `"fail_open"` \| `"fail_closed"`; `toolSelectionMode?`: `"all"` \| `"discovered"`; \} \| `null`

Optional planner-selected execution policy for this turn.

##### explicitPersonaSwitchId?

> `optional` **explicitPersonaSwitchId**: `string`

##### options?

> `optional` **options**: `Partial`\<[`ModelCompletionOptions`](ModelCompletionOptions.md) & `object`\>

##### promptProfile?

> `optional` **promptProfile**: \{ `id`: `string`; `reason?`: `string`; `systemInstructions?`: `string`; \} \| `null`

Optional prompt-profile selection for this turn (e.g., concise/deep_dive/planner/reviewer).

##### rollingSummary?

> `optional` **rollingSummary**: \{ `json?`: `any`; `text?`: `string`; \} \| `null`

Optional rolling summary block (text + structured metadata) maintained by ConversationContext
and injected into prompts for long conversations.

##### userApiKeys?

> `optional` **userApiKeys**: `Record`\<`string`, `string`\>

##### userFeedback?

> `optional` **userFeedback**: `any`

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:200](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/IGMI.ts#L200)

***

### taskContextOverride?

> `optional` **taskContextOverride**: `Partial`\<[`TaskContext`](TaskContext.md)\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:205](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/IGMI.ts#L205)

***

### timestamp?

> `optional` **timestamp**: `Date`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:203](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/IGMI.ts#L203)

***

### type

> **type**: [`GMIInteractionType`](../enumerations/GMIInteractionType.md)

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:201](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/IGMI.ts#L201)

***

### userContextOverride?

> `optional` **userContextOverride**: `Partial`\<[`UserContext`](UserContext.md)\>

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:204](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/IGMI.ts#L204)

***

### userId

> **userId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/IGMI.ts:199](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/cognitive_substrate/IGMI.ts#L199)
