# Interface: FluxImageProviderOptions

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:148](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FluxImageProvider.ts#L148)

Provider-specific options for BFL Flux image generation.

These can be passed via `request.providerOptions.bfl` when calling
[FluxImageProvider.generateImage](../classes/FluxImageProvider.md#generateimage).

## Example

```typescript
const result = await provider.generateImage({
  modelId: 'flux-pro-1.1',
  prompt: 'A sunset over mountains',
  providerOptions: {
    bfl: { steps: 30, guidance: 3.5, seed: 42 },
  },
});
```

## Properties

### guidance?

> `optional` **guidance**: `number`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:152](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FluxImageProvider.ts#L152)

Classifier-free guidance scale. Higher = more prompt adherence.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:154](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FluxImageProvider.ts#L154)

Random seed for reproducible generation.

***

### steps?

> `optional` **steps**: `number`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:150](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FluxImageProvider.ts#L150)

Number of diffusion steps. Higher = better quality, slower.
