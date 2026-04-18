# Function: createProvenanceHooks()

> **createProvenanceHooks**(`config`, `ledger?`, `revisionManager?`, `tombstoneManager?`): `StorageHooks`

Defined in: [packages/agentos/src/provenance/enforcement/ProvenanceStorageHooks.ts:167](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/enforcement/ProvenanceStorageHooks.ts#L167)

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
