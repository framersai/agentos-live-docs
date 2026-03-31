# Class: HashChain

Defined in: [packages/agentos/src/provenance/crypto/HashChain.ts:16](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/crypto/HashChain.ts#L16)

## Constructors

### Constructor

> **new HashChain**(`initialHash?`, `initialSequence?`): `HashChain`

Defined in: [packages/agentos/src/provenance/crypto/HashChain.ts:20](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/crypto/HashChain.ts#L20)

#### Parameters

##### initialHash?

`string` = `''`

##### initialSequence?

`number` = `0`

#### Returns

`HashChain`

## Methods

### advance()

> **advance**(): `object`

Defined in: [packages/agentos/src/provenance/crypto/HashChain.ts:42](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/crypto/HashChain.ts#L42)

Advance the chain: increment sequence, return the new sequence and prevHash.

#### Returns

`object`

##### prevHash

> **prevHash**: `string`

##### sequence

> **sequence**: `number`

***

### getLastHash()

> **getLastHash**(): `string`

Defined in: [packages/agentos/src/provenance/crypto/HashChain.ts:35](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/crypto/HashChain.ts#L35)

Get the hash of the last event in the chain.

#### Returns

`string`

***

### getSequence()

> **getSequence**(): `number`

Defined in: [packages/agentos/src/provenance/crypto/HashChain.ts:28](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/crypto/HashChain.ts#L28)

Get the current sequence number.

#### Returns

`number`

***

### recordHash()

> **recordHash**(`hash`): `void`

Defined in: [packages/agentos/src/provenance/crypto/HashChain.ts:53](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/crypto/HashChain.ts#L53)

Record a hash as the new chain head (call after event is persisted).

#### Parameters

##### hash

`string`

#### Returns

`void`

***

### canonicalJSON()

> `static` **canonicalJSON**(`obj`): `string`

Defined in: [packages/agentos/src/provenance/crypto/HashChain.ts:85](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/crypto/HashChain.ts#L85)

Produce canonical JSON: keys sorted lexicographically at every level.

#### Parameters

##### obj

`unknown`

#### Returns

`string`

***

### computeEventHash()

> `static` **computeEventHash**(`event`, `algorithm?`): `string`

Defined in: [packages/agentos/src/provenance/crypto/HashChain.ts:61](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/crypto/HashChain.ts#L61)

Compute the SHA-256 hash of an event's preimage.
Preimage format: `${sequence}|${type}|${timestamp}|${agentId}|${prevHash}|${payloadHash}`

#### Parameters

##### event

###### agentId

`string`

###### payloadHash

`string`

###### prevHash

`string`

###### sequence

`number`

###### timestamp

`string`

###### type

[`ProvenanceEventType`](../type-aliases/ProvenanceEventType.md)

##### algorithm?

`string` = `'sha256'`

#### Returns

`string`

***

### computePayloadHash()

> `static` **computePayloadHash**(`payload`, `algorithm?`): `string`

Defined in: [packages/agentos/src/provenance/crypto/HashChain.ts:77](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/crypto/HashChain.ts#L77)

Compute the SHA-256 hash of a payload object using canonical JSON.
Canonical = sorted keys recursively for deterministic output.

#### Parameters

##### payload

`Record`\<`string`, `unknown`\>

##### algorithm?

`string` = `'sha256'`

#### Returns

`string`

***

### hash()

> `static` **hash**(`data`, `algorithm?`): `string`

Defined in: [packages/agentos/src/provenance/crypto/HashChain.ts:103](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/crypto/HashChain.ts#L103)

Compute a generic SHA-256 hash of a string.

#### Parameters

##### data

`string`

##### algorithm?

`string` = `'sha256'`

#### Returns

`string`
