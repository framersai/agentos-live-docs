# Function: upscaleImage()

> **upscaleImage**(`opts`): `Promise`\<[`UpscaleImageResult`](../interfaces/UpscaleImageResult.md)\>

Defined in: [packages/agentos/src/api/upscaleImage.ts:124](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/upscaleImage.ts#L124)

Upscales an image using a provider-agnostic interface.

Resolves credentials via `resolveMediaProvider()`, initialises the
matching image provider, converts the input image to a `Buffer`, and
dispatches to the provider's `upscaleImage` method.

## Parameters

### opts

[`UpscaleImageOptions`](../interfaces/UpscaleImageOptions.md)

Upscale options including the source image and desired scale.

## Returns

`Promise`\<[`UpscaleImageResult`](../interfaces/UpscaleImageResult.md)\>

A promise resolving to the upscale result with the higher-resolution image.

## Throws

When the resolved provider does not
  implement image upscaling.

## Throws

When no provider can be determined or credentials are missing.

## Example

```ts
const result = await upscaleImage({
  provider: 'stability',
  image: 'https://example.com/lowres.jpg',
  scale: 4,
});
console.log(result.image.dataUrl);
```
