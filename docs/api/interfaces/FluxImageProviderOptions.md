# Interface: FluxImageProviderOptions

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:149](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FluxImageProvider.ts#L149)

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

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:153](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FluxImageProvider.ts#L153)

Classifier-free guidance scale. Higher = more prompt adherence.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:155](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FluxImageProvider.ts#L155)

Random seed for reproducible generation.

***

### steps?

> `optional` **steps**: `number`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:151](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/media/images/providers/FluxImageProvider.ts#L151)

Number of diffusion steps. Higher = better quality, slower.
