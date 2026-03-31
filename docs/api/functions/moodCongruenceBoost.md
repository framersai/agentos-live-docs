# Function: moodCongruenceBoost()

> **moodCongruenceBoost**(`currentValence`, `contentValence`, `emotionalSensitivity`): `number`

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:109](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/encoding/EncodingModel.ts#L109)

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
