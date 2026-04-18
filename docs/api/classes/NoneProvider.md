# Class: NoneProvider

Defined in: [packages/agentos/src/provenance/anchoring/providers/NoneProvider.ts:11](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/anchoring/providers/NoneProvider.ts#L11)

Interface for external anchor publishing backends.
Implementations are called AFTER local anchor persistence.

## Implements

- [`AnchorProvider`](../interfaces/AnchorProvider.md)

## Constructors

### Constructor

> **new NoneProvider**(): `NoneProvider`

#### Returns

`NoneProvider`

## Properties

### id

> `readonly` **id**: `"none"` = `'none'`

Defined in: [packages/agentos/src/provenance/anchoring/providers/NoneProvider.ts:12](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/anchoring/providers/NoneProvider.ts#L12)

Unique provider identifier.

#### Implementation of

[`AnchorProvider`](../interfaces/AnchorProvider.md).[`id`](../interfaces/AnchorProvider.md#id)

***

### name

> `readonly` **name**: `"None (Local Only)"` = `'None (Local Only)'`

Defined in: [packages/agentos/src/provenance/anchoring/providers/NoneProvider.ts:13](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/anchoring/providers/NoneProvider.ts#L13)

Human-readable display name.

#### Implementation of

[`AnchorProvider`](../interfaces/AnchorProvider.md).[`name`](../interfaces/AnchorProvider.md#name)

***

### proofLevel

> `readonly` **proofLevel**: [`ProofLevel`](../type-aliases/ProofLevel.md) = `'verifiable'`

Defined in: [packages/agentos/src/provenance/anchoring/providers/NoneProvider.ts:14](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/anchoring/providers/NoneProvider.ts#L14)

Proof level this provider advertises.

#### Implementation of

[`AnchorProvider`](../interfaces/AnchorProvider.md).[`proofLevel`](../interfaces/AnchorProvider.md#prooflevel)

## Methods

### publish()

> **publish**(`_anchor`): `Promise`\<[`AnchorProviderResult`](../interfaces/AnchorProviderResult.md)\>

Defined in: [packages/agentos/src/provenance/anchoring/providers/NoneProvider.ts:16](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/anchoring/providers/NoneProvider.ts#L16)

Publish an anchor externally.
Must not throw — failures are returned via AnchorProviderResult.success = false.

#### Parameters

##### \_anchor

[`AnchorRecord`](../interfaces/AnchorRecord.md)

#### Returns

`Promise`\<[`AnchorProviderResult`](../interfaces/AnchorProviderResult.md)\>

#### Implementation of

[`AnchorProvider`](../interfaces/AnchorProvider.md).[`publish`](../interfaces/AnchorProvider.md#publish)
