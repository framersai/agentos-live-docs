# Interface: AnchorProvider

Defined in: [packages/agentos/src/provenance/types.ts:104](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L104)

Interface for external anchor publishing backends.
Implementations are called AFTER local anchor persistence.

## Properties

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:106](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L106)

Unique provider identifier.

***

### name

> `readonly` **name**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:108](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L108)

Human-readable display name.

***

### proofLevel

> `readonly` **proofLevel**: [`ProofLevel`](../type-aliases/ProofLevel.md)

Defined in: [packages/agentos/src/provenance/types.ts:110](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L110)

Proof level this provider advertises.

## Methods

### dispose()?

> `optional` **dispose**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/provenance/types.ts:119](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L119)

Optional: dispose of resources (connections, timers, etc.).

#### Returns

`Promise`\<`void`\>

***

### publish()

> **publish**(`anchor`): `Promise`\<[`AnchorProviderResult`](AnchorProviderResult.md)\>

Defined in: [packages/agentos/src/provenance/types.ts:115](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L115)

Publish an anchor externally.
Must not throw — failures are returned via AnchorProviderResult.success = false.

#### Parameters

##### anchor

[`AnchorRecord`](AnchorRecord.md)

#### Returns

`Promise`\<[`AnchorProviderResult`](AnchorProviderResult.md)\>

***

### verify()?

> `optional` **verify**(`anchor`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/provenance/types.ts:117](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/provenance/types.ts#L117)

Optional: verify a previously published anchor against its external reference.

#### Parameters

##### anchor

[`AnchorRecord`](AnchorRecord.md)

#### Returns

`Promise`\<`boolean`\>
