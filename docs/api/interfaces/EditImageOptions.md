# Interface: EditImageOptions

Defined in: [packages/agentos/src/api/editImage.ts:47](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L47)

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

Defined in: [packages/agentos/src/api/editImage.ts:92](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L92)

Override the provider API key instead of reading from env vars.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:94](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L94)

Override the provider base URL.

***

### capabilities?

> `optional` **capabilities**: `string`[]

Defined in: [packages/agentos/src/api/editImage.ts:119](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L119)

Required provider capabilities for mature/private-adult routing.
Drives UncensoredModelCatalog filtering so callers can ask
for `'face-consistency'` when editing a character's outfit, or
`'img2img'` when the source is a scene the author wants preserved.
Ignored for safe/standard tiers.

***

### image

> **image**: `string` \| `Buffer`

Defined in: [packages/agentos/src/api/editImage.ts:63](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L63)

Source image as a base64 data URL, raw base64 string, `Buffer`,
local file path, or HTTP/HTTPS URL.

***

### mask?

> `optional` **mask**: `string` \| `Buffer`

Defined in: [packages/agentos/src/api/editImage.ts:70](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L70)

Optional mask for inpainting.  White pixels mark regions to be edited;
black pixels mark regions to keep.  Accepts the same formats as `image`.

***

### mode?

> `optional` **mode**: [`ImageEditMode`](../type-aliases/ImageEditMode.md)

Defined in: [packages/agentos/src/api/editImage.ts:77](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L77)

Edit mode.
- `'img2img'` (default) — prompt-guided transformation.
- `'inpaint'` — mask-guided regional editing.
- `'outpaint'` — extend image borders.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:58](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L58)

Model identifier. Prefer the plain model name with `provider` set;
the combined `"provider:model"` string is also accepted.

#### Example

```ts
`"gpt-image-1"` (with `provider: 'openai'`), `"sd3-medium"`
```

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/api/editImage.ts:90](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L90)

Number of output images.

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:84](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L84)

Negative prompt describing content to avoid.

***

### policyTier?

> `optional` **policyTier**: `"safe"` \| `"standard"` \| `"mature"` \| `"private-adult"`

Defined in: [packages/agentos/src/api/editImage.ts:111](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L111)

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

Defined in: [packages/agentos/src/api/editImage.ts:65](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L65)

Text prompt describing the desired changes.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:52](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L52)

Provider name (e.g. `"openai"`, `"stability"`, `"stable-diffusion-local"`).
When omitted, auto-detection via env vars is attempted.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/api/editImage.ts:96](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L96)

Arbitrary provider-specific options.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/api/editImage.ts:88](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L88)

Seed for reproducibility (provider-dependent support).

***

### size?

> `optional` **size**: `string`

Defined in: [packages/agentos/src/api/editImage.ts:86](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L86)

Output size (e.g. `"1024x1024"`).

***

### strength?

> `optional` **strength**: `number`

Defined in: [packages/agentos/src/api/editImage.ts:82](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L82)

How much to deviate from the source image.
`0` = identical, `1` = completely new.  Default `0.75`.

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/editImage.ts:98](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/editImage.ts#L98)

Optional usage ledger configuration.
