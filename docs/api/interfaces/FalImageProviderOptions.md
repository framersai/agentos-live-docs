# Interface: FalImageProviderOptions

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:157](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/FalImageProvider.ts#L157)

Provider-specific options for Fal.ai image generation.

Pass via `request.providerOptions.fal` when calling
[FalImageProvider.generateImage](../classes/FalImageProvider.md#generateimage).

## Example

```typescript
const result = await provider.generateImage({
  modelId: 'fal-ai/flux/dev',
  prompt: 'A sunset over mountains',
  providerOptions: {
    fal: { num_images: 2, seed: 42 },
  },
});
```

## Properties

### enable\_safety\_checker?

> `optional` **enable\_safety\_checker**: `boolean`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:169](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/FalImageProvider.ts#L169)

Whether to enable the safety checker. Default: true.

***

### guidance\_scale?

> `optional` **guidance\_scale**: `number`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:167](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/FalImageProvider.ts#L167)

Guidance scale for classifier-free guidance.

***

### image\_size?

> `optional` **image\_size**: `string`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:161](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/FalImageProvider.ts#L161)

Image size string (e.g. 'landscape_16_9', 'square_hd', 'portrait_4_3').

***

### num\_images?

> `optional` **num\_images**: `number`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:159](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/FalImageProvider.ts#L159)

Number of images to generate. Default: 1.

***

### num\_inference\_steps?

> `optional` **num\_inference\_steps**: `number`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:165](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/FalImageProvider.ts#L165)

Number of inference steps.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:163](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/images/providers/FalImageProvider.ts#L163)

Random seed for reproducible generation.
