# Function: embeddingToBlob()

> **embeddingToBlob**(`embedding`): `Buffer`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:125](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/utils/vectorMath.ts#L125)

Serialize a number[] embedding to a compact Float32Array Buffer.
~50% smaller than JSON.stringify and avoids JSON.parse on read.

## Parameters

### embedding

`number`[]

The embedding vector.

## Returns

`Buffer`

Buffer containing raw float32 bytes.
