# Function: embeddingToBlob()

> **embeddingToBlob**(`embedding`): `Buffer`

Defined in: [packages/agentos/src/cognition/rag/utils/vectorMath.ts:125](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/utils/vectorMath.ts#L125)

Serialize a number[] embedding to a compact Float32Array Buffer.
~50% smaller than JSON.stringify and avoids JSON.parse on read.

## Parameters

### embedding

`number`[]

The embedding vector.

## Returns

`Buffer`

Buffer containing raw float32 bytes.
