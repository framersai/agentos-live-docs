# Function: transferStyle()

> **transferStyle**(`opts`): `Promise`\<`TransferStyleResult`\>

Defined in: [packages/agentos/src/api/transferStyle.ts:132](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/transferStyle.ts#L132)

Transfers the visual aesthetic of a reference image onto a source image.

Routes to the best available provider:
- **Replicate** (Flux Redux): purpose-built for image-guided style transfer
- **Fal** (Flux Dev): img2img with style guidance
- **Stability** (img2img): strength-controlled transformation
- **OpenAI** (edit): prompt-guided editing

## Parameters

### opts

`TransferStyleOptions`

Style transfer options.

## Returns

`Promise`\<`TransferStyleResult`\>

Promise resolving to the transfer result with styled image(s).

## Throws

When no style transfer provider is available.

## Example

```typescript
// Photo to oil painting
const result = await transferStyle({
  image: photoBuffer,
  styleReference: './monet.jpg',
  prompt: 'Impressionist oil painting, warm golden light, visible brushstrokes',
  strength: 0.7,
});
```
