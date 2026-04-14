# Function: analyzeVideo()

> **analyzeVideo**(`opts`): `Promise`\<[`AnalyzeVideoResult`](../interfaces/AnalyzeVideoResult.md)\>

Defined in: [packages/agentos/src/api/analyzeVideo.ts:198](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/analyzeVideo.ts#L198)

Analyses a video and returns structured understanding results.

Creates a [VideoAnalyzer](../classes/VideoAnalyzer.md) (backed by auto-detected
VisionPipeline + STT when available), dispatches the analysis
request, and returns a normalised [AnalyzeVideoResult](../interfaces/AnalyzeVideoResult.md).

## Parameters

### opts

[`AnalyzeVideoOptions`](../interfaces/AnalyzeVideoOptions.md)

Video analysis options.

## Returns

`Promise`\<[`AnalyzeVideoResult`](../interfaces/AnalyzeVideoResult.md)\>

A promise resolving to the analysis result with description,
  scenes, objects, text, and optional RAG indexing metadata.

## Example

```ts
const analysis = await analyzeVideo({
  videoUrl: 'https://example.com/demo.mp4',
  prompt: 'What products are shown in this video?',
  transcribeAudio: true,
  descriptionDetail: 'detailed',
});
console.log(analysis.description);
for (const scene of analysis.scenes ?? []) {
  console.log(`[${scene.startSec}s] ${scene.description}`);
}
```
