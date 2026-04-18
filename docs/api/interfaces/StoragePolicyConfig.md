# Interface: StoragePolicyConfig

Defined in: [packages/agentos/src/provenance/types.ts:16](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L16)

## Properties

### exemptTables?

> `optional` **exemptTables**: `string`[]

Defined in: [packages/agentos/src/provenance/types.ts:22](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L22)

Tables exempt from enforcement (e.g., cache, temp tables).

***

### mode

> **mode**: [`StoragePolicyMode`](../type-aliases/StoragePolicyMode.md)

Defined in: [packages/agentos/src/provenance/types.ts:18](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L18)

Which mode to enforce.

***

### protectedTables?

> `optional` **protectedTables**: `string`[]

Defined in: [packages/agentos/src/provenance/types.ts:20](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L20)

Tables subject to policy enforcement. Empty array or undefined = all tables.
