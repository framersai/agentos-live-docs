# Function: yerksDodson()

> **yerksDodson**(`arousal01`): `number`

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:68](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/encoding/EncodingModel.ts#L68)

Encoding quality modifier based on arousal level.
Returns a multiplier in [0.3, 1.0], peaking at arousal = 0.5 (moderate).

  f(a) = 1 - 4 * (a - 0.5)^2

## Parameters

### arousal01

`number`

Arousal normalised to 0..1 range.

## Returns

`number`
