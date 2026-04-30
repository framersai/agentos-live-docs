# Function: blobToFloat32()

> **blobToFloat32**(`blob`): `Float32Array`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:153](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/utils/vectorMath.ts#L153)

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
