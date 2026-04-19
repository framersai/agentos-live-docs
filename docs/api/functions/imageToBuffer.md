# Function: imageToBuffer()

> **imageToBuffer**(`input`): `Promise`\<`Buffer`\>

Defined in: [packages/agentos/src/media/images/imageToBuffer.ts:41](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/imageToBuffer.ts#L41)

Converts an image input from any of the supported formats into a `Buffer`.

Supported input formats:
- **`Buffer`** — returned as-is.
- **Base64 data URL** — e.g. `data:image/png;base64,iVBOR...`.  The base64
  payload is extracted and decoded.
- **Raw base64 string** — a string that does not look like a URL or file
  path is assumed to be raw base64 data.
- **`file://` URL** — resolved to a local filesystem path and read.
- **HTTP/HTTPS URL** — fetched via `globalThis.fetch` and buffered.
- **Local file path** — any other string is treated as an absolute or
  relative filesystem path and read with `fs.readFile`.

## Parameters

### input

The image in any supported format.

`string` | `Buffer`

## Returns

`Promise`\<`Buffer`\>

A `Buffer` containing the raw image bytes.

## Throws

When `input` is neither a string nor a Buffer.

## Throws

When a remote URL fetch fails or the file cannot be read.

## Example

```ts
const buf1 = await imageToBuffer('data:image/png;base64,iVBOR...');
const buf2 = await imageToBuffer(fs.readFileSync('photo.png'));
const buf3 = await imageToBuffer('https://example.com/photo.png');
const buf4 = await imageToBuffer('/absolute/path/to/image.jpg');
```
