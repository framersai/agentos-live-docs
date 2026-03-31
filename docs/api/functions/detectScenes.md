# Function: detectScenes()

> **detectScenes**(`opts`): `AsyncGenerator`\<`SceneBoundary`\>

Defined in: [packages/agentos/src/api/detectScenes.ts:115](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/detectScenes.ts#L115)

Detects scene boundaries in a stream of video frames.

Creates a SceneDetector with the supplied configuration and
yields SceneBoundary objects as visual discontinuities are
detected. The generator completes when the input frame stream is
exhausted.

Suitable for both pre-recorded video (extract frames via ffmpeg, then
pipe as an async iterable) and live streams (webcam, security camera,
screen capture).

## Parameters

### opts

[`DetectScenesOptions`](../interfaces/DetectScenesOptions.md)

Scene detection options including the frame source.

## Returns

`AsyncGenerator`\<`SceneBoundary`\>

An AsyncGenerator yielding scene boundaries as they are detected.

## Example

```ts
// Pre-recorded video
const boundaries: SceneBoundary[] = [];
for await (const boundary of detectScenes({ frames: extractFrames('video.mp4') })) {
  console.log(`Scene ${boundary.index} at ${boundary.startTimeSec}s (${boundary.cutType})`);
  boundaries.push(boundary);
}

// Live webcam with custom thresholds
for await (const boundary of detectScenes({
  frames: webcamFrameStream,
  hardCutThreshold: 0.4,
  minSceneDurationSec: 2.0,
})) {
  console.log(`Motion detected at ${boundary.startTimeSec}s`);
}
```
