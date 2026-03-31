# Function: generateVideo()

> **generateVideo**(`opts`): `Promise`\<[`GenerateVideoResult`](../interfaces/GenerateVideoResult.md)\>

Defined in: [packages/agentos/src/api/generateVideo.ts:324](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateVideo.ts#L324)

Generates a video using a provider-agnostic interface.

Resolves provider credentials via explicit options or environment variable
auto-detection, initialises the matching video provider (optionally wrapped
in a fallback chain), and returns a normalised [GenerateVideoResult](../interfaces/GenerateVideoResult.md).

When `opts.image` is provided, the request is routed to
[IVideoGenerator.imageToVideo](../interfaces/IVideoGenerator.md#imagetovideo) for image-to-video generation.
Otherwise, [IVideoGenerator.generateVideo](../interfaces/IVideoGenerator.md#generatevideo) is used for text-to-video.

## Parameters

### opts

[`GenerateVideoOptions`](../interfaces/GenerateVideoOptions.md)

Video generation options.

## Returns

`Promise`\<[`GenerateVideoResult`](../interfaces/GenerateVideoResult.md)\>

A promise resolving to the generation result with video data and metadata.

## Example

```ts
// Text-to-video
const result = await generateVideo({
  prompt: 'A drone flying over a misty forest at sunrise',
  provider: 'runway',
  durationSec: 5,
});
console.log(result.videos[0].url);

// Image-to-video
const i2v = await generateVideo({
  prompt: 'Camera slowly zooms out',
  image: fs.readFileSync('input.png'),
});
```
