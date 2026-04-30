# Interface: EditImageOptions

Defined in: [packages/agentos/src/api/editImage.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L47)

Options for an [editImage](../functions/editImage.md) call.

## Example

```ts
const result = await editImage({
  provider: 'openai',
  image: 'data:image/png;base64,...',
  prompt: 'Add a rainbow in the sky.',
  mode: 'img2img',
  strength: 0.6,
});
```

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:91](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L91)

Override the provider API key instead of reading from env vars.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:93](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L93)

Override the provider base URL.

***

### capabilities?

> `optional` **capabilities**: `string`[]

Defined in: [packages/agentos/src/api/editImage.ts:118](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L118)

Required provider capabilities for mature/private-adult routing.
Drives UncensoredModelCatalog filtering so callers can ask
for `'face-consistency'` when editing a character's outfit, or
`'img2img'` when the source is a scene the author wants preserved.
Ignored for safe/standard tiers.

***

### image

> **image**: `string` \| `Buffer`

Defined in: [packages/agentos/src/api/editImage.ts:62](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L62)

Source image as a base64 data URL, raw base64 string, `Buffer`,
local file path, or HTTP/HTTPS URL.

***

### mask?

> `optional` **mask**: `string` \| `Buffer`

Defined in: [packages/agentos/src/api/editImage.ts:69](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L69)

Optional mask for inpainting.  White pixels mark regions to be edited;
black pixels mark regions to keep.  Accepts the same formats as `image`.

***

### mode?

> `optional` **mode**: [`ImageEditMode`](../type-aliases/ImageEditMode.md)

Defined in: [packages/agentos/src/api/editImage.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L76)

Edit mode.
- `'img2img'` (default) — prompt-guided transformation.
- `'inpaint'` — mask-guided regional editing.
- `'outpaint'` — extend image borders.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L57)

Model in `provider:model` format (legacy) or plain model name when `provider` is set.

#### Example

```ts
`"openai:gpt-image-1"`, `"stability:sd3-medium"`
```

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/api/editImage.ts:89](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L89)

Number of output images.

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:83](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L83)

Negative prompt describing content to avoid.

***

### policyTier?

> `optional` **policyTier**: `"safe"` \| `"standard"` \| `"mature"` \| `"private-adult"`

Defined in: [packages/agentos/src/api/editImage.ts:110](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L110)

Content policy tier. When `'mature'` or `'private-adult'`, the edit is
rerouted through [PolicyAwareImageRouter](../classes/PolicyAwareImageRouter.md) to pick an uncensored
community model (e.g. IP-Adapter FaceID SDXL for face-consistent
edits, SDXL for generic img2img) and `disable_safety_checker: true`
is applied automatically to the Replicate request so the model's own
NSFW filter does not veto the prompt.

`'safe'` and `'standard'` tiers fall back to whatever `provider` /
`model` the caller supplied (or env-detected defaults), keeping the
existing censored path intact.

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:64](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L64)

Text prompt describing the desired changes.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:52](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L52)

Provider name (e.g. `"openai"`, `"stability"`, `"stable-diffusion-local"`).
When omitted, auto-detection via env vars is attempted.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/api/editImage.ts:95](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L95)

Arbitrary provider-specific options.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/api/editImage.ts:87](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L87)

Seed for reproducibility (provider-dependent support).

***

### size?

> `optional` **size**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:85](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L85)

Output size (e.g. `"1024x1024"`).

***

### strength?

> `optional` **strength**: `number`

Defined in: [packages/agentos/src/api/editImage.ts:81](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L81)

How much to deviate from the source image.
`0` = identical, `1` = completely new.  Default `0.75`.

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/editImage.ts:97](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/editImage.ts#L97)

Optional usage ledger configuration.
