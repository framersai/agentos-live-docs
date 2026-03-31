# Interface: ResumeExternalToolRequestWithRegisteredToolsOptions

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:79](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L79)

Optional runtime-only data needed when resuming a persisted external tool
pause after the original AgentOS process is gone.

## Extends

- [`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`AgentOSResumeExternalToolRequestOptions`](AgentOSResumeExternalToolRequestOptions.md)

## Properties

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:65](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L65)

Optional correlation ID for tool execution tracing. Defaults to the pending
stream ID when omitted.

#### Inherited from

[`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`correlationId`](PendingExternalToolExecutionOptions.md#correlationid)

***

### externalTools?

> `optional` **externalTools**: [`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md)

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:76](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L76)

Optional map, array, or iterable of host-managed external tools to use
when a tool name is not registered in AgentOS itself.

#### Inherited from

[`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`externalTools`](PendingExternalToolExecutionOptions.md#externaltools)

***

### fallbackExternalToolHandler?

> `optional` **fallbackExternalToolHandler**: [`PendingExternalToolHandler`](../type-aliases/PendingExternalToolHandler.md)

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:71](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L71)

Optional fallback for pending external tool calls that are not registered
in AgentOS. Use this when the same persisted pause can mix AgentOS-
registered tools with custom host-managed tools.

#### Inherited from

[`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`fallbackExternalToolHandler`](PendingExternalToolExecutionOptions.md#fallbackexternaltoolhandler)

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:60](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L60)

Trusted runtime-only organization context to propagate into both
`userContext.organizationId` and `sessionData.organizationId`.

#### Inherited from

[`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`organizationId`](PendingExternalToolExecutionOptions.md#organizationid)

***

### preferredModelId?

> `optional` **preferredModelId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSExternalToolRequest.ts:25](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSExternalToolRequest.ts#L25)

#### Inherited from

[`AgentOSResumeExternalToolRequestOptions`](AgentOSResumeExternalToolRequestOptions.md).[`preferredModelId`](AgentOSResumeExternalToolRequestOptions.md#preferredmodelid)

***

### preferredProviderId?

> `optional` **preferredProviderId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSExternalToolRequest.ts:26](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSExternalToolRequest.ts#L26)

#### Inherited from

[`AgentOSResumeExternalToolRequestOptions`](AgentOSResumeExternalToolRequestOptions.md).[`preferredProviderId`](AgentOSResumeExternalToolRequestOptions.md#preferredproviderid)

***

### userApiKeys?

> `optional` **userApiKeys**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/api/types/AgentOSExternalToolRequest.ts:24](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSExternalToolRequest.ts#L24)

#### Inherited from

[`AgentOSResumeExternalToolRequestOptions`](AgentOSResumeExternalToolRequestOptions.md).[`userApiKeys`](AgentOSResumeExternalToolRequestOptions.md#userapikeys)

***

### userContext?

> `optional` **userContext**: `Partial`\<[`UserContext`](UserContext.md)\>

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:55](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L55)

Optional additional user-context fields to merge into the execution
context. `pendingRequest.userId` always wins.

#### Inherited from

[`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`userContext`](PendingExternalToolExecutionOptions.md#usercontext)
