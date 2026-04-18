# Interface: VerificationBundle

Defined in: [packages/agentos/src/provenance/types.ts:324](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L324)

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:328](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L328)

Agent instance ID.

***

### anchors

> **anchors**: [`AnchorRecord`](AnchorRecord.md)[]

Defined in: [packages/agentos/src/provenance/types.ts:334](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L334)

Anchor records covering the events.

***

### bundleHash

> **bundleHash**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:338](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L338)

SHA-256 hash of the bundle contents.

***

### bundleSignature

> **bundleSignature**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:340](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L340)

Ed25519 signature of the bundle hash.

***

### events

> **events**: [`SignedEvent`](SignedEvent.md)[]

Defined in: [packages/agentos/src/provenance/types.ts:332](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L332)

Ordered list of signed events.

***

### exportedAt

> **exportedAt**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:336](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L336)

ISO 8601 export timestamp.

***

### publicKey

> **publicKey**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:330](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L330)

Base64-encoded Ed25519 public key of the agent.

***

### version

> **version**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:326](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/types.ts#L326)

Bundle format version.
