# Function: isLegacyJsonBlob()

> **isLegacyJsonBlob**(`blob`): `boolean`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:168](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/utils/vectorMath.ts#L168)

Detect whether a stored blob is legacy JSON text or binary format.
JSON blobs start with `[` (0x5B); binary blobs start with raw float bytes.

## Parameters

### blob

The stored embedding data.

`string` | `Buffer`

## Returns

`boolean`

True if the blob is legacy JSON-encoded text.
