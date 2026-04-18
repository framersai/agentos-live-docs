# Interface: AnchorTarget

Defined in: [packages/agentos/src/provenance/types.ts:53](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L53)

## Properties

### endpoint?

> `optional` **endpoint**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:57](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L57)

Endpoint or identifier for the anchor target.

***

### options?

> `optional` **options**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/provenance/types.ts:59](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L59)

Additional options specific to the anchor target type.

***

### targets?

> `optional` **targets**: `AnchorTarget`[]

Defined in: [packages/agentos/src/provenance/types.ts:61](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L61)

For composite: list of sub-targets to publish to in parallel.

***

### type

> **type**: `"custom"` \| `"none"` \| `"worm-snapshot"` \| `"rekor"` \| `"opentimestamps"` \| `"ethereum"` \| `"solana"` \| `"composite"`

Defined in: [packages/agentos/src/provenance/types.ts:55](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L55)

Type of external anchor (extensible).
