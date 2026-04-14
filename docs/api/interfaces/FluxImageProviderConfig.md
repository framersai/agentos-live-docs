# Interface: FluxImageProviderConfig

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:65](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FluxImageProvider.ts#L65)

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

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:70](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FluxImageProvider.ts#L70)

BFL API key. Sent as `X-Key` header on all requests.
Obtain from https://api.bfl.ml

***

### baseURL?

> `optional` **baseURL**: `string`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:76](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FluxImageProvider.ts#L76)

Base URL for the BFL API. Override for testing or proxy setups.

#### Default

```ts
'https://api.bfl.ml'
```

***

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:82](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FluxImageProvider.ts#L82)

Default Flux model to use when the request doesn't specify one.

#### Default

```ts
'flux-pro-1.1'
```

***

### pollIntervalMs?

> `optional` **pollIntervalMs**: `number`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:88](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FluxImageProvider.ts#L88)

Milliseconds between status polls while waiting for generation.

#### Default

```ts
1000
```

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/media/images/providers/FluxImageProvider.ts:94](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FluxImageProvider.ts#L94)

Maximum milliseconds to wait for generation before timing out.

#### Default

```ts
120000
```
