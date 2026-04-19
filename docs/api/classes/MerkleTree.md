# Class: MerkleTree

Defined in: [packages/agentos/src/provenance/crypto/MerkleTree.ts:15](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/crypto/MerkleTree.ts#L15)

## Constructors

### Constructor

> **new MerkleTree**(): `MerkleTree`

#### Returns

`MerkleTree`

## Methods

### computeProof()

> `static` **computeProof**(`leaves`, `leafIndex`, `algorithm?`): `MerkleProof`

Defined in: [packages/agentos/src/provenance/crypto/MerkleTree.ts:49](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/crypto/MerkleTree.ts#L49)

Compute a Merkle inclusion proof for a leaf at a given index.
Returns the sibling hashes needed to reconstruct the root.

#### Parameters

##### leaves

`string`[]

##### leafIndex

`number`

##### algorithm?

`string` = `'sha256'`

#### Returns

`MerkleProof`

***

### computeRoot()

> `static` **computeRoot**(`leaves`, `algorithm?`): `string`

Defined in: [packages/agentos/src/provenance/crypto/MerkleTree.ts:21](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/crypto/MerkleTree.ts#L21)

Compute the Merkle root of a list of leaf hashes.
If the number of leaves is odd, the last leaf is duplicated.
Returns empty string for empty input.

#### Parameters

##### leaves

`string`[]

##### algorithm?

`string` = `'sha256'`

#### Returns

`string`

***

### verifyProof()

> `static` **verifyProof**(`proof`, `algorithm?`): `boolean`

Defined in: [packages/agentos/src/provenance/crypto/MerkleTree.ts:94](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/crypto/MerkleTree.ts#L94)

Verify a Merkle inclusion proof.

#### Parameters

##### proof

`MerkleProof`

##### algorithm?

`string` = `'sha256'`

#### Returns

`boolean`
