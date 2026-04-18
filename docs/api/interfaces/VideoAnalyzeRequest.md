# Interface: VideoAnalyzeRequest

Defined in: [packages/agentos/src/media/video/types.ts:183](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/types.ts#L183)

Request payload for video analysis / understanding.

Passed to [IVideoAnalyzer.analyzeVideo](IVideoAnalyzer.md#analyzevideo).

## Properties

### maxFrames?

> `optional` **maxFrames**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:193](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/types.ts#L193)

Maximum number of frames to sample for analysis.

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:191](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/types.ts#L191)

Model identifier to use for analysis.

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:189](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/types.ts#L189)

Text prompt / question to guide the analysis.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/video/types.ts:195](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/types.ts#L195)

Arbitrary provider-specific options.

***

### videoBuffer?

> `optional` **videoBuffer**: `Buffer`

Defined in: [packages/agentos/src/media/video/types.ts:187](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/types.ts#L187)

Raw video bytes. Mutually exclusive with `videoUrl`.

***

### videoUrl?

> `optional` **videoUrl**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:185](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/types.ts#L185)

URL of the video to analyse. Mutually exclusive with `videoBuffer`.
