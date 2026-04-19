# Interface: PermissionCheckContext

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:47](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/tools/permissions/IToolPermissionManager.ts#L47)

Represents the context required for making a permission decision for tool usage.
This object aggregates all necessary information that the `IToolPermissionManager`
needs to evaluate whether a tool call should be allowed.

## Interface

PermissionCheckContext

## Properties

### gmiId?

> `optional` **gmiId**: `string`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:52](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/tools/permissions/IToolPermissionManager.ts#L52)

Optional. The unique identifier of the GMI instance making the request.
Useful for logging or more granular GMI-specific rules.

***

### personaCapabilities

> **personaCapabilities**: `string`[]

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:50](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/tools/permissions/IToolPermissionManager.ts#L50)

An array of capability strings (e.g., "filesystem:read", "api:weather")
currently possessed by the active Persona.

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:49](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/tools/permissions/IToolPermissionManager.ts#L49)

The unique identifier of the active Persona within the GMI
that is attempting to use the tool.

***

### tool

> **tool**: [`ITool`](ITool.md)

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:48](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/tools/permissions/IToolPermissionManager.ts#L48)

The actual `ITool` instance for which permission is being checked.
This provides access to tool metadata like `id`, `name`, and `requiredCapabilities`.

***

### userContext

> **userContext**: [`UserContext`](UserContext.md)

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:51](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/tools/permissions/IToolPermissionManager.ts#L51)

The context of the end-user associated with the current request,
which may include `userId`, preferences, skill level, etc.
