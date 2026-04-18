# Interface: ResumeExternalToolRequestWithRegisteredToolsOptions

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:72](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L72)

Optional runtime-only data needed when resuming a persisted external tool
pause after the original AgentOS process is gone.

## Extends

- [`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`AgentOSResumeExternalToolRequestOptions`](AgentOSResumeExternalToolRequestOptions.md)

## Properties

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:58](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L58)

Optional correlation ID for tool execution tracing. Defaults to the pending
stream ID when omitted.

#### Inherited from

[`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`correlationId`](PendingExternalToolExecutionOptions.md#correlationid)

***

### externalTools?

> `optional` **externalTools**: [`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md)

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:69](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L69)

Optional map, array, or iterable of host-managed external tools to use
when a tool name is not registered in AgentOS itself.

#### Inherited from

[`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`externalTools`](PendingExternalToolExecutionOptions.md#externaltools)

***

### fallbackExternalToolHandler?

> `optional` **fallbackExternalToolHandler**: [`PendingExternalToolHandler`](../type-aliases/PendingExternalToolHandler.md)

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:64](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L64)

Optional fallback for pending external tool calls that are not registered
in AgentOS. Use this when the same persisted pause can mix AgentOS-
registered tools with custom host-managed tools.

#### Inherited from

[`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`fallbackExternalToolHandler`](PendingExternalToolExecutionOptions.md#fallbackexternaltoolhandler)

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:53](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L53)

Trusted runtime-only organization context to propagate into both
`userContext.organizationId` and `sessionData.organizationId`.

#### Inherited from

[`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`organizationId`](PendingExternalToolExecutionOptions.md#organizationid)

***

### preferredModelId?

> `optional` **preferredModelId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSExternalToolRequest.ts:25](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSExternalToolRequest.ts#L25)

#### Inherited from

[`AgentOSResumeExternalToolRequestOptions`](AgentOSResumeExternalToolRequestOptions.md).[`preferredModelId`](AgentOSResumeExternalToolRequestOptions.md#preferredmodelid)

***

### preferredProviderId?

> `optional` **preferredProviderId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSExternalToolRequest.ts:26](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSExternalToolRequest.ts#L26)

#### Inherited from

[`AgentOSResumeExternalToolRequestOptions`](AgentOSResumeExternalToolRequestOptions.md).[`preferredProviderId`](AgentOSResumeExternalToolRequestOptions.md#preferredproviderid)

***

### userApiKeys?

> `optional` **userApiKeys**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/api/types/AgentOSExternalToolRequest.ts:24](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSExternalToolRequest.ts#L24)

#### Inherited from

[`AgentOSResumeExternalToolRequestOptions`](AgentOSResumeExternalToolRequestOptions.md).[`userApiKeys`](AgentOSResumeExternalToolRequestOptions.md#userapikeys)

***

### userContext?

> `optional` **userContext**: `Partial`\<[`UserContext`](UserContext.md)\>

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:48](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L48)

Optional additional user-context fields to merge into the execution
context. `pendingRequest.userId` always wins.

#### Inherited from

[`PendingExternalToolExecutionOptions`](PendingExternalToolExecutionOptions.md).[`userContext`](PendingExternalToolExecutionOptions.md#usercontext)
