# Function: editImage()

> **editImage**(`opts`): `Promise`\<[`EditImageResult`](../interfaces/EditImageResult.md)\>

Defined in: [packages/agentos/src/api/editImage.ts:173](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L173)

Edits an image using a provider-agnostic interface.

Resolves credentials via `resolveMediaProvider()`, initialises the
matching image provider, converts the input image to a `Buffer`, and
dispatches to the provider's `editImage` method.

## Parameters

### opts

[`EditImageOptions`](../interfaces/EditImageOptions.md)

Image editing options.

## Returns

`Promise`\<[`EditImageResult`](../interfaces/EditImageResult.md)\>

A promise resolving to the edit result with image data and metadata.

## Throws

When the resolved provider does not
  implement image editing.

## Throws

When no provider can be determined or credentials are missing.

## Example

```ts
// Img2img transformation
const result = await editImage({
  provider: 'stability',
  image: fs.readFileSync('landscape.png'),
  prompt: 'Convert the daytime scene to a starry night.',
  strength: 0.7,
});

// Inpainting with mask
const inpainted = await editImage({
  provider: 'openai',
  image: 'data:image/png;base64,...',
  mask: 'data:image/png;base64,...',
  prompt: 'Replace the sky with aurora borealis.',
  mode: 'inpaint',
});
```
