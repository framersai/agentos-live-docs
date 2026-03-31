# Function: euclideanDistance()

> **euclideanDistance**(`a`, `b`): `number`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:103](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/utils/vectorMath.ts#L103)

Compute the Euclidean (L2) distance between two vectors.

Lower values indicate more similar vectors:
- `0.0` = identical vectors
- Increases with divergence

Returns `0` for empty arrays or mismatched dimensions.

## Parameters

### a

[`VectorLike`](../type-aliases/VectorLike.md)

First vector.

### b

[`VectorLike`](../type-aliases/VectorLike.md)

Second vector (must have same length as `a`).

## Returns

`number`

Non-negative L2 distance.
