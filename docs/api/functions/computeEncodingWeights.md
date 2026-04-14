# Function: computeEncodingWeights()

> **computeEncodingWeights**(`traits`): [`EncodingWeights`](../interfaces/EncodingWeights.md)

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:38](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/encoding/EncodingModel.ts#L38)

Derive per-feature attention weights from HEXACO personality traits.
Each weight is in [0, 1] and modulates how much a given content feature
contributes to encoding strength.

## Parameters

### traits

[`HexacoTraits`](../interfaces/HexacoTraits.md)

## Returns

[`EncodingWeights`](../interfaces/EncodingWeights.md)
