# Function: computeEncodingStrength()

> **computeEncodingStrength**(`currentMood`, `traits`, `contentFeatures`, `contentSentiment?`, `config?`): [`EncodingResult`](../interfaces/EncodingResult.md)

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:175](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/encoding/EncodingModel.ts#L175)

Compute encoding parameters for a new memory trace.

Combines personality-modulated attention, Yerkes-Dodson arousal curve,
mood-congruent encoding bias, and flashbulb detection into a single
encoding result.

## Parameters

### currentMood

[`PADState`](../interfaces/PADState.md)

### traits

[`HexacoTraits`](../interfaces/HexacoTraits.md)

### contentFeatures

[`ContentFeatures`](../interfaces/ContentFeatures.md)

### contentSentiment?

`number` = `0`

### config?

[`EncodingConfig`](../interfaces/EncodingConfig.md) = `DEFAULT_ENCODING_CONFIG`

## Returns

[`EncodingResult`](../interfaces/EncodingResult.md)
