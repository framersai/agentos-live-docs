# Function: createProvenanceHooks()

> **createProvenanceHooks**(`config`, `ledger?`, `revisionManager?`, `tombstoneManager?`): `StorageHooks`

Defined in: [packages/agentos/src/provenance/enforcement/ProvenanceStorageHooks.ts:167](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/provenance/enforcement/ProvenanceStorageHooks.ts#L167)

Create StorageHooks that enforce provenance policies.

## Parameters

### config

[`ProvenanceSystemConfig`](../interfaces/ProvenanceSystemConfig.md)

The provenance system configuration.

### ledger?

[`SignedEventLedger`](../classes/SignedEventLedger.md)

The signed event ledger (optional, for logging events).

### revisionManager?

[`RevisionManager`](../classes/RevisionManager.md)

For capturing revisions in revisioned mode.

### tombstoneManager?

[`TombstoneManager`](../classes/TombstoneManager.md)

For creating tombstones in revisioned mode.

## Returns

`StorageHooks`

StorageHooks compatible with sql-storage-adapter's combineHooks().
