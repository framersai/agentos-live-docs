# Interface: PersonaRegistrySource

Defined in: [packages/agentos/src/extensions/types.ts:234](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/types.ts#L234)

Persona registry source configuration

## Properties

### branch?

> `optional` **branch**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:240](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/types.ts#L240)

Optional branch for git sources

***

### cacheDuration?

> `optional` **cacheDuration**: `number`

Defined in: [packages/agentos/src/extensions/types.ts:246](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/types.ts#L246)

Cache duration in milliseconds

***

### location

> **location**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:238](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/types.ts#L238)

Location (URL, path, package name)

***

### token?

> `optional` **token**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:242](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/types.ts#L242)

Optional authentication token

***

### type

> **type**: `"github"` \| `"npm"` \| `"file"` \| `"git"` \| `"url"`

Defined in: [packages/agentos/src/extensions/types.ts:236](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/types.ts#L236)

Type of source

***

### verified?

> `optional` **verified**: `boolean`

Defined in: [packages/agentos/src/extensions/types.ts:244](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/types.ts#L244)

Whether this is a verified/trusted source
