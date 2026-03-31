# Function: blobToEmbedding()

> **blobToEmbedding**(`blob`): `number`[]

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:136](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/utils/vectorMath.ts#L136)

Deserialize a Buffer back to number[].
Creates a Float32Array view over the buffer without copying.

## Parameters

### blob

`Buffer`

Buffer containing raw float32 bytes.

## Returns

`number`[]

The embedding as a number array.
