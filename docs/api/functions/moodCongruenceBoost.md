# Function: moodCongruenceBoost()

> **moodCongruenceBoost**(`currentValence`, `contentValence`, `emotionalSensitivity`): `number`

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:109](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/encoding/EncodingModel.ts#L109)

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
