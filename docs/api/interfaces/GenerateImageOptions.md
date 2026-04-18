# Interface: GenerateImageOptions

Defined in: [packages/agentos/src/api/generateImage.ts:149](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L149)

Options for a [generateImage](../functions/generateImage.md) call.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:185](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L185)

Override the provider API key instead of reading from environment variables.

***

### aspectRatio?

> `optional` **aspectRatio**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:173](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L173)

Aspect ratio string, e.g. `"16:9"`. Used by some providers instead of `size`.

***

### background?

> `optional` **background**: [`ImageBackground`](../type-aliases/ImageBackground.md)

Defined in: [packages/agentos/src/api/generateImage.ts:177](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L177)

Background style for transparent-capable providers.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:187](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L187)

Override the provider base URL.

***

### consistencyMode?

> `optional` **consistencyMode**: `"balanced"` \| `"strict"` \| `"loose"`

Defined in: [packages/agentos/src/api/generateImage.ts:215](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L215)

Character consistency mode: 'strict' | 'balanced' | 'loose'. Default 'balanced'.

***

### faceEmbedding?

> `optional` **faceEmbedding**: `number`[]

Defined in: [packages/agentos/src/api/generateImage.ts:213](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L213)

Pre-computed 512-dim face embedding for drift detection.

***

### modalities?

> `optional` **modalities**: [`ImageModality`](../type-aliases/ImageModality.md)[]

Defined in: [packages/agentos/src/api/generateImage.ts:167](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L167)

Output modalities requested from the provider (provider-dependent).

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:163](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L163)

Model in `provider:model` format (legacy) or plain model name when `provider` is set.

#### Example

```ts
`"openai:dall-e-3"`, `"stability:stable-diffusion-xl-1024-v1-0"`

Either `provider` or `model` (or an API key env var for auto-detection) is required.
```

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/api/generateImage.ts:169](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L169)

Number of images to generate. Defaults to `1` for most providers.

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:193](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L193)

Negative prompt describing content to avoid (provider-dependent support).

***

### outputCompression?

> `optional` **outputCompression**: `number`

Defined in: [packages/agentos/src/api/generateImage.ts:181](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L181)

Compression level (0–100) for lossy output formats.

***

### outputFormat?

> `optional` **outputFormat**: [`ImageOutputFormat`](../type-aliases/ImageOutputFormat.md)

Defined in: [packages/agentos/src/api/generateImage.ts:179](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L179)

Desired output file format (e.g. `"png"`, `"jpeg"`, `"webp"`).

***

### policyTier?

> `optional` **policyTier**: `"safe"` \| `"standard"` \| `"mature"` \| `"private-adult"`

Defined in: [packages/agentos/src/api/generateImage.ts:207](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L207)

Content policy tier. When mature or private-adult, the image provider
chain is reordered to prefer uncensored providers (Replicate, Fal)
over censored ones (DALL-E, Stability safe mode).

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:165](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L165)

Text description of the desired image.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:156](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L156)

Provider name.  When supplied without `model`, the default image model for
the provider is resolved automatically from the built-in defaults registry.

#### Example

```ts
`"openai"`, `"stability"`, `"replicate"`
```

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/api/generateImage.ts:195](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L195)

Arbitrary provider-specific options not covered by the standard fields.

***

### providerPreferences?

> `optional` **providerPreferences**: [`MediaProviderPreference`](MediaProviderPreference.md)

Defined in: [packages/agentos/src/api/generateImage.ts:201](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L201)

Provider preferences for reordering or filtering the fallback chain.
When supplied, the available image providers are reordered according to
`preferred` and filtered by `blocked` before building the chain.

***

### quality?

> `optional` **quality**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:175](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L175)

Quality hint forwarded to the provider (e.g. `"hd"` for DALL-E 3).

***

### referenceImageUrl?

> `optional` **referenceImageUrl**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:211](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L211)

Reference image URL for character/face consistency. See IImageProvider docs.

***

### responseFormat?

> `optional` **responseFormat**: [`ImageResponseFormat`](../type-aliases/ImageResponseFormat.md)

Defined in: [packages/agentos/src/api/generateImage.ts:183](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L183)

Whether the provider should return a URL or base64-encoded data.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/api/generateImage.ts:191](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L191)

Random seed for reproducible generation (provider-dependent support).

***

### size?

> `optional` **size**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:171](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L171)

Pixel dimensions string, e.g. `"1024x1024"`. Provider-dependent.

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/generateImage.ts:209](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L209)

Optional durable usage ledger configuration for helper-level accounting.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/api/generateImage.ts:189](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateImage.ts#L189)

Optional user identifier forwarded to the provider for moderation tracking.
