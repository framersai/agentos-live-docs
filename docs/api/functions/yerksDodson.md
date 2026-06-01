# Function: yerksDodson()

> **yerksDodson**(`arousal01`): `number`

Defined in: [packages/agentos/src/cognition/memory/core/encoding/EncodingModel.ts:68](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/encoding/EncodingModel.ts#L68)

Encoding quality modifier based on arousal level.
Returns a multiplier in [0.3, 1.0], peaking at arousal = 0.5 (moderate).

  f(a) = 1 - 4 * (a - 0.5)^2

## Parameters

### arousal01

`number`

Arousal normalised to 0..1 range.

## Returns

`number`
