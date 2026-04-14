# Interface: FalImageProviderConfig

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:58](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FalImageProvider.ts#L58)

Configuration for the Fal.ai image provider.

## Example

```typescript
const config: FalImageProviderConfig = {
  apiKey: process.env.FAL_API_KEY!,
  defaultModelId: 'fal-ai/flux/dev',
};
```

## Properties

### apiKey

> **apiKey**: `string`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:63](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FalImageProvider.ts#L63)

Fal.ai API key. Sent as `Authorization: Key ${apiKey}`.
Obtain from https://fal.ai/dashboard/keys

***

### baseURL?

> `optional` **baseURL**: `string`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:69](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FalImageProvider.ts#L69)

Base URL for the Fal.ai queue API. Override for testing or proxy setups.

#### Default

```ts
'https://queue.fal.run'
```

***

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:75](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FalImageProvider.ts#L75)

Default model to use when the request doesn't specify one.

#### Default

```ts
'fal-ai/flux/dev'
```

***

### pollIntervalMs?

> `optional` **pollIntervalMs**: `number`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:81](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FalImageProvider.ts#L81)

Milliseconds between status polls while waiting for generation.

#### Default

```ts
1000
```

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:87](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/providers/FalImageProvider.ts#L87)

Maximum milliseconds to wait for generation before timing out.

#### Default

```ts
120000
```
