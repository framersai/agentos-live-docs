# Function: blobToEmbedding()

> **blobToEmbedding**(`blob`): `number`[]

Defined in: [packages/agentos/src/cognition/rag/utils/vectorMath.ts:136](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/utils/vectorMath.ts#L136)

Deserialize a Buffer back to number[].
Creates a Float32Array view over the buffer without copying.

## Parameters

### blob

`Buffer`

Buffer containing raw float32 bytes.

## Returns

`number`[]

The embedding as a number array.
