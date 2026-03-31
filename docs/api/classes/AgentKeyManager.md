# Class: AgentKeyManager

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:33](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/crypto/AgentKeyManager.ts#L33)

## Properties

### agentId

> `readonly` **agentId**: `string`

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:36](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/crypto/AgentKeyManager.ts#L36)

## Methods

### getPrivateKeyBase64()

> **getPrivateKeyBase64**(): `string`

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:187](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/crypto/AgentKeyManager.ts#L187)

Get the base64-encoded private key (for persistence).

#### Returns

`string`

***

### getPublicKeyBase64()

> **getPublicKeyBase64**(): `string`

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:180](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/crypto/AgentKeyManager.ts#L180)

Get the base64-encoded public key.

#### Returns

`string`

***

### sign()

> **sign**(`data`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:89](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/crypto/AgentKeyManager.ts#L89)

Sign data and return a base64-encoded signature.

#### Parameters

##### data

`string`

#### Returns

`Promise`\<`string`\>

***

### toKeySource()

> **toKeySource**(): [`AgentKeySource`](../interfaces/AgentKeySource.md)

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:194](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/crypto/AgentKeyManager.ts#L194)

Export as an AgentKeySource for serialization.

#### Returns

[`AgentKeySource`](../interfaces/AgentKeySource.md)

***

### verify()

> **verify**(`data`, `signatureBase64`, `publicKeyBase64?`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:113](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/crypto/AgentKeyManager.ts#L113)

Verify a signature against data using a public key.
Can verify using this instance's key or a provided external key.

#### Parameters

##### data

`string`

##### signatureBase64

`string`

##### publicKeyBase64?

`string`

#### Returns

`Promise`\<`boolean`\>

***

### fromKeySource()

> `static` **fromKeySource**(`agentId`, `source`): `Promise`\<`AgentKeyManager`\>

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:72](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/crypto/AgentKeyManager.ts#L72)

Create from an imported key source configuration.

#### Parameters

##### agentId

`string`

##### source

[`AgentKeySource`](../interfaces/AgentKeySource.md)

#### Returns

`Promise`\<`AgentKeyManager`\>

***

### generate()

> `static` **generate**(`agentId`): `Promise`\<`AgentKeyManager`\>

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:51](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/crypto/AgentKeyManager.ts#L51)

Generate a new Ed25519 keypair.

#### Parameters

##### agentId

`string`

#### Returns

`Promise`\<`AgentKeyManager`\>

***

### verifySignature()

> `static` **verifySignature**(`data`, `signatureBase64`, `publicKeyBase64`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:146](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/crypto/AgentKeyManager.ts#L146)

Static verification using only a public key (no instance needed).

#### Parameters

##### data

`string`

##### signatureBase64

`string`

##### publicKeyBase64

`string`

#### Returns

`Promise`\<`boolean`\>
