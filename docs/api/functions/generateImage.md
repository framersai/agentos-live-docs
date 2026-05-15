# Function: generateImage()

> **generateImage**(`opts`): `Promise`\<[`GenerateImageResult`](../interfaces/GenerateImageResult.md)\>

Defined in: [packages/agentos/src/api/generateImage.ts:266](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateImage.ts#L266)

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
  provider: 'openai', model: 'dall-e-3',
  prompt: 'A photorealistic red panda sitting on a moonlit rooftop.',
  size: '1024x1024',
});
console.log(result.images[0].url);
```
