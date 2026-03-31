# Function: blobToEmbedding()

> **blobToEmbedding**(`blob`): `number`[]

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:136](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/utils/vectorMath.ts#L136)

Deserialize a Buffer back to number[].
Creates a Float32Array view over the buffer without copying.

## Parameters

### blob

`Buffer`

Buffer containing raw float32 bytes.

## Returns

`number`[]

The embedding as a number array.
