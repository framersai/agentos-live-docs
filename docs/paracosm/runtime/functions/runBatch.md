# Function: runBatch()

> **runBatch**(`config`): `Promise`\<[`BatchManifest`](../interfaces/BatchManifest.md)\>

Defined in: [apps/paracosm/src/runtime/batch.ts:80](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/batch.ts#L80)

Run a batch of simulations across multiple scenarios and leaders.
Each scenario x leader combination produces one BatchResult.

## Parameters

### config

[`BatchConfig`](../interfaces/BatchConfig.md)

## Returns

`Promise`\<[`BatchManifest`](../interfaces/BatchManifest.md)\>
