# Interface: ApprovalRequest

Defined in: [packages/agentos/src/api/types.ts:579](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L579)

A pending approval request raised by the HITL subsystem.
Passed to `HitlConfig.handler` and emitted on the `approvalRequested` callback.

## Properties

### action

> **action**: `string`

Defined in: [packages/agentos/src/api/types.ts:595](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L595)

Short action label (e.g. tool or agent name).

***

### agent

> **agent**: `string`

Defined in: [packages/agentos/src/api/types.ts:593](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L593)

Name of the agent that triggered the approval request.

***

### context

> **context**: `object`

Defined in: [packages/agentos/src/api/types.ts:601](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L601)

Snapshot of run context at the time the request was raised.

#### agentCalls

> **agentCalls**: [`AgentCallRecord`](AgentCallRecord.md)[]

All agent call records completed so far in this run.

#### elapsedMs

> **elapsedMs**: `number`

Wall-clock milliseconds elapsed since the run started.

#### totalCostUSD

> **totalCostUSD**: `number`

Cumulative cost in USD up to this point.

#### totalTokens

> **totalTokens**: `number`

Cumulative token count up to this point.

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/api/types.ts:597](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L597)

Human-readable description of what is being approved.

***

### details

> **details**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/types.ts:599](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L599)

Structured details about the pending action (tool args, agent config, etc.).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/api/types.ts:581](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L581)

Unique identifier for this approval request.

***

### type

> **type**: `"emergent"` \| `"tool"` \| `"agent"` \| `"strategy-override"` \| `"output"`

Defined in: [packages/agentos/src/api/types.ts:591](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L591)

What kind of action is awaiting approval.

- `"tool"` — a tool invocation.
- `"agent"` — an agent invocation.
- `"emergent"` — synthesis of a new runtime agent.
- `"output"` — the final answer before returning to the caller.
- `"strategy-override"` — the orchestrator wants to change the execution strategy.
