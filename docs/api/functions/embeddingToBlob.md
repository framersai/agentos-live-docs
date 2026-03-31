# Function: embeddingToBlob()

> **embeddingToBlob**(`embedding`): `Buffer`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:125](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/utils/vectorMath.ts#L125)

Serialize a number[] embedding to a compact Float32Array Buffer.
~50% smaller than JSON.stringify and avoids JSON.parse on read.

## Parameters

### embedding

`number`[]

The embedding vector.

## Returns

`Buffer`

Buffer containing raw float32 bytes.
