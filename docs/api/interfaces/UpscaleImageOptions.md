# Interface: UpscaleImageOptions

Defined in: [packages/agentos/src/api/upscaleImage.ts:44](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L44)

Options for an [upscaleImage](../functions/upscaleImage.md) call.

## Example

```ts
const result = await upscaleImage({
  provider: 'stability',
  image: fs.readFileSync('lowres.png'),
  scale: 4,
});
```

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/upscaleImage.ts:73](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L73)

Override the provider API key instead of reading from env vars.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/upscaleImage.ts:75](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L75)

Override the provider base URL.

***

### height?

> `optional` **height**: `number`

Defined in: [packages/agentos/src/api/upscaleImage.ts:71](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L71)

Target height in pixels (alternative to `scale`).

***

### image

> **image**: `string` \| `Buffer`

Defined in: [packages/agentos/src/api/upscaleImage.ts:59](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L59)

Source image as a base64 data URL, raw base64 string, `Buffer`,
local file path, or HTTP/HTTPS URL.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/upscaleImage.ts:54](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L54)

Model identifier.  Most upscale providers use a fixed model so this is
usually left unset.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/upscaleImage.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L49)

Provider name (e.g. `"stability"`, `"replicate"`, `"stable-diffusion-local"`).
When omitted, auto-detection via env vars is attempted.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/api/upscaleImage.ts:77](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L77)

Arbitrary provider-specific options.

***

### scale?

> `optional` **scale**: `2` \| `4`

Defined in: [packages/agentos/src/api/upscaleImage.ts:67](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L67)

Integer scale factor.  `2` doubles each dimension; `4` quadruples them.
When both `scale` and `width`/`height` are provided, explicit dimensions
take precedence.

#### Default

```ts
2
```

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/upscaleImage.ts:79](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L79)

Optional usage ledger configuration.

***

### width?

> `optional` **width**: `number`

Defined in: [packages/agentos/src/api/upscaleImage.ts:69](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/upscaleImage.ts#L69)

Target width in pixels (alternative to `scale`).
