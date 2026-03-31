# Interface: PermissionCheckResult

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:65](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/tools/permissions/IToolPermissionManager.ts#L65)

Represents the result of a permission check performed by the `IToolPermissionManager`.

## Interface

PermissionCheckResult

## Properties

### details?

> `optional` **details**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:68](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/tools/permissions/IToolPermissionManager.ts#L68)

An optional object for any additional details or metadata
related to the permission decision (e.g., specific capability missing, subscription feature lacking, policy rule invoked).

***

### isAllowed

> **isAllowed**: `boolean`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:66](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/tools/permissions/IToolPermissionManager.ts#L66)

`true` if the tool execution is permitted based on the evaluated context, `false` otherwise.

***

### reason?

> `optional` **reason**: `string`

Defined in: [packages/agentos/src/core/tools/permissions/IToolPermissionManager.ts:67](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/tools/permissions/IToolPermissionManager.ts#L67)

An optional human-readable string explaining why the permission was
granted or denied. This is useful for logging, debugging, or providing feedback to users/developers.
