# Class: AgentKeyManager

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:33](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/crypto/AgentKeyManager.ts#L33)

## Properties

### agentId

> `readonly` **agentId**: `string`

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:36](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/crypto/AgentKeyManager.ts#L36)

## Methods

### getPrivateKeyBase64()

> **getPrivateKeyBase64**(): `string`

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:188](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/crypto/AgentKeyManager.ts#L188)

Get the base64-encoded private key (for persistence).

#### Returns

`string`

***

### getPublicKeyBase64()

> **getPublicKeyBase64**(): `string`

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:181](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/crypto/AgentKeyManager.ts#L181)

Get the base64-encoded public key.

#### Returns

`string`

***

### sign()

> **sign**(`data`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:90](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/crypto/AgentKeyManager.ts#L90)

Sign data and return a base64-encoded signature.

#### Parameters

##### data

`string`

#### Returns

`Promise`\<`string`\>

***

### toKeySource()

> **toKeySource**(): [`AgentKeySource`](../interfaces/AgentKeySource.md)

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:195](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/crypto/AgentKeyManager.ts#L195)

Export as an AgentKeySource for serialization.

#### Returns

[`AgentKeySource`](../interfaces/AgentKeySource.md)

***

### verify()

> **verify**(`data`, `signatureBase64`, `publicKeyBase64?`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:114](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/crypto/AgentKeyManager.ts#L114)

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

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:73](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/crypto/AgentKeyManager.ts#L73)

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

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/crypto/AgentKeyManager.ts#L51)

Generate a new Ed25519 keypair.

#### Parameters

##### agentId

`string`

#### Returns

`Promise`\<`AgentKeyManager`\>

***

### verifySignature()

> `static` **verifySignature**(`data`, `signatureBase64`, `publicKeyBase64`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/provenance/crypto/AgentKeyManager.ts:147](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/crypto/AgentKeyManager.ts#L147)

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
