# Function: generateImage()

> **generateImage**(`opts`): `Promise`\<[`GenerateImageResult`](../interfaces/GenerateImageResult.md)\>

Defined in: [packages/agentos/src/api/generateImage.ts:243](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateImage.ts#L243)

Generates one or more images using a provider-agnostic `provider:model` string.

Resolves credentials via `resolveMediaProvider()`, initialises the matching
image provider, and returns a normalised [GenerateImageResult](../interfaces/GenerateImageResult.md).

## Parameters

### opts

[`GenerateImageOptions`](../interfaces/GenerateImageOptions.md)

Image generation options including model, prompt, and optional parameters.

## Returns

`Promise`\<[`GenerateImageResult`](../interfaces/GenerateImageResult.md)\>

A promise resolving to the generation result with image data and metadata.

## Example

```ts
const result = await generateImage({
  model: 'openai:dall-e-3',
  prompt: 'A photorealistic red panda sitting on a moonlit rooftop.',
  size: '1024x1024',
});
console.log(result.images[0].url);
```
