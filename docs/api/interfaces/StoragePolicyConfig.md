# Interface: StoragePolicyConfig

Defined in: [packages/agentos/src/provenance/types.ts:16](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/types.ts#L16)

## Properties

### exemptTables?

> `optional` **exemptTables**: `string`[]

Defined in: [packages/agentos/src/provenance/types.ts:22](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/types.ts#L22)

Tables exempt from enforcement (e.g., cache, temp tables).

***

### mode

> **mode**: [`StoragePolicyMode`](../type-aliases/StoragePolicyMode.md)

Defined in: [packages/agentos/src/provenance/types.ts:18](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/types.ts#L18)

Which mode to enforce.

***

### protectedTables?

> `optional` **protectedTables**: `string`[]

Defined in: [packages/agentos/src/provenance/types.ts:20](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/types.ts#L20)

Tables subject to policy enforcement. Empty array or undefined = all tables.
