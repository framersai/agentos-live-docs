# Interface: PersonaRegistrySource

Defined in: [packages/agentos/src/extensions/types.ts:234](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L234)

Persona registry source configuration

## Properties

### branch?

> `optional` **branch**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:240](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L240)

Optional branch for git sources

***

### cacheDuration?

> `optional` **cacheDuration**: `number`

Defined in: [packages/agentos/src/extensions/types.ts:246](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L246)

Cache duration in milliseconds

***

### location

> **location**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:238](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L238)

Location (URL, path, package name)

***

### token?

> `optional` **token**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:242](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L242)

Optional authentication token

***

### type

> **type**: `"github"` \| `"npm"` \| `"file"` \| `"git"` \| `"url"`

Defined in: [packages/agentos/src/extensions/types.ts:236](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L236)

Type of source

***

### verified?

> `optional` **verified**: `boolean`

Defined in: [packages/agentos/src/extensions/types.ts:244](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/extensions/types.ts#L244)

Whether this is a verified/trusted source
