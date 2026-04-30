# Class: TombstoneManager

Defined in: [packages/agentos/src/provenance/enforcement/TombstoneManager.ts:27](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/enforcement/TombstoneManager.ts#L27)

## Constructors

### Constructor

> **new TombstoneManager**(`storageAdapter`, `ledger?`, `tablePrefix?`): `TombstoneManager`

Defined in: [packages/agentos/src/provenance/enforcement/TombstoneManager.ts:32](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/enforcement/TombstoneManager.ts#L32)

#### Parameters

##### storageAdapter

`TombstoneStorageAdapter`

##### ledger?

[`SignedEventLedger`](SignedEventLedger.md) | `null`

##### tablePrefix?

`string` = `''`

#### Returns

`TombstoneManager`

## Methods

### createTombstone()

> **createTombstone**(`tableName`, `whereClause`, `parameters?`, `reason?`, `initiator?`): `Promise`\<[`TombstoneRecord`](../interfaces/TombstoneRecord.md)[]\>

Defined in: [packages/agentos/src/provenance/enforcement/TombstoneManager.ts:52](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/enforcement/TombstoneManager.ts#L52)

Create a tombstone for records about to be deleted.
Call this INSTEAD of executing the DELETE.

#### Parameters

##### tableName

`string`

The table the records belong to.

##### whereClause

`string`

The WHERE clause from the DELETE statement.

##### parameters?

`unknown`[] = `[]`

Parameters for the WHERE clause.

##### reason?

`string` = `'deleted'`

Reason for deletion.

##### initiator?

`string` = `'system'`

Who initiated the deletion (agent ID or 'human').

#### Returns

`Promise`\<[`TombstoneRecord`](../interfaces/TombstoneRecord.md)[]\>

***

### getTombstone()

> **getTombstone**(`tableName`, `recordId`): `Promise`\<[`TombstoneRecord`](../interfaces/TombstoneRecord.md) \| `null`\>

Defined in: [packages/agentos/src/provenance/enforcement/TombstoneManager.ts:137](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/enforcement/TombstoneManager.ts#L137)

Get the tombstone record for a specific record.

#### Parameters

##### tableName

`string`

##### recordId

`string`

#### Returns

`Promise`\<[`TombstoneRecord`](../interfaces/TombstoneRecord.md) \| `null`\>

***

### getTombstones()

> **getTombstones**(`tableName?`): `Promise`\<[`TombstoneRecord`](../interfaces/TombstoneRecord.md)[]\>

Defined in: [packages/agentos/src/provenance/enforcement/TombstoneManager.ts:159](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/enforcement/TombstoneManager.ts#L159)

Get all tombstones for a table.

#### Parameters

##### tableName?

`string`

#### Returns

`Promise`\<[`TombstoneRecord`](../interfaces/TombstoneRecord.md)[]\>

***

### isTombstoned()

> **isTombstoned**(`tableName`, `recordId`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/provenance/enforcement/TombstoneManager.ts:126](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/provenance/enforcement/TombstoneManager.ts#L126)

Check if a record has been tombstoned.

#### Parameters

##### tableName

`string`

##### recordId

`string`

#### Returns

`Promise`\<`boolean`\>
