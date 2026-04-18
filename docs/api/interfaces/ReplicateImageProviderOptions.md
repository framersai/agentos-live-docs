# Interface: ReplicateImageProviderOptions

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:58](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L58)

## Properties

### aspectRatio?

> `optional` **aspectRatio**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:65](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L65)

***

### controlImage?

> `optional` **controlImage**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:91](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L91)

Control image URL for ControlNet-style guided generation.

Mapped to model-specific inputs:
- Flux Canny (`flux-canny-dev`): `control_image`
- Flux Depth (`flux-depth-dev`): `control_image`

***

### controlType?

> `optional` **controlType**: `"canny"` \| `"depth"` \| `"pose"`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:101](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L101)

Control type hint for automatic model routing when `controlImage` is set
but no explicit model is specified.

- `'canny'` → routes to `black-forest-labs/flux-canny-dev`
- `'depth'` → routes to `black-forest-labs/flux-depth-dev`
- `'pose'` → routes to community pose model (future)

***

### disableSafetyChecker?

> `optional` **disableSafetyChecker**: `boolean`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:68](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L68)

***

### extraBody?

> `optional` **extraBody**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:72](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L72)

***

### goFast?

> `optional` **goFast**: `boolean`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:69](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L69)

***

### input?

> `optional` **input**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:71](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L71)

***

### megapixels?

> `optional` **megapixels**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:70](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L70)

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:63](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L63)

***

### numOutputs?

> `optional` **numOutputs**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:64](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L64)

***

### outputFormat?

> `optional` **outputFormat**: [`ImageOutputFormat`](../type-aliases/ImageOutputFormat.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:66](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L66)

***

### outputQuality?

> `optional` **outputQuality**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:67](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L67)

***

### referenceImageUrl?

> `optional` **referenceImageUrl**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:82](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L82)

Reference image URL for character/face consistency.

Mapped to provider-specific inputs based on the target model:
- Pulid (`zsxkib/pulid`): `main_face_image`
- Flux Redux (`flux-redux-dev`): `image`
- Standard Flux models: `image` with `image_strength` derived from consistency mode

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:62](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L62)

***

### wait?

> `optional` **wait**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:59](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L59)

***

### webhook?

> `optional` **webhook**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:60](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L60)

***

### webhookEventsFilter?

> `optional` **webhookEventsFilter**: `string`[]

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:61](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/images/IImageProvider.ts#L61)
