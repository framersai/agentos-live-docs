# Function: embeddingToBlob()

> **embeddingToBlob**(`embedding`): `Buffer`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:125](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/utils/vectorMath.ts#L125)

Serialize a number[] embedding to a compact Float32Array Buffer.
~50% smaller than JSON.stringify and avoids JSON.parse on read.

## Parameters

### embedding

`number`[]

The embedding vector.

## Returns

`Buffer`

Buffer containing raw float32 bytes.
