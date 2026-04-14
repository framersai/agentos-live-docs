# Function: variateImage()

> **variateImage**(`opts`): `Promise`\<[`VariateImageResult`](../interfaces/VariateImageResult.md)\>

Defined in: [packages/agentos/src/api/variateImage.ts:134](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/variateImage.ts#L134)

Generates visual variations of a source image using a provider-agnostic interface.

Resolves credentials via `resolveMediaProvider()`, initialises the
matching image provider, converts the input image to a `Buffer`, and
dispatches to the provider's `variateImage` method.

For providers without a native variation endpoint, the high-level API falls
back to an img2img call with `strength = variance` to produce similar output.

## Parameters

### opts

[`VariateImageOptions`](../interfaces/VariateImageOptions.md)

Variation options including the source image and desired count.

## Returns

`Promise`\<[`VariateImageResult`](../interfaces/VariateImageResult.md)\>

A promise resolving to the variation result with image data.

## Throws

When the resolved provider does not
  implement image variations and has no img2img fallback.

## Throws

When no provider can be determined or credentials are missing.

## Example

```ts
const result = await variateImage({
  provider: 'openai',
  image: 'https://example.com/hero.png',
  n: 4,
});
result.images.forEach((img, i) => console.log(`Variation ${i}:`, img.url));
```
