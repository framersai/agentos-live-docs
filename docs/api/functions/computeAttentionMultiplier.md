# Function: computeAttentionMultiplier()

> **computeAttentionMultiplier**(`weights`, `features`): `number`

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:81](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/encoding/EncodingModel.ts#L81)

Compute a composite attention multiplier from content features weighted
by personality-derived encoding weights.

## Parameters

### weights

[`EncodingWeights`](../interfaces/EncodingWeights.md)

### features

[`ContentFeatures`](../interfaces/ContentFeatures.md)

## Returns

`number`
