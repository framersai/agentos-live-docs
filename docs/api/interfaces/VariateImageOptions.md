# Interface: VariateImageOptions

Defined in: [packages/agentos/src/api/variateImage.ts:45](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/variateImage.ts#L45)

Options for a [variateImage](../functions/variateImage.md) call.

## Example

```ts
const result = await variateImage({
  provider: 'openai',
  image: fs.readFileSync('hero.png'),
  n: 3,
  variance: 0.4,
});
```

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/variateImage.ts:80](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/variateImage.ts#L80)

Override the provider API key.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/variateImage.ts:82](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/variateImage.ts#L82)

Override the provider base URL.

***

### image

> **image**: `string` \| `Buffer`

Defined in: [packages/agentos/src/api/variateImage.ts:60](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/variateImage.ts#L60)

Source image as a base64 data URL, raw base64 string, `Buffer`,
local file path, or HTTP/HTTPS URL.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/variateImage.ts:55](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/variateImage.ts#L55)

Model identifier.  When omitted, the provider's default variation model
is used (e.g. `dall-e-2` for OpenAI).

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/api/variateImage.ts:65](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/variateImage.ts#L65)

Number of variations to generate.

#### Default

```ts
1
```

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/variateImage.ts:50](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/variateImage.ts#L50)

Provider name (e.g. `"openai"`, `"stability"`, `"stable-diffusion-local"`).
When omitted, auto-detection via env vars is attempted.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/api/variateImage.ts:84](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/variateImage.ts#L84)

Arbitrary provider-specific options.

***

### size?

> `optional` **size**: `string`

Defined in: [packages/agentos/src/api/variateImage.ts:78](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/variateImage.ts#L78)

Desired output size (e.g. `"1024x1024"`).

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/variateImage.ts:86](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/variateImage.ts#L86)

Optional usage ledger configuration.

***

### variance?

> `optional` **variance**: `number`

Defined in: [packages/agentos/src/api/variateImage.ts:76](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/variateImage.ts#L76)

How different from the original each variation should be.
`0` = nearly identical, `1` = very different.

For providers that support strength/denoising (Stability, A1111), this is
mapped to that parameter.  OpenAI's variations API does not expose a
strength control so this value is advisory only.

#### Default

```ts
0.5
```
