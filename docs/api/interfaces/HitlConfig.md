# Interface: HitlConfig

Defined in: [packages/agentos/src/api/types.ts:199](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L199)

Human-in-the-loop (HITL) configuration.
Gates specific lifecycle events behind an async approval handler before
the agent proceeds.

## Properties

### approvals?

> `optional` **approvals**: `object`

Defined in: [packages/agentos/src/api/types.ts:204](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L204)

Declarative approval triggers.  All are opt-in; omitting a field means
no pause at that lifecycle point.

#### beforeAgent?

> `optional` **beforeAgent**: `string`[]

Agent names whose invocations require approval before execution.

#### beforeEmergent?

> `optional` **beforeEmergent**: `boolean`

Whether emergent agent creation requires approval.

#### beforeReturn?

> `optional` **beforeReturn**: `boolean`

Whether returning the final answer requires approval.

#### beforeStrategyOverride?

> `optional` **beforeStrategyOverride**: `boolean`

Whether a runtime strategy override requires approval.

#### beforeTool?

> `optional` **beforeTool**: `string`[]

Tool names whose invocations require approval before execution.

***

### handler()?

> `optional` **handler**: (`request`) => `Promise`\<[`ApprovalDecision`](ApprovalDecision.md)\>

Defined in: [packages/agentos/src/api/types.ts:221](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L221)

Custom async handler invoked for every approval request.
Must resolve to an `ApprovalDecision` within `timeoutMs` or the
`onTimeout` policy is applied.

#### Parameters

##### request

[`ApprovalRequest`](ApprovalRequest.md)

#### Returns

`Promise`\<[`ApprovalDecision`](ApprovalDecision.md)\>

***

### onTimeout?

> `optional` **onTimeout**: `"error"` \| `"reject"` \| `"approve"`

Defined in: [packages/agentos/src/api/types.ts:230](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L230)

Policy applied when the handler does not respond within `timeoutMs`.
- `"reject"` — treat as denied; the action is blocked.
- `"approve"` — treat as approved; the action proceeds automatically.
- `"error"` — throw an error and halt the run.

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/api/types.ts:223](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L223)

Maximum milliseconds to wait for the handler to resolve. Defaults to `30_000`.
