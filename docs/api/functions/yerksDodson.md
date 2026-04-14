# Function: yerksDodson()

> **yerksDodson**(`arousal01`): `number`

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:68](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/encoding/EncodingModel.ts#L68)

Encoding quality modifier based on arousal level.
Returns a multiplier in [0.3, 1.0], peaking at arousal = 0.5 (moderate).

  f(a) = 1 - 4 * (a - 0.5)^2

## Parameters

### arousal01

`number`

Arousal normalised to 0..1 range.

## Returns

`number`
