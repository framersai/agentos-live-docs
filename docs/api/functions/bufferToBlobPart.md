# Function: bufferToBlobPart()

> **bufferToBlobPart**(`input`): `ArrayBuffer`

Defined in: [packages/agentos/src/media/images/imageToBuffer.ts:102](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/imageToBuffer.ts#L102)

Converts a Node.js `Buffer` into a DOM-compatible `BlobPart`.

Recent TypeScript DOM typings require `BlobPart` byte views to be backed by a
concrete `ArrayBuffer`, while `Buffer` is typed as `ArrayBufferLike`. Returning
a plain `Uint8Array` avoids that mismatch for multipart image uploads.

## Parameters

### input

`Buffer`

Raw image bytes stored in a Node.js `Buffer`.

## Returns

`ArrayBuffer`

An `ArrayBuffer` safe to pass into `new Blob([...])`.
