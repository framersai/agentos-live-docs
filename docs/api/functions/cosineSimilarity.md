# Function: cosineSimilarity()

> **cosineSimilarity**(`a`, `b`): `number`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:41](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/utils/vectorMath.ts#L41)

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
