# Interface: IAgentOrchestrator

Defined in: [packages/agentos/src/orchestration/turn-planner/IAgentOrchestrator.ts:39](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/turn-planner/IAgentOrchestrator.ts#L39)

## Interface

IAgentOrchestrator
Defines the contract for the central service that coordinates agent execution.
This name IAgentOrchestrator seems to be for a more generic agent orchestrator,
while the file being fixed is AgentOSOrchestrator.ts which is more GMI-focused.
Assuming AgentOrchestratorConfig here is the one intended for AgentOSOrchestrator.

## Properties

### orchestratorId

> `readonly` **orchestratorId**: `string`

Defined in: [packages/agentos/src/orchestration/turn-planner/IAgentOrchestrator.ts:41](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/turn-planner/IAgentOrchestrator.ts#L41)

A unique identifier for this orchestrator implementation.

## Methods

### initialize()

> **initialize**(`config`, `dependencies`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/turn-planner/IAgentOrchestrator.ts:48](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/turn-planner/IAgentOrchestrator.ts#L48)

Initializes the agent orchestrator.

#### Parameters

##### config

[`AgentOrchestratorConfig`](AgentOrchestratorConfig.md)

Orchestrator-specific configuration.

##### dependencies

[`AgentOSOrchestratorDependencies`](AgentOSOrchestratorDependencies.md)

Other necessary services.

#### Returns

`Promise`\<`void`\>

***

### initiateAgentHandoff()?

> `optional` **initiateAgentHandoff**(`conversationContext`, `currentAgentOutput`, `nextAgentId`, `handoffData?`): `Promise`\<`AgentOutput`\>

Defined in: [packages/agentos/src/orchestration/turn-planner/IAgentOrchestrator.ts:56](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/turn-planner/IAgentOrchestrator.ts#L56)

#### Parameters

##### conversationContext

`ConversationContext`

##### currentAgentOutput

`AgentOutput`

##### nextAgentId

`string`

##### handoffData?

`any`

#### Returns

`Promise`\<`AgentOutput`\>

***

### processAgentTurn()

> **processAgentTurn**(`conversationContext`, `userInput`, `targetAgentId`): `Promise`\<`AgentOutput`\>

Defined in: [packages/agentos/src/orchestration/turn-planner/IAgentOrchestrator.ts:50](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/turn-planner/IAgentOrchestrator.ts#L50)

#### Parameters

##### conversationContext

`ConversationContext`

##### userInput

`string` | `null`

##### targetAgentId

`string`

#### Returns

`Promise`\<`AgentOutput`\>
