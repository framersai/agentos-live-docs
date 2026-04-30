# Function: cosineSimilarity()

> **cosineSimilarity**(`a`, `b`): `number`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:41](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/utils/vectorMath.ts#L41)

Compute cosine similarity between two vectors.

Returns a value in [-1, 1]:
- `1.0`  = identical direction
- `0.0`  = orthogonal (no linear similarity)
- `-1.0` = opposite direction

Returns `0` for empty arrays, mismatched dimensions, or zero-magnitude vectors.

## Parameters

### a

[`VectorLike`](../type-aliases/VectorLike.md)

First vector.

### b

[`VectorLike`](../type-aliases/VectorLike.md)

Second vector (must have same length as `a`).

## Returns

`number`

Cosine similarity in [-1, 1].
