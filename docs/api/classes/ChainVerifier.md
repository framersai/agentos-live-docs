# Class: ChainVerifier

Defined in: [packages/agentos/src/provenance/verification/ChainVerifier.ts:18](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/verification/ChainVerifier.ts#L18)

## Constructors

### Constructor

> **new ChainVerifier**(): `ChainVerifier`

#### Returns

`ChainVerifier`

## Methods

### isValid()

> `static` **isValid**(`events`, `publicKeyBase64?`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/provenance/verification/ChainVerifier.ts:196](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/verification/ChainVerifier.ts#L196)

Quick integrity check - returns true/false without detailed errors.

#### Parameters

##### events

[`SignedEvent`](../interfaces/SignedEvent.md)[]

##### publicKeyBase64?

`string`

#### Returns

`Promise`\<`boolean`\>

***

### verify()

> `static` **verify**(`events`, `publicKeyBase64?`, `hashAlgorithm?`): `Promise`\<[`VerificationResult`](../interfaces/VerificationResult.md)\>

Defined in: [packages/agentos/src/provenance/verification/ChainVerifier.ts:36](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/verification/ChainVerifier.ts#L36)

Verify an ordered array of signed events for chain integrity.

Checks performed:
1. Sequence continuity (monotonically increasing, no gaps)
2. Hash linkage (each event's prevHash matches the prior event's hash)
3. Payload hash integrity (recomputed hash matches stored payloadHash)
4. Event hash integrity (recomputed hash matches stored hash)
5. Ed25519 signature verification (if signatures present)
6. Timestamp monotonicity (non-decreasing)

#### Parameters

##### events

[`SignedEvent`](../interfaces/SignedEvent.md)[]

Ordered array of SignedEvent objects (sorted by sequence ASC).

##### publicKeyBase64?

`string`

Optional public key for signature verification.
                         If omitted, uses each event's signerPublicKey field.

##### hashAlgorithm?

`"sha256"` = `'sha256'`

Hash algorithm used (default: 'sha256').

#### Returns

`Promise`\<[`VerificationResult`](../interfaces/VerificationResult.md)\>

VerificationResult with validity status and any errors found.

***

### verifySubChain()

> `static` **verifySubChain**(`events`, `expectedStartPrevHash`, `publicKeyBase64?`): `Promise`\<[`VerificationResult`](../interfaces/VerificationResult.md)\>

Defined in: [packages/agentos/src/provenance/verification/ChainVerifier.ts:208](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/verification/ChainVerifier.ts#L208)

Verify a sub-chain (range of events) within a larger chain.
The first event's prevHash is trusted as a starting point.

#### Parameters

##### events

[`SignedEvent`](../interfaces/SignedEvent.md)[]

##### expectedStartPrevHash

`string`

##### publicKeyBase64?

`string`

#### Returns

`Promise`\<[`VerificationResult`](../interfaces/VerificationResult.md)\>
