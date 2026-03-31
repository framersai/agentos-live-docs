# Interface: RegisteredExternalToolExecutionOptions

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:29](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/processRequestWithRegisteredTools.ts#L29)

## Properties

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:43](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/processRequestWithRegisteredTools.ts#L43)

Optional correlation ID override. Defaults to the tool call ID.

***

### externalTools?

> `optional` **externalTools**: [`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md)

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:54](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/processRequestWithRegisteredTools.ts#L54)

Optional map, array, or iterable of host-managed external tools to use
when a tool name is not registered in AgentOS itself.

***

### fallbackExternalToolHandler?

> `optional` **fallbackExternalToolHandler**: [`AgentOSExternalToolHandler`](../type-aliases/AgentOSExternalToolHandler.md)

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:49](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/processRequestWithRegisteredTools.ts#L49)

Optional fallback for actionable external tool calls that are not
registered in AgentOS. Use this when the same turn can mix
AgentOS-registered tools with custom host-managed tools.

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:39](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/processRequestWithRegisteredTools.ts#L39)

Trusted runtime-only organization context to propagate into both
`userContext.organizationId` and `sessionData.organizationId`.

***

### userContext?

> `optional` **userContext**: `Partial`\<[`UserContext`](UserContext.md)\>

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:34](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/processRequestWithRegisteredTools.ts#L34)

Optional additional user-context fields to merge into the live tool
execution context. `input.userId` always wins.
