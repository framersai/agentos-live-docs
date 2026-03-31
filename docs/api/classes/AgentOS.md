# Class: AgentOS

Defined in: [packages/agentos/src/api/AgentOS.ts:762](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L762)

## Implements

## Description

The `AgentOS` class is the SOTA public-facing service facade for the entire AI agent platform.
It provides a unified API for interacting with the system, managing the lifecycle of core
components, and orchestrating complex AI interactions. This class ensures that all
operations adhere to the defined architectural tenets, including robust error handling,
comprehensive documentation, and strict type safety.

## Implements

- `IAgentOS`

## Constructors

### Constructor

> **new AgentOS**(`logger?`): `AgentOS`

Defined in: [packages/agentos/src/api/AgentOS.ts:794](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L794)

Constructs an `AgentOS` instance. The instance is not operational until
`initialize()` is called and successfully completes.

#### Parameters

##### logger?

[`ILogger`](../interfaces/ILogger.md) = `...`

#### Returns

`AgentOS`

## Methods

### applyWorkflowTaskUpdates()

> **applyWorkflowTaskUpdates**(`workflowId`, `updates`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1892](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1892)

Applies task-level updates to a workflow instance.

#### Parameters

##### workflowId

`string`

The workflow instance ID.

##### updates

[`WorkflowTaskUpdate`](../interfaces/WorkflowTaskUpdate.md)[]

Array of task updates to apply.

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Updated workflow instance or null if not found.

#### Implementation of

`IAgentOS.applyWorkflowTaskUpdates`

***

### getConversationHistory()

> **getConversationHistory**(`conversationId`, `userId`): `Promise`\<`ConversationContext` \| `null`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1942](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1942)

**`Async`**

Retrieves the conversation history for a specific conversation ID, subject to user authorization.

#### Parameters

##### conversationId

`string`

The unique identifier of the conversation to retrieve.

##### userId

`string`

The ID of the user requesting the history. Authorization checks
are performed to ensure the user has access to this conversation.

#### Returns

`Promise`\<`ConversationContext` \| `null`\>

A promise that resolves to the
`ConversationContext` object if found and accessible, or `null` otherwise.

#### Throws

If the service is not initialized or if a critical error
occurs during history retrieval (permission errors might result in `null` or specific error type).

#### Implementation of

`IAgentOS.getConversationHistory`

***

### getConversationManager()

> **getConversationManager**(): [`ConversationManager`](ConversationManager.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:1455](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1455)

Explicit runtime getters for devtools integrations such as AgentOS Workbench.

#### Returns

[`ConversationManager`](ConversationManager.md)

#### Implementation of

`IAgentOS.getConversationManager`

***

### getExtensionManager()

> **getExtensionManager**(): [`ExtensionManager`](ExtensionManager.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:1465](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1465)

#### Returns

[`ExtensionManager`](ExtensionManager.md)

#### Implementation of

`IAgentOS.getExtensionManager`

***

### getExternalToolRegistry()

> **getExternalToolRegistry**(): [`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md) \| `undefined`

Defined in: [packages/agentos/src/api/AgentOS.ts:1475](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1475)

#### Returns

[`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md) \| `undefined`

#### Implementation of

`IAgentOS.getExternalToolRegistry`

***

### getGMIManager()

> **getGMIManager**(): [`GMIManager`](GMIManager.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:1460](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1460)

#### Returns

[`GMIManager`](GMIManager.md)

#### Implementation of

`IAgentOS.getGMIManager`

***

### getModelProviderManager()

> **getModelProviderManager**(): [`AIModelProviderManager`](AIModelProviderManager.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:1485](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1485)

#### Returns

[`AIModelProviderManager`](AIModelProviderManager.md)

#### Implementation of

`IAgentOS.getModelProviderManager`

***

### getPendingExternalToolRequest()

> **getPendingExternalToolRequest**(`conversationId`, `userId`): `Promise`\<[`AgentOSPendingExternalToolRequest`](../interfaces/AgentOSPendingExternalToolRequest.md) \| `null`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1985](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1985)

Returns the pending external-tool pause snapshot for a conversation, if one
was persisted during an actionable TOOL_CALL_REQUEST pause.

#### Parameters

##### conversationId

`string`

##### userId

`string`

#### Returns

`Promise`\<[`AgentOSPendingExternalToolRequest`](../interfaces/AgentOSPendingExternalToolRequest.md) \| `null`\>

#### Implementation of

`IAgentOS.getPendingExternalToolRequest`

***

### getRuntimeSnapshot()

> **getRuntimeSnapshot**(): `Promise`\<[`AgentOSRuntimeSnapshot`](../interfaces/AgentOSRuntimeSnapshot.md)\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1352](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1352)

Returns a serializable runtime/devtools snapshot of the initialized AgentOS instance.

#### Returns

`Promise`\<[`AgentOSRuntimeSnapshot`](../interfaces/AgentOSRuntimeSnapshot.md)\>

#### Implementation of

`IAgentOS.getRuntimeSnapshot`

***

### getToolOrchestrator()

> **getToolOrchestrator**(): `IToolOrchestrator`

Defined in: [packages/agentos/src/api/AgentOS.ts:1470](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1470)

#### Returns

`IToolOrchestrator`

#### Implementation of

`IAgentOS.getToolOrchestrator`

***

### getWorkflow()

> **getWorkflow**(`workflowId`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1866](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1866)

Retrieves a workflow instance by its identifier.

#### Parameters

##### workflowId

`string`

The workflow instance ID.

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

The workflow instance or null if not found.

#### Implementation of

`IAgentOS.getWorkflow`

***

### getWorkflowProgress()

> **getWorkflowProgress**(`workflowId`, `sinceTimestamp?`): `Promise`\<[`WorkflowProgressUpdate`](../interfaces/WorkflowProgressUpdate.md) \| `null`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1876](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1876)

Retrieves workflow progress details, including recent events.

#### Parameters

##### workflowId

`string`

The workflow instance ID.

##### sinceTimestamp?

`string`

Optional timestamp to get events since.

#### Returns

`Promise`\<[`WorkflowProgressUpdate`](../interfaces/WorkflowProgressUpdate.md) \| `null`\>

Progress details or null if not found.

#### Implementation of

`IAgentOS.getWorkflowProgress`

***

### handleToolResult()

> **handleToolResult**(`streamId`, `toolCallId`, `toolName`, `toolOutput`, `isSuccess`, `errorMessage?`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1743](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1743)

**`Async`** **`Generator`**

Handles the result of an externally executed tool and continues the agent interaction.
This method is an asynchronous generator that yields new [AgentOSResponse](../type-aliases/AgentOSResponse.md) chunks
resulting from the GMI processing the tool's output.

It functions similarly to `processRequest` by:
1. Delegating to [AgentOSOrchestrator.orchestrateToolResult](AgentOSOrchestrator.md#orchestratetoolresult), which pushes new
chunks to the *existing* `streamId`.
2. Registering a temporary, request-scoped stream client (bridge) to this `streamId`.
3. Yielding [AgentOSResponse](../type-aliases/AgentOSResponse.md) chunks received by this bridge.
4. Ensuring the bridge client is deregistered.

#### Parameters

##### streamId

`string`

The ID of the existing stream to which the tool result pertains.

##### toolCallId

`string`

The ID of the specific tool call being responded to.

##### toolName

`string`

The name of the tool that was executed.

##### toolOutput

`any`

The output data from the tool execution.

##### isSuccess

`boolean`

Indicates whether the tool execution was successful.

##### errorMessage?

`string`

An error message if `isSuccess` is `false`.

#### Returns

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

An asynchronous generator for new response chunks.

#### Yields

New response chunks from the agent after processing the tool result.

#### Throws

If a critical error occurs during setup or if the service is not initialized.
Errors during GMI processing are yielded as `AgentOSErrorChunk`s.

#### Implementation of

`IAgentOS.handleToolResult`

***

### handleToolResults()

> **handleToolResults**(`streamId`, `toolResults`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1762](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1762)

Handles a batch of externally executed tool results that belong to the same
paused stream and continues the agent interaction once.

#### Parameters

##### streamId

`string`

The original stream ID associated with the paused request.

##### toolResults

[`AgentOSToolResultInput`](../interfaces/AgentOSToolResultInput.md)[]

Ordered tool results to apply to the paused turn.

#### Returns

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

An async generator that yields
response chunks after processing the tool results.

#### Throws

If the `streamId` is invalid or the tool result batch is empty.

#### Implementation of

`IAgentOS.handleToolResults`

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:809](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L809)

**`Async`**

Initializes the `AgentOS` service and all its core dependencies.
This method must be called and successfully awaited before any other operations
can be performed on the `AgentOS` instance. It sets up configurations,
instantiates managers, and prepares the system for operation.

#### Parameters

##### config

[`AgentOSConfig`](../interfaces/AgentOSConfig.md)

The comprehensive configuration object for AgentOS.

#### Returns

`Promise`\<`void`\>

A promise that resolves when initialization is complete.

#### Throws

If configuration validation fails or if any critical
dependency fails to initialize.

#### Implementation of

`IAgentOS.initialize`

***

### listAvailablePersonas()

> **listAvailablePersonas**(`userId?`): `Promise`\<`Partial`\<[`IPersonaDefinition`](../interfaces/IPersonaDefinition.md)\>[]\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1912](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1912)

**`Async`**

Lists all available personas that the requesting user (if specified) has access to.

#### Parameters

##### userId?

`string`

Optional. The ID of the user making the request. If provided,
persona availability will be filtered based on the user's subscription tier and permissions.
If omitted, all generally public personas might be listed (behavior determined by `GMIManager`).

#### Returns

`Promise`\<`Partial`\<[`IPersonaDefinition`](../interfaces/IPersonaDefinition.md)\>[]\>

A promise that resolves to an array of
persona definitions (or partial definitions suitable for public listing).

#### Throws

If the service is not initialized.

#### Implementation of

`IAgentOS.listAvailablePersonas`

***

### listExternalToolsForLLM()

> **listExternalToolsForLLM**(): `ToolDefinitionForLLM`[]

Defined in: [packages/agentos/src/api/AgentOS.ts:1480](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1480)

#### Returns

`ToolDefinitionForLLM`[]

#### Implementation of

`IAgentOS.listExternalToolsForLLM`

***

### listWorkflowDefinitions()

> **listWorkflowDefinitions**(): [`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)[]

Defined in: [packages/agentos/src/api/AgentOS.ts:1845](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1845)

Lists registered workflow definitions available via the extension manager.

#### Returns

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)[]

Array of available workflow definitions.

#### Implementation of

`IAgentOS.listWorkflowDefinitions`

***

### listWorkflows()

> **listWorkflows**(`options?`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)[]\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1871](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1871)

Lists workflow instances matching the provided filters.

#### Parameters

##### options?

[`WorkflowQueryOptions`](../interfaces/WorkflowQueryOptions.md)

Optional query filters.

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)[]\>

Array of matching workflow instances.

#### Implementation of

`IAgentOS.listWorkflows`

***

### processRequest()

> **processRequest**(`input`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1516](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1516)

**`Async`** **`Generator`**

Processes a single interaction turn with an AI agent. This is an asynchronous generator
that yields [AgentOSResponse](../type-aliases/AgentOSResponse.md) chunks as they become available.

This method orchestrates:
1. Retrieval or creation of a [StreamId](../type-aliases/StreamId.md) via the [AgentOSOrchestrator](AgentOSOrchestrator.md).
2. Registration of a temporary, request-scoped stream client to the internal streaming manager.
3. Yielding of [AgentOSResponse](../type-aliases/AgentOSResponse.md) chunks received by this client.
4. Ensuring the temporary client is deregistered upon completion or error.

The underlying [AgentOSOrchestrator](AgentOSOrchestrator.md) handles the GMI interaction and pushes
chunks to the internal streaming manager. This method acts as the bridge to make these
chunks available as an `AsyncGenerator` to the caller (e.g., an API route handler).

#### Parameters

##### input

[`AgentOSInput`](../interfaces/AgentOSInput.md)

The comprehensive input for the current interaction turn.

#### Returns

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

An asynchronous generator
that yields response chunks. The generator completes when the interaction is finalized
or a terminal error occurs.

#### Yields

Chunks of the agent's response as they are processed.

#### Throws

If a critical error occurs during setup or if the
service is not initialized. Errors during GMI processing are typically yielded as
`AgentOSErrorChunk`s.

#### Implementation of

`IAgentOS.processRequest`

***

### receiveFeedback()

> **receiveFeedback**(`userId`, `sessionId`, `personaId`, `feedbackPayload`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:2092](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L2092)

**`Async`**

Receives and processes user feedback related to a specific interaction or persona.
The exact handling of feedback (e.g., storage, GMI adaptation) is determined by
the configured `GMIManager` and underlying GMI implementations.

#### Parameters

##### userId

`string`

The ID of the user providing the feedback.

##### sessionId

`string`

The session ID to which the feedback pertains.

##### personaId

`string`

The persona ID involved in the interaction being reviewed.

##### feedbackPayload

[`UserFeedbackPayload`](../interfaces/UserFeedbackPayload.md)

The structured feedback data.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the feedback has been processed.

#### Throws

If the service is not initialized or if an error occurs
during feedback processing (e.g., `GMIErrorCode.GMI_FEEDBACK_ERROR`).

#### Implementation of

`IAgentOS.receiveFeedback`

***

### resumeExternalToolRequest()

> **resumeExternalToolRequest**(`pendingRequest`, `toolResults`, `options?`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:2000](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L2000)

Resumes a previously persisted external-tool pause after restart using the
saved pause snapshot and the host-provided tool results.

Hosts can re-assert runtime-only organization context through `options`
when the resumed turn needs organization-scoped memory or tenant routing.

#### Parameters

##### pendingRequest

[`AgentOSPendingExternalToolRequest`](../interfaces/AgentOSPendingExternalToolRequest.md)

##### toolResults

[`AgentOSToolResultInput`](../interfaces/AgentOSToolResultInput.md)[]

##### options?

[`AgentOSResumeExternalToolRequestOptions`](../interfaces/AgentOSResumeExternalToolRequestOptions.md) = `{}`

#### Returns

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

#### Implementation of

`IAgentOS.resumeExternalToolRequest`

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:2132](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L2132)

**`Async`**

Initiates a graceful shutdown of the `AgentOS` service and all its components.
This includes shutting down managers, clearing caches, and releasing resources.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the shutdown sequence is complete.

#### Throws

If an error occurs during the shutdown of any critical component.

#### Implementation of

`IAgentOS.shutdown`

***

### startWorkflow()

> **startWorkflow**(`definitionId`, `input`, `options?`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1850](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1850)

Starts a workflow instance using the specified definition and input payload.

#### Parameters

##### definitionId

`string`

The ID of the workflow definition to instantiate.

##### input

[`AgentOSInput`](../interfaces/AgentOSInput.md)

The input payload for the workflow.

##### options?

Optional configuration for the workflow instance.

###### context?

`Record`\<`string`, `unknown`\>

###### conversationId?

`string`

###### createdByUserId?

`string`

###### metadata?

`Record`\<`string`, `unknown`\>

###### roleAssignments?

`Record`\<`string`, `string`\>

###### workflowId?

`string`

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md)\>

The created workflow instance.

#### Implementation of

`IAgentOS.startWorkflow`

***

### updateWorkflowStatus()

> **updateWorkflowStatus**(`workflowId`, `status`): `Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:1884](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L1884)

Updates the high-level workflow status (e.g., cancel, complete).

#### Parameters

##### workflowId

`string`

The workflow instance ID.

##### status

[`WorkflowStatus`](../enumerations/WorkflowStatus.md)

The new status to set.

#### Returns

`Promise`\<[`WorkflowInstance`](../interfaces/WorkflowInstance.md) \| `null`\>

Updated workflow instance or null if not found.

#### Implementation of

`IAgentOS.updateWorkflowStatus`
