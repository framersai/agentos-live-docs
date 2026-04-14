# Function: dotProduct()

> **dotProduct**(`a`, `b`): `number`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:76](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/utils/vectorMath.ts#L76)

Compute the dot product (inner product) of two vectors.

Higher values indicate more similar vectors (for normalized vectors,
dot product equals cosine similarity).

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

The scalar dot product.
