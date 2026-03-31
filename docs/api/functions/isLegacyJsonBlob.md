# Function: isLegacyJsonBlob()

> **isLegacyJsonBlob**(`blob`): `boolean`

Defined in: [packages/agentos/src/rag/utils/vectorMath.ts:168](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/utils/vectorMath.ts#L168)

Detect whether a stored blob is legacy JSON text or binary format.
JSON blobs start with `[` (0x5B); binary blobs start with raw float bytes.

## Parameters

### blob

The stored embedding data.

`string` | `Buffer`

## Returns

`boolean`

True if the blob is legacy JSON-encoded text.
