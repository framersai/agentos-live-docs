# Function: computeEncodingWeights()

> **computeEncodingWeights**(`traits`): [`EncodingWeights`](../interfaces/EncodingWeights.md)

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:38](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/encoding/EncodingModel.ts#L38)

Derive per-feature attention weights from HEXACO personality traits.
Each weight is in [0, 1] and modulates how much a given content feature
contributes to encoding strength.

## Parameters

### traits

[`HexacoTraits`](../interfaces/HexacoTraits.md)

## Returns

[`EncodingWeights`](../interfaces/EncodingWeights.md)
