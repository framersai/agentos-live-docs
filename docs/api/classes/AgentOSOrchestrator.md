# Class: AgentOSOrchestrator

Defined in: [packages/agentos/src/api/runtime/AgentOSOrchestrator.ts:310](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/AgentOSOrchestrator.ts#L310)

## Description

The `AgentOSOrchestrator` is responsible for unifying the request handling
pipeline for AgentOS. It bridges the high-level `AgentOSInput` from the
public API to the internal `GMI` processing logic. It ensures that user
requests are routed to the correct GMI, manages the GMI's turn lifecycle,
and handles the complex dance of tool calls and streaming responses.

## Constructors

### Constructor

> **new AgentOSOrchestrator**(): `AgentOSOrchestrator`

Defined in: [packages/agentos/src/api/runtime/AgentOSOrchestrator.ts:330](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/AgentOSOrchestrator.ts#L330)

#### Returns

`AgentOSOrchestrator`

## Methods

### broadcastWorkflowUpdate()

> **broadcastWorkflowUpdate**(`update`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/runtime/AgentOSOrchestrator.ts:482](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/AgentOSOrchestrator.ts#L482)

#### Parameters

##### update

[`WorkflowProgressUpdate`](../interfaces/WorkflowProgressUpdate.md)

#### Returns

`Promise`\<`void`\>

***

### initialize()

> **initialize**(`config`, `dependencies`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/runtime/AgentOSOrchestrator.ts:343](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/AgentOSOrchestrator.ts#L343)

**`Async`**

Initializes the AgentOSOrchestrator with its configuration and dependencies.
This method must be called successfully before orchestrating any turns.

#### Parameters

##### config

[`AgentOSOrchestratorConfig`](../interfaces/AgentOSOrchestratorConfig.md)

Configuration settings for the orchestrator.

##### dependencies

[`AgentOSOrchestratorDependencies`](../interfaces/AgentOSOrchestratorDependencies.md)

Required services.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when initialization is complete.

#### Throws

If any critical dependency is missing or config is invalid.

***

### orchestrateResumedToolResults()

> **orchestrateResumedToolResults**(`pendingRequest`, `toolResults`, `options?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/runtime/AgentOSOrchestrator.ts:608](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/AgentOSOrchestrator.ts#L608)

#### Parameters

##### pendingRequest

[`AgentOSPendingExternalToolRequest`](../interfaces/AgentOSPendingExternalToolRequest.md)

##### toolResults

[`AgentOSToolResultInput`](../interfaces/AgentOSToolResultInput.md)[]

##### options?

[`AgentOSResumeExternalToolRequestOptions`](../interfaces/AgentOSResumeExternalToolRequestOptions.md) = `{}`

#### Returns

`Promise`\<`string`\>

***

### orchestrateToolResult()

> **orchestrateToolResult**(`agentOSStreamId`, `toolCallId`, `toolName`, `toolOutput`, `isSuccess`, `errorMessage?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/runtime/AgentOSOrchestrator.ts:1167](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/AgentOSOrchestrator.ts#L1167)

Handles the result of an external tool execution, feeding it back into the
relevant GMI instance for continued processing.
Delegates to ExternalToolResultHandler.

#### Parameters

##### agentOSStreamId

`string`

##### toolCallId

`string`

##### toolName

`string`

##### toolOutput

`any`

##### isSuccess

`boolean`

##### errorMessage?

`string`

#### Returns

`Promise`\<`void`\>

***

### orchestrateToolResults()

> **orchestrateToolResults**(`agentOSStreamId`, `toolResults`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/runtime/AgentOSOrchestrator.ts:1185](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/AgentOSOrchestrator.ts#L1185)

Handles one or more external tool results in batch.
Delegates to ExternalToolResultHandler.

#### Parameters

##### agentOSStreamId

`string`

##### toolResults

[`AgentOSToolResultInput`](../interfaces/AgentOSToolResultInput.md)[]

#### Returns

`Promise`\<`void`\>

***

### orchestrateTurn()

> **orchestrateTurn**(`input`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/api/runtime/AgentOSOrchestrator.ts:539](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/AgentOSOrchestrator.ts#L539)

**`Async`**

Orchestrates a full logical turn for a user request.
This involves managing GMI interaction, tool calls, and streaming responses.
Instead of directly yielding, it uses the StreamingManager to push chunks.

#### Parameters

##### input

[`AgentOSInput`](../interfaces/AgentOSInput.md)

The comprehensive input for the current turn.

#### Returns

`Promise`\<`string`\>

The ID of the stream to which responses will be pushed.

#### Throws

If critical initialization or setup fails.

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/runtime/AgentOSOrchestrator.ts:1205](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/AgentOSOrchestrator.ts#L1205)

**`Async`**

Shuts down the AgentOSOrchestrator.
Currently, this mainly involves clearing active stream contexts.
Dependencies like GMIManager are assumed to be shut down by AgentOS.

#### Returns

`Promise`\<`void`\>

A promise that resolves when shutdown is complete.
