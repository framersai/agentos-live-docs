# Interface: DetectScenesOptions

Defined in: [packages/agentos/src/api/detectScenes.ts:32](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/detectScenes.ts#L32)

Options for a [detectScenes](../functions/detectScenes.md) call.

At minimum, a `frames` async iterable must be provided. All other
options are optional and map to SceneDetectorConfig fields.

## Properties

### clipProvider?

> `optional` **clipProvider**: `"openai"` \| `"local"`

Defined in: [packages/agentos/src/api/detectScenes.ts:74](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/detectScenes.ts#L74)

CLIP embedding provider for semantic scene detection.
Only used when `methods` includes `'clip'`.

#### Default

```ts
'local'
```

***

### frames

> **frames**: `AsyncIterable`\<`Frame`\>

Defined in: [packages/agentos/src/api/detectScenes.ts:38](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/detectScenes.ts#L38)

Async iterable of decoded video frames in time order.
Each frame must contain a raw RGB pixel buffer, a timestamp,
and a sequential index.

***

### gradualThreshold?

> `optional` **gradualThreshold**: `number`

Defined in: [packages/agentos/src/api/detectScenes.ts:60](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/detectScenes.ts#L60)

Diff score threshold for gradual transitions (dissolves, fades).
Transitions with scores between this and `hardCutThreshold`
are classified as gradual cuts.

#### Default

```ts
0.15
```

***

### hardCutThreshold?

> `optional` **hardCutThreshold**: `number`

Defined in: [packages/agentos/src/api/detectScenes.ts:52](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/detectScenes.ts#L52)

Diff score threshold above which a frame transition is classified
as a hard cut. Applied to histogram chi-squared distance (0-1).

#### Default

```ts
0.3
```

***

### methods?

> `optional` **methods**: `SceneDetectionMethod`[]

Defined in: [packages/agentos/src/api/detectScenes.ts:45](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/detectScenes.ts#L45)

Detection methods to use. Multiple methods are combined by
taking the maximum diff score across all methods.

#### Default

```ts
['histogram', 'ssim']
```

***

### minSceneDurationSec?

> `optional` **minSceneDurationSec**: `number`

Defined in: [packages/agentos/src/api/detectScenes.ts:67](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/detectScenes.ts#L67)

Minimum scene duration in seconds. Scene boundaries that would
create scenes shorter than this are suppressed.

#### Default

```ts
1.0
```
