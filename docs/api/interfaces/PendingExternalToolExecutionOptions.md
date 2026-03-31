# Interface: PendingExternalToolExecutionOptions

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:50](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L50)

## Extended by

- [`ResumeExternalToolRequestWithRegisteredToolsOptions`](ResumeExternalToolRequestWithRegisteredToolsOptions.md)

## Properties

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:65](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L65)

Optional correlation ID for tool execution tracing. Defaults to the pending
stream ID when omitted.

***

### externalTools?

> `optional` **externalTools**: [`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md)

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:76](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L76)

Optional map, array, or iterable of host-managed external tools to use
when a tool name is not registered in AgentOS itself.

***

### fallbackExternalToolHandler?

> `optional` **fallbackExternalToolHandler**: [`PendingExternalToolHandler`](../type-aliases/PendingExternalToolHandler.md)

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:71](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L71)

Optional fallback for pending external tool calls that are not registered
in AgentOS. Use this when the same persisted pause can mix AgentOS-
registered tools with custom host-managed tools.

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:60](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L60)

Trusted runtime-only organization context to propagate into both
`userContext.organizationId` and `sessionData.organizationId`.

***

### userContext?

> `optional` **userContext**: `Partial`\<[`UserContext`](UserContext.md)\>

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:55](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L55)

Optional additional user-context fields to merge into the execution
context. `pendingRequest.userId` always wins.
