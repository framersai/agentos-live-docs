# Interface: ApprovalRequest

Defined in: [packages/agentos/src/api/types.ts:647](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L647)

A pending approval request raised by the HITL subsystem.
Passed to `HitlConfig.handler` and emitted on the `approvalRequested` callback.

## Properties

### action

> **action**: `string`

Defined in: [packages/agentos/src/api/types.ts:663](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L663)

Short action label (e.g. tool or agent name).

***

### agent

> **agent**: `string`

Defined in: [packages/agentos/src/api/types.ts:661](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L661)

Name of the agent that triggered the approval request.

***

### context

> **context**: `object`

Defined in: [packages/agentos/src/api/types.ts:669](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L669)

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

Defined in: [packages/agentos/src/api/types.ts:665](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L665)

Human-readable description of what is being approved.

***

### details

> **details**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/types.ts:667](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L667)

Structured details about the pending action (tool args, agent config, etc.).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/api/types.ts:649](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L649)

Unique identifier for this approval request.

***

### type

> **type**: `"emergent"` \| `"tool"` \| `"agent"` \| `"strategy-override"` \| `"output"`

Defined in: [packages/agentos/src/api/types.ts:659](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L659)

What kind of action is awaiting approval.

- `"tool"` — a tool invocation.
- `"agent"` — an agent invocation.
- `"emergent"` — synthesis of a new runtime agent.
- `"output"` — the final answer before returning to the caller.
- `"strategy-override"` — the orchestrator wants to change the execution strategy.
