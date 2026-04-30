# Function: blobToEmbedding()

> **blobToEmbedding**(`blob`): `number`[]

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:136](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/utils/vectorMath.ts#L136)

Deserialize a Buffer back to number[].
Creates a Float32Array view over the buffer without copying.

## Parameters

### blob

`Buffer`

Buffer containing raw float32 bytes.

## Returns

`number`[]

The embedding as a number array.
