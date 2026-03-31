# Interface: SignedEvent

Defined in: [packages/agentos/src/provenance/types.ts:179](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L179)

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:189](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L189)

Agent instance ID that produced this event.

***

### anchorId?

> `optional` **anchorId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:203](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L203)

Optional: Merkle anchor this event belongs to.

***

### hash

> **hash**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:193](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L193)

SHA-256 hash of this event's preimage.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:181](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L181)

Unique event ID (UUID v4).

***

### payload

> **payload**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/provenance/types.ts:197](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L197)

Event-specific payload (JSON-serializable).

***

### payloadHash

> **payloadHash**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:195](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L195)

SHA-256 hash of the payload JSON.

***

### prevHash

> **prevHash**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:191](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L191)

SHA-256 hash of the previous event (empty string for genesis).

***

### sequence

> **sequence**: `number`

Defined in: [packages/agentos/src/provenance/types.ts:187](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L187)

Monotonically increasing sequence number within this agent.

***

### signature

> **signature**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:199](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L199)

Ed25519 signature of the hash, base64-encoded.

***

### signerPublicKey

> **signerPublicKey**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:201](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L201)

Base64-encoded Ed25519 public key of the signing agent.

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:185](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L185)

ISO 8601 timestamp.

***

### type

> **type**: [`ProvenanceEventType`](../type-aliases/ProvenanceEventType.md)

Defined in: [packages/agentos/src/provenance/types.ts:183](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/provenance/types.ts#L183)

Event type.
