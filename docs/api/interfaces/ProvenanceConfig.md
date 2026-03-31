# Interface: ProvenanceConfig

Defined in: [packages/agentos/src/provenance/types.ts:29](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/types.ts#L29)

## Properties

### anchorTarget?

> `optional` **anchorTarget**: [`AnchorTarget`](AnchorTarget.md)

Defined in: [packages/agentos/src/provenance/types.ts:39](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/types.ts#L39)

Optional external anchor target configuration.

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/provenance/types.ts:31](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/types.ts#L31)

Whether the signed event ledger is active.

***

### hashAlgorithm

> **hashAlgorithm**: `"sha256"` \| `"sha384"` \| `"sha512"`

Defined in: [packages/agentos/src/provenance/types.ts:35](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/types.ts#L35)

Hash algorithm for the chain.

***

### keySource

> **keySource**: [`AgentKeySource`](AgentKeySource.md)

Defined in: [packages/agentos/src/provenance/types.ts:37](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/types.ts#L37)

Agent keypair source.

***

### signatureMode

> **signatureMode**: `"every-event"` \| `"anchor-only"`

Defined in: [packages/agentos/src/provenance/types.ts:33](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/types.ts#L33)

Sign every event individually, or only sign at anchor points.
