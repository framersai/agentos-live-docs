# Function: blobToFloat32()

> **blobToFloat32**(`blob`): `Float32Array`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:153](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/utils/vectorMath.ts#L153)

Create a Float32Array view over a Buffer without copying.
Use this when you want to pass directly to distance functions
without converting to number[] first (avoids allocation).

## Parameters

### blob

`Buffer`

Buffer containing raw float32 bytes.

## Returns

`Float32Array`

Float32Array view.
