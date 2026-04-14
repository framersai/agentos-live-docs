# Function: moodCongruenceBoost()

> **moodCongruenceBoost**(`currentValence`, `contentValence`, `emotionalSensitivity`): `number`

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:109](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/encoding/EncodingModel.ts#L109)

Boost factor when content emotional valence matches current mood.

Positive product means mood and content are congruent
(both positive or both negative).

## Parameters

### currentValence

`number`

### contentValence

`number`

### emotionalSensitivity

`number`

## Returns

`number`
