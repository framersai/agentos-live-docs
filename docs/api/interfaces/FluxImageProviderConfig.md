# Interface: FluxImageProviderConfig

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:64](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FluxImageProvider.ts#L64)

Configuration for the BFL (Black Forest Labs) image provider.

## Example

```typescript
const config: FluxImageProviderConfig = {
  apiKey: process.env.BFL_API_KEY!,
  defaultModelId: 'flux-pro-1.1',
  pollIntervalMs: 1500,
};
```

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:69](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FluxImageProvider.ts#L69)

BFL API key. Sent as `X-Key` header on all requests.
Obtain from https://api.bfl.ml

***

### baseURL?

> `optional` **baseURL**: `string`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:75](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FluxImageProvider.ts#L75)

Base URL for the BFL API. Override for testing or proxy setups.

#### Default

```ts
'https://api.bfl.ml'
```

***

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:81](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FluxImageProvider.ts#L81)

Default Flux model to use when the request doesn't specify one.

#### Default

```ts
'flux-pro-1.1'
```

***

### pollIntervalMs?

> `optional` **pollIntervalMs**: `number`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:87](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FluxImageProvider.ts#L87)

Milliseconds between status polls while waiting for generation.

#### Default

```ts
1000
```

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:93](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FluxImageProvider.ts#L93)

Maximum milliseconds to wait for generation before timing out.

#### Default

```ts
120000
```
