# Interface: GenerateVideoOptions

Defined in: [packages/agentos/src/api/generateVideo.ts:203](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L203)

Options for a [generateVideo](../functions/generateVideo.md) call.

At minimum, a `prompt` is required. The provider is resolved from
`opts.provider`, `opts.apiKey`, or the first video-capable env var
found (`RUNWAY_API_KEY` -> `REPLICATE_API_TOKEN` -> `FAL_API_KEY`).

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/generateVideo.ts:255](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L255)

Override the provider API key instead of reading from env vars.

***

### aspectRatio?

> `optional` **aspectRatio**: [`VideoAspectRatio`](../type-aliases/VideoAspectRatio.md)

Defined in: [packages/agentos/src/api/generateVideo.ts:231](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L231)

Desired aspect ratio (e.g. `"16:9"`, `"9:16"`).

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/generateVideo.ts:258](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L258)

Override the provider base URL.

***

### durationSec?

> `optional` **durationSec**: `number`

Defined in: [packages/agentos/src/api/generateVideo.ts:228](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L228)

Desired output duration in seconds.

***

### image?

> `optional` **image**: `Buffer`

Defined in: [packages/agentos/src/api/generateVideo.ts:212](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L212)

Source image for image-to-video generation. When provided, the
request is dispatched to `imageToVideo()` instead of `generateVideo()`.
Accepts a raw `Buffer`.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateVideo.ts:225](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L225)

Model identifier within the provider (e.g. `"gen3a_turbo"`,
`"klingai/kling-v1"`). When omitted, the provider's default model
is used.

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/api/generateVideo.ts:237](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L237)

Negative prompt describing content to avoid.

***

### onProgress()?

> `optional` **onProgress**: (`event`) => `void`

Defined in: [packages/agentos/src/api/generateVideo.ts:252](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L252)

Optional progress callback invoked during long-running generation.
Called with a [VideoProgressEvent](VideoProgressEvent.md) at each status transition.

#### Parameters

##### event

[`VideoProgressEvent`](VideoProgressEvent.md)

#### Returns

`void`

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/api/generateVideo.ts:205](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L205)

Text prompt describing the desired video content.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/generateVideo.ts:218](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L218)

Explicit provider identifier (e.g. `"runway"`, `"replicate"`, `"fal"`).
When omitted, auto-detection from environment variables is used.

***

### providerPreferences?

> `optional` **providerPreferences**: [`MediaProviderPreference`](MediaProviderPreference.md)

Defined in: [packages/agentos/src/api/generateVideo.ts:265](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L265)

Provider preferences for reordering or filtering the fallback chain.
When supplied, the available video providers are reordered according to
`preferred` and filtered by `blocked` before building the chain.

***

### resolution?

> `optional` **resolution**: `string`

Defined in: [packages/agentos/src/api/generateVideo.ts:234](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L234)

Desired output resolution (e.g. `"1280x720"`, `"720p"`).

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/api/generateVideo.ts:240](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L240)

Random seed for reproducible generation (provider-dependent).

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/api/generateVideo.ts:246](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L246)

Maximum time in milliseconds to wait for generation to complete.
Provider-dependent — not all providers honour client-side timeouts.

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/generateVideo.ts:268](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateVideo.ts#L268)

Optional durable usage ledger configuration for accounting.
