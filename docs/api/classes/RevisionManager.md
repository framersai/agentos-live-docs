# Class: RevisionManager

Defined in: [packages/agentos/src/provenance/enforcement/RevisionManager.ts:28](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/enforcement/RevisionManager.ts#L28)

## Constructors

### Constructor

> **new RevisionManager**(`storageAdapter`, `ledger?`, `tablePrefix?`): `RevisionManager`

Defined in: [packages/agentos/src/provenance/enforcement/RevisionManager.ts:33](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/enforcement/RevisionManager.ts#L33)

#### Parameters

##### storageAdapter

`RevisionStorageAdapter`

##### ledger?

[`SignedEventLedger`](SignedEventLedger.md) | `null`

##### tablePrefix?

`string` = `''`

#### Returns

`RevisionManager`

## Methods

### captureRevision()

> **captureRevision**(`tableName`, `whereClause`, `parameters?`): `Promise`\<[`RevisionRecord`](../interfaces/RevisionRecord.md)[]\>

Defined in: [packages/agentos/src/provenance/enforcement/RevisionManager.ts:51](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/enforcement/RevisionManager.ts#L51)

Capture the current state of records that are about to be updated.
Call this BEFORE the UPDATE executes.

#### Parameters

##### tableName

`string`

The table being updated.

##### whereClause

`string`

The WHERE clause from the UPDATE statement (without "WHERE").

##### parameters?

`unknown`[] = `[]`

Parameters for the WHERE clause.

#### Returns

`Promise`\<[`RevisionRecord`](../interfaces/RevisionRecord.md)[]\>

***

### getLatestRevision()

> **getLatestRevision**(`tableName`, `recordId`): `Promise`\<[`RevisionRecord`](../interfaces/RevisionRecord.md) \| `null`\>

Defined in: [packages/agentos/src/provenance/enforcement/RevisionManager.ts:139](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/enforcement/RevisionManager.ts#L139)

Get the latest revision for a specific record.

#### Parameters

##### tableName

`string`

##### recordId

`string`

#### Returns

`Promise`\<[`RevisionRecord`](../interfaces/RevisionRecord.md) \| `null`\>

***

### getRevisions()

> **getRevisions**(`tableName`, `recordId`): `Promise`\<[`RevisionRecord`](../interfaces/RevisionRecord.md)[]\>

Defined in: [packages/agentos/src/provenance/enforcement/RevisionManager.ts:117](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/enforcement/RevisionManager.ts#L117)

Get all revisions for a specific record.

#### Parameters

##### tableName

`string`

##### recordId

`string`

#### Returns

`Promise`\<[`RevisionRecord`](../interfaces/RevisionRecord.md)[]\>
