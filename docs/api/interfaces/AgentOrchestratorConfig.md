# Interface: AgentOrchestratorConfig

Defined in: [packages/agentos/src/orchestration/turn-planner/IAgentOrchestrator.ts:18](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/turn-planner/IAgentOrchestrator.ts#L18)

Configuration options for the AgentOrchestrator.

## Properties

### defaultAgentTurnTimeoutMs?

> `optional` **defaultAgentTurnTimeoutMs**: `number`

Defined in: [packages/agentos/src/orchestration/turn-planner/IAgentOrchestrator.ts:22](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/turn-planner/IAgentOrchestrator.ts#L22)

Default timeout in milliseconds for an agent's `processTurn` or `handleToolResult` method.

#### Default

```ts
60000 (60 seconds)
```

***

### errorHandlingAgentId?

> `optional` **errorHandlingAgentId**: `string`

Defined in: [packages/agentos/src/orchestration/turn-planner/IAgentOrchestrator.ts:27](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/turn-planner/IAgentOrchestrator.ts#L27)

ID of a default "Error Handling Agent" or a meta-agent to consult if an orchestrated agent
enters an unrecoverable error state. If not set, orchestrator handles errors more directly.

***

### logToolCalls?

> `optional` **logToolCalls**: `boolean`

Defined in: [packages/agentos/src/orchestration/turn-planner/IAgentOrchestrator.ts:29](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/turn-planner/IAgentOrchestrator.ts#L29)

If true, orchestrator logs detailed information about tool calls.

***

### maxToolCallIterations?

> `optional` **maxToolCallIterations**: `number`

Defined in: [packages/agentos/src/orchestration/turn-planner/IAgentOrchestrator.ts:20](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/turn-planner/IAgentOrchestrator.ts#L20)

Maximum number of sequential tool calls allowed in a single agent turn to prevent loops.

#### Default

```ts
5
```
