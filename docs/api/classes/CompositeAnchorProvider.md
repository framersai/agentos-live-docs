# Class: CompositeAnchorProvider

Defined in: [packages/agentos/src/provenance/anchoring/providers/CompositeAnchorProvider.ts:19](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/providers/CompositeAnchorProvider.ts#L19)

Interface for external anchor publishing backends.
Implementations are called AFTER local anchor persistence.

## Implements

- [`AnchorProvider`](../interfaces/AnchorProvider.md)

## Constructors

### Constructor

> **new CompositeAnchorProvider**(`providers`): `CompositeAnchorProvider`

Defined in: [packages/agentos/src/provenance/anchoring/providers/CompositeAnchorProvider.ts:24](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/providers/CompositeAnchorProvider.ts#L24)

#### Parameters

##### providers

[`AnchorProvider`](../interfaces/AnchorProvider.md)[]

#### Returns

`CompositeAnchorProvider`

## Properties

### id

> `readonly` **id**: `"composite"` = `'composite'`

Defined in: [packages/agentos/src/provenance/anchoring/providers/CompositeAnchorProvider.ts:20](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/providers/CompositeAnchorProvider.ts#L20)

Unique provider identifier.

#### Implementation of

[`AnchorProvider`](../interfaces/AnchorProvider.md).[`id`](../interfaces/AnchorProvider.md#id)

***

### name

> `readonly` **name**: `"Composite Provider"` = `'Composite Provider'`

Defined in: [packages/agentos/src/provenance/anchoring/providers/CompositeAnchorProvider.ts:21](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/providers/CompositeAnchorProvider.ts#L21)

Human-readable display name.

#### Implementation of

[`AnchorProvider`](../interfaces/AnchorProvider.md).[`name`](../interfaces/AnchorProvider.md#name)

## Accessors

### proofLevel

#### Get Signature

> **get** **proofLevel**(): [`ProofLevel`](../type-aliases/ProofLevel.md)

Defined in: [packages/agentos/src/provenance/anchoring/providers/CompositeAnchorProvider.ts:28](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/providers/CompositeAnchorProvider.ts#L28)

Proof level this provider advertises.

##### Returns

[`ProofLevel`](../type-aliases/ProofLevel.md)

Proof level this provider advertises.

#### Implementation of

[`AnchorProvider`](../interfaces/AnchorProvider.md).[`proofLevel`](../interfaces/AnchorProvider.md#prooflevel)

## Methods

### dispose()

> **dispose**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/provenance/anchoring/providers/CompositeAnchorProvider.ts:71](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/providers/CompositeAnchorProvider.ts#L71)

Optional: dispose of resources (connections, timers, etc.).

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`AnchorProvider`](../interfaces/AnchorProvider.md).[`dispose`](../interfaces/AnchorProvider.md#dispose)

***

### publish()

> **publish**(`anchor`): `Promise`\<[`AnchorProviderResult`](../interfaces/AnchorProviderResult.md)\>

Defined in: [packages/agentos/src/provenance/anchoring/providers/CompositeAnchorProvider.ts:37](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/providers/CompositeAnchorProvider.ts#L37)

Publish an anchor externally.
Must not throw — failures are returned via AnchorProviderResult.success = false.

#### Parameters

##### anchor

[`AnchorRecord`](../interfaces/AnchorRecord.md)

#### Returns

`Promise`\<[`AnchorProviderResult`](../interfaces/AnchorProviderResult.md)\>

#### Implementation of

[`AnchorProvider`](../interfaces/AnchorProvider.md).[`publish`](../interfaces/AnchorProvider.md#publish)

***

### verify()

> **verify**(`anchor`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/provenance/anchoring/providers/CompositeAnchorProvider.ts:62](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/providers/CompositeAnchorProvider.ts#L62)

Optional: verify a previously published anchor against its external reference.

#### Parameters

##### anchor

[`AnchorRecord`](../interfaces/AnchorRecord.md)

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`AnchorProvider`](../interfaces/AnchorProvider.md).[`verify`](../interfaces/AnchorProvider.md#verify)
