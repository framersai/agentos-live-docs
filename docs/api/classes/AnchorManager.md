# Class: AnchorManager

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:29](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L29)

## Constructors

### Constructor

> **new AnchorManager**(`storageAdapter`, `ledger`, `keyManager`, `config`, `tablePrefix?`, `provider?`): `AnchorManager`

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:39](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L39)

#### Parameters

##### storageAdapter

`AnchorStorageAdapter`

##### ledger

[`SignedEventLedger`](SignedEventLedger.md)

##### keyManager

[`AgentKeyManager`](AgentKeyManager.md)

##### config

[`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

##### tablePrefix?

`string` = `''`

##### provider?

[`AnchorProvider`](../interfaces/AnchorProvider.md)

#### Returns

`AnchorManager`

## Methods

### createAnchor()

> **createAnchor**(`fromSequence`, `toSequence`): `Promise`\<[`AnchorRecord`](../interfaces/AnchorRecord.md)\>

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:120](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L120)

Force-create an anchor for a specific event range.

#### Parameters

##### fromSequence

`number`

Start sequence (inclusive).

##### toSequence

`number`

End sequence (inclusive).

#### Returns

`Promise`\<[`AnchorRecord`](../interfaces/AnchorRecord.md)\>

The new anchor record.

***

### createAnchorIfNeeded()

> **createAnchorIfNeeded**(): `Promise`\<[`AnchorRecord`](../interfaces/AnchorRecord.md) \| `null`\>

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:95](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L95)

Create an anchor if there are enough new events since the last anchor.
Returns the new anchor record, or null if no anchor was needed.

#### Returns

`Promise`\<[`AnchorRecord`](../interfaces/AnchorRecord.md) \| `null`\>

***

### getAllAnchors()

> **getAllAnchors**(): `Promise`\<[`AnchorRecord`](../interfaces/AnchorRecord.md)[]\>

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:226](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L226)

Get all anchors (ordered by sequence range).

#### Returns

`Promise`\<[`AnchorRecord`](../interfaces/AnchorRecord.md)[]\>

***

### getAnchorForSequence()

> **getAnchorForSequence**(`sequence`): `Promise`\<[`AnchorRecord`](../interfaces/AnchorRecord.md) \| `null`\>

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:236](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L236)

Get the anchor covering a specific sequence number.

#### Parameters

##### sequence

`number`

#### Returns

`Promise`\<[`AnchorRecord`](../interfaces/AnchorRecord.md) \| `null`\>

***

### getLastAnchor()

> **getLastAnchor**(): `Promise`\<[`AnchorRecord`](../interfaces/AnchorRecord.md) \| `null`\>

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:216](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L216)

Get the most recent anchor.

#### Returns

`Promise`\<[`AnchorRecord`](../interfaces/AnchorRecord.md) \| `null`\>

***

### getProvider()

> **getProvider**(): [`AnchorProvider`](../interfaces/AnchorProvider.md) \| `null`

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:209](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L209)

Get the current anchor provider, if any.

#### Returns

[`AnchorProvider`](../interfaces/AnchorProvider.md) \| `null`

***

### isActive()

> **isActive**(): `boolean`

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:311](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L311)

Check if the manager is currently running periodic anchoring.

#### Returns

`boolean`

***

### start()

> **start**(): `void`

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:58](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L58)

Start periodic anchoring at the configured interval.

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:82](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L82)

Stop periodic anchoring.

#### Returns

`void`

***

### verifyAnchor()

> **verifyAnchor**(`anchorId`): `Promise`\<\{ `anchor`: [`AnchorRecord`](../interfaces/AnchorRecord.md); `errors`: `string`[]; `valid`: `boolean`; \}\>

Defined in: [packages/agentos/src/provenance/anchoring/AnchorManager.ts:249](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/anchoring/AnchorManager.ts#L249)

Verify an anchor's Merkle root against the actual events.

#### Parameters

##### anchorId

`string`

#### Returns

`Promise`\<\{ `anchor`: [`AnchorRecord`](../interfaces/AnchorRecord.md); `errors`: `string`[]; `valid`: `boolean`; \}\>
