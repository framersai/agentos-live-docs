# Function: computeEncodingWeights()

> **computeEncodingWeights**(`traits`): [`EncodingWeights`](../interfaces/EncodingWeights.md)

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:38](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/encoding/EncodingModel.ts#L38)

Derive per-feature attention weights from HEXACO personality traits.
Each weight is in [0, 1] and modulates how much a given content feature
contributes to encoding strength.

## Parameters

### traits

[`HexacoTraits`](../interfaces/HexacoTraits.md)

## Returns

[`EncodingWeights`](../interfaces/EncodingWeights.md)
