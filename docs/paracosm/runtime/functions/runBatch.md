# Function: runBatch()

> **runBatch**(`config`): `Promise`\<[`BatchManifest`](../interfaces/BatchManifest.md)\>

Defined in: [apps/paracosm/src/runtime/batch.ts:80](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/batch.ts#L80)

Run a batch of simulations across multiple scenarios and leaders.
Each scenario x leader combination produces one BatchResult.

## Parameters

### config

[`BatchConfig`](../interfaces/BatchConfig.md)

## Returns

`Promise`\<[`BatchManifest`](../interfaces/BatchManifest.md)\>
