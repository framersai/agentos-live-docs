# Function: blobToEmbedding()

> **blobToEmbedding**(`blob`): `number`[]

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:136](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/utils/vectorMath.ts#L136)

Deserialize a Buffer back to number[].
Creates a Float32Array view over the buffer without copying.

## Parameters

### blob

`Buffer`

Buffer containing raw float32 bytes.

## Returns

`number`[]

The embedding as a number array.
