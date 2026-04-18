# Function: embeddingToBlob()

> **embeddingToBlob**(`embedding`): `Buffer`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:125](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/utils/vectorMath.ts#L125)

Serialize a number[] embedding to a compact Float32Array Buffer.
~50% smaller than JSON.stringify and avoids JSON.parse on read.

## Parameters

### embedding

`number`[]

The embedding vector.

## Returns

`Buffer`

Buffer containing raw float32 bytes.
