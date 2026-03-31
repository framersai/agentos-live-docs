# Interface: ApprovalRequest

Defined in: [packages/agentos/src/api/types.ts:354](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L354)

A pending approval request raised by the HITL subsystem.
Passed to `HitlConfig.handler` and emitted on the `approvalRequested` callback.

## Properties

### action

> **action**: `string`

Defined in: [packages/agentos/src/api/types.ts:370](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L370)

Short action label (e.g. tool or agent name).

***

### agent

> **agent**: `string`

Defined in: [packages/agentos/src/api/types.ts:368](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L368)

Name of the agent that triggered the approval request.

***

### context

> **context**: `object`

Defined in: [packages/agentos/src/api/types.ts:376](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L376)

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

Defined in: [packages/agentos/src/api/types.ts:372](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L372)

Human-readable description of what is being approved.

***

### details

> **details**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/types.ts:374](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L374)

Structured details about the pending action (tool args, agent config, etc.).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/api/types.ts:356](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L356)

Unique identifier for this approval request.

***

### type

> **type**: `"emergent"` \| `"tool"` \| `"agent"` \| `"strategy-override"` \| `"output"`

Defined in: [packages/agentos/src/api/types.ts:366](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L366)

What kind of action is awaiting approval.

- `"tool"` — a tool invocation.
- `"agent"` — an agent invocation.
- `"emergent"` — synthesis of a new runtime agent.
- `"output"` — the final answer before returning to the caller.
- `"strategy-override"` — the orchestrator wants to change the execution strategy.
