# Interface: AgentKeyRecord

Defined in: [packages/agentos/src/provenance/types.ts:277](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/types.ts#L277)

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:279](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/types.ts#L279)

Agent instance ID.

***

### createdAt

> **createdAt**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:285](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/types.ts#L285)

ISO 8601 creation timestamp.

***

### encryptedPrivateKey?

> `optional` **encryptedPrivateKey**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:283](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/types.ts#L283)

Encrypted private key (optional, for server-side storage).

***

### keyAlgorithm

> **keyAlgorithm**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:287](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/types.ts#L287)

Key algorithm identifier.

***

### publicKey

> **publicKey**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:281](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/types.ts#L281)

Base64-encoded Ed25519 public key.
