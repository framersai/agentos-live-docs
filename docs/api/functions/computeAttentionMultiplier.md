# Function: computeAttentionMultiplier()

> **computeAttentionMultiplier**(`weights`, `features`): `number`

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:81](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/encoding/EncodingModel.ts#L81)

Compute a composite attention multiplier from content features weighted
by personality-derived encoding weights.

## Parameters

### weights

[`EncodingWeights`](../interfaces/EncodingWeights.md)

### features

[`ContentFeatures`](../interfaces/ContentFeatures.md)

## Returns

`number`
