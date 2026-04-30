# Class: SignedEventLedger

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:32](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L32)

## Constructors

### Constructor

> **new SignedEventLedger**(`storageAdapter`, `keyManager`, `agentId`, `config`, `tablePrefix?`): `SignedEventLedger`

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:44](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L44)

#### Parameters

##### storageAdapter

`LedgerStorageAdapter`

##### keyManager

[`AgentKeyManager`](AgentKeyManager.md)

##### agentId

`string`

##### config

[`ProvenanceConfig`](../interfaces/ProvenanceConfig.md)

##### tablePrefix?

`string` = `''`

#### Returns

`SignedEventLedger`

## Methods

### appendEvent()

> **appendEvent**(`type`, `payload`): `Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md)\>

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:86](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L86)

Append a new event to the ledger.
Serialized via internal queue to maintain hash chain integrity.

#### Parameters

##### type

[`ProvenanceEventType`](../type-aliases/ProvenanceEventType.md)

##### payload

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md)\>

***

### getAllEvents()

> **getAllEvents**(): `Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md)[]\>

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:265](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L265)

Get all events for this agent (ordered by sequence).

#### Returns

`Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md)[]\>

***

### getChainState()

> **getChainState**(): `object`

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:278](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L278)

Get the current chain state (for diagnostics).

#### Returns

`object`

##### lastHash

> **lastHash**: `string`

##### sequence

> **sequence**: `number`

***

### getEvent()

> **getEvent**(`id`): `Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md) \| `null`\>

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:173](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L173)

Get a single event by ID.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md) \| `null`\>

***

### getEventCount()

> **getEventCount**(): `Promise`\<`number`\>

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:254](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L254)

Get the total number of events for this agent.

#### Returns

`Promise`\<`number`\>

***

### getEventsByPayloadFilter()

> **getEventsByPayloadFilter**(`filter`, `types?`): `Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md)[]\>

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:210](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L210)

Get events matching a payload filter (searches JSON payload).

#### Parameters

##### filter

`Record`\<`string`, `unknown`\>

##### types?

[`ProvenanceEventType`](../type-aliases/ProvenanceEventType.md)[]

#### Returns

`Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md)[]\>

***

### getEventsByRange()

> **getEventsByRange**(`fromSequence`, `toSequence`): `Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md)[]\>

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:184](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L184)

Get events in a sequence range (inclusive).

#### Parameters

##### fromSequence

`number`

##### toSequence

`number`

#### Returns

`Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md)[]\>

***

### getEventsByType()

> **getEventsByType**(`type`): `Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md)[]\>

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:197](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L197)

Get events by type.

#### Parameters

##### type

[`ProvenanceEventType`](../type-aliases/ProvenanceEventType.md)

#### Returns

`Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md)[]\>

***

### getLatestEvent()

> **getLatestEvent**(): `Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md) \| `null`\>

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:241](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L241)

Get the latest event.

#### Returns

`Promise`\<[`SignedEvent`](../interfaces/SignedEvent.md) \| `null`\>

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/provenance/ledger/SignedEventLedger.ts:62](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/ledger/SignedEventLedger.ts#L62)

Initialize the ledger: load the last sequence number and hash from the DB.

#### Returns

`Promise`\<`void`\>
