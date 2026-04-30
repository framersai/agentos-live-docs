# Interface: RegisteredExternalToolExecutionOptions

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:22](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/processRequestWithRegisteredTools.ts#L22)

## Properties

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:36](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/processRequestWithRegisteredTools.ts#L36)

Optional correlation ID override. Defaults to the tool call ID.

***

### externalTools?

> `optional` **externalTools**: [`ExternalToolRegistry`](../type-aliases/ExternalToolRegistry.md)

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/processRequestWithRegisteredTools.ts#L47)

Optional map, array, or iterable of host-managed external tools to use
when a tool name is not registered in AgentOS itself.

***

### fallbackExternalToolHandler?

> `optional` **fallbackExternalToolHandler**: [`AgentOSExternalToolHandler`](../type-aliases/AgentOSExternalToolHandler.md)

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:42](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/processRequestWithRegisteredTools.ts#L42)

Optional fallback for actionable external tool calls that are not
registered in AgentOS. Use this when the same turn can mix
AgentOS-registered tools with custom host-managed tools.

***

### organizationId?

> `optional` **organizationId**: `string`

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:32](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/processRequestWithRegisteredTools.ts#L32)

Trusted runtime-only organization context to propagate into both
`userContext.organizationId` and `sessionData.organizationId`.

***

### userContext?

> `optional` **userContext**: `Partial`\<[`UserContext`](UserContext.md)\>

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:27](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/processRequestWithRegisteredTools.ts#L27)

Optional additional user-context fields to merge into the live tool
execution context. `input.userId` always wins.
