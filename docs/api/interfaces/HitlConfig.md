# Interface: HitlConfig

Defined in: [packages/agentos/src/api/types.ts:205](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L205)

Human-in-the-loop (HITL) configuration.
Gates specific lifecycle events behind an async approval handler before
the agent proceeds.

## Properties

### approvals?

> `optional` **approvals**: `object`

Defined in: [packages/agentos/src/api/types.ts:210](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L210)

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

### guardrailOverride?

> `optional` **guardrailOverride**: `boolean`

Defined in: [packages/agentos/src/api/types.ts:252](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L252)

Run guardrails AFTER HITL approval to catch destructive actions.

When enabled (default), even after a tool call is approved by the HITL
handler (auto-approve, LLM judge, or human), the configured guardrails
run a final safety check against the tool call arguments. If any
guardrail returns `action: 'block'`, the approval is overridden and the
tool call is denied.

Set to `false` to disable this safety net and give full autonomy to the
HITL handler's decision.

#### Default

```ts
true
```

***

### handler()?

> `optional` **handler**: (`request`) => `Promise`\<[`ApprovalDecision`](ApprovalDecision.md)\>

Defined in: [packages/agentos/src/api/types.ts:227](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L227)

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

Defined in: [packages/agentos/src/api/types.ts:236](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L236)

Policy applied when the handler does not respond within `timeoutMs`.
- `"reject"` — treat as denied; the action is blocked.
- `"approve"` — treat as approved; the action proceeds automatically.
- `"error"` — throw an error and halt the run.

***

### postApprovalGuardrails?

> `optional` **postApprovalGuardrails**: `string`[]

Defined in: [packages/agentos/src/api/types.ts:263](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L263)

Guardrail IDs to run as a post-approval safety check.

Only evaluated when [guardrailOverride](#guardrailoverride) is not `false`. These
guardrails are invoked after the HITL handler approves a tool call and
can veto the approval if they detect destructive patterns.

#### Default

```ts
['pii-redaction', 'code-safety']
```

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/api/types.ts:229](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L229)

Maximum milliseconds to wait for the handler to resolve. Defaults to `30_000`.
