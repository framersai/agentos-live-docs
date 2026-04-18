# Interface: PendingExternalToolExecutionOptions

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:43](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L43)

## Extended by

- [`ResumeExternalToolRequestWithRegisteredToolsOptions`](ResumeExternalToolRequestWithRegisteredToolsOptions.md)

## Properties

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:58](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L58)

Optional correlation ID for tool execution tracing. Defaults to the pending
stream ID when omitted.

***

### externalTools?

> `optional` **externalTools**: [`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md)

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:69](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L69)

Optional map, array, or iterable of host-managed external tools to use
when a tool name is not registered in AgentOS itself.

***

### fallbackExternalToolHandler?

> `optional` **fallbackExternalToolHandler**: [`PendingExternalToolHandler`](../type-aliases/PendingExternalToolHandler.md)

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:64](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L64)

Optional fallback for pending external tool calls that are not registered
in AgentOS. Use this when the same persisted pause can mix AgentOS-
registered tools with custom host-managed tools.

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:53](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L53)

Trusted runtime-only organization context to propagate into both
`userContext.organizationId` and `sessionData.organizationId`.

***

### userContext?

> `optional` **userContext**: `Partial`\<[`UserContext`](UserContext.md)\>

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:48](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L48)

Optional additional user-context fields to merge into the execution
context. `pendingRequest.userId` always wins.
