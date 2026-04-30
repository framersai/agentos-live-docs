# Interface: ToolExecutionContext

Defined in: [packages/agentos/src/core/tools/ITool.ts:73](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L73)

Defines the invocation context passed to a tool's `execute` method.
This context provides the tool with essential information about the calling entity (GMI, Persona),
the user, and the overall session, enabling context-aware tool execution.

## Interface

ToolExecutionContext

## Properties

### correlationId?

> `optional` **correlationId**: `string`

Defined in: [packages/agentos/src/core/tools/ITool.ts:77](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L77)

An optional identifier used to correlate this specific tool call with other
operations, logs, or events across different parts of the system. Useful for tracing and debugging.

***

### gmiId

> **gmiId**: `string`

Defined in: [packages/agentos/src/core/tools/ITool.ts:74](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L74)

The unique identifier of the GMI (Generalized Mind Instance) that is invoking the tool.

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/core/tools/ITool.ts:75](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L75)

The unique identifier of the active Persona within the GMI that requested the tool execution.

***

### sessionData?

> `optional` **sessionData**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/tools/ITool.ts:78](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L78)

Optional. Ephemeral data relevant to the current session, potentially
sourced from the GMI's working memory or the orchestrator. This allows tools to access dynamic session state
if needed for their operation (e.g., user's current location, temporary files).

***

### userContext

> **userContext**: [`UserContext`](UserContext.md)

Defined in: [packages/agentos/src/core/tools/ITool.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/tools/ITool.ts#L76)

Contextual information about the end-user associated with the current interaction,
which might include user ID, preferences, skill level, etc.
