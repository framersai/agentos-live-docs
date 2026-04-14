# Interface: AnchorRecord

Defined in: [packages/agentos/src/provenance/types.ts:210](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L210)

## Properties

### eventCount

> **eventCount**: `number`

Defined in: [packages/agentos/src/provenance/types.ts:220](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L220)

Number of events in this anchor.

***

### externalRef?

> `optional` **externalRef**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:226](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L226)

Optional external reference (IPFS CID, tx hash, etc.).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:212](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L212)

Unique anchor ID.

***

### merkleRoot

> **merkleRoot**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:214](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L214)

Merkle root hash of events in [sequenceFrom, sequenceTo].

***

### providerResults?

> `optional` **providerResults**: [`AnchorProviderResult`](AnchorProviderResult.md)[]

Defined in: [packages/agentos/src/provenance/types.ts:228](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L228)

Results from anchor providers (when multiple are composed).

***

### sequenceFrom

> **sequenceFrom**: `number`

Defined in: [packages/agentos/src/provenance/types.ts:216](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L216)

First event sequence in this anchor.

***

### sequenceTo

> **sequenceTo**: `number`

Defined in: [packages/agentos/src/provenance/types.ts:218](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L218)

Last event sequence in this anchor.

***

### signature

> **signature**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:224](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L224)

Ed25519 signature of the Merkle root.

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:222](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L222)

ISO 8601 timestamp.
