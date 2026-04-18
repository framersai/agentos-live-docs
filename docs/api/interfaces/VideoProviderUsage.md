# Interface: VideoProviderUsage

Defined in: [packages/agentos/src/media/video/types.ts:55](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/types.ts#L55)

Aggregated usage / billing counters for a video generation session.

## Properties

### processingTimeMs?

> `optional` **processingTimeMs**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:61](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/types.ts#L61)

Total processing time in milliseconds.

***

### totalCostUSD?

> `optional` **totalCostUSD**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:59](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/types.ts#L59)

Total cost in USD, if the provider reports it.

***

### totalVideos

> **totalVideos**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:57](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/video/types.ts#L57)

Number of videos generated in this session.
