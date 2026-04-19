# Function: runBatch()

> **runBatch**(`config`): `Promise`\<[`BatchManifest`](../interfaces/BatchManifest.md)\>

Defined in: [runtime/batch.ts:72](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/batch.ts#L72)

Run a batch of simulations across multiple scenarios and leaders.
Each scenario x leader combination produces one BatchResult.

## Parameters

### config

[`BatchConfig`](../interfaces/BatchConfig.md)

## Returns

`Promise`\<[`BatchManifest`](../interfaces/BatchManifest.md)\>
