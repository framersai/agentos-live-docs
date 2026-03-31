# Interface: ApprovalRequest

Defined in: [packages/agentos/src/api/types.ts:387](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L387)

A pending approval request raised by the HITL subsystem.
Passed to `HitlConfig.handler` and emitted on the `approvalRequested` callback.

## Properties

### action

> **action**: `string`

Defined in: [packages/agentos/src/api/types.ts:403](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L403)

Short action label (e.g. tool or agent name).

***

### agent

> **agent**: `string`

Defined in: [packages/agentos/src/api/types.ts:401](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L401)

Name of the agent that triggered the approval request.

***

### context

> **context**: `object`

Defined in: [packages/agentos/src/api/types.ts:409](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L409)

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

Defined in: [packages/agentos/src/api/types.ts:405](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L405)

Human-readable description of what is being approved.

***

### details

> **details**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/types.ts:407](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L407)

Structured details about the pending action (tool args, agent config, etc.).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/api/types.ts:389](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L389)

Unique identifier for this approval request.

***

### type

> **type**: `"emergent"` \| `"tool"` \| `"agent"` \| `"strategy-override"` \| `"output"`

Defined in: [packages/agentos/src/api/types.ts:399](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L399)

What kind of action is awaiting approval.

- `"tool"` — a tool invocation.
- `"agent"` — an agent invocation.
- `"emergent"` — synthesis of a new runtime agent.
- `"output"` — the final answer before returning to the caller.
- `"strategy-override"` — the orchestrator wants to change the execution strategy.
