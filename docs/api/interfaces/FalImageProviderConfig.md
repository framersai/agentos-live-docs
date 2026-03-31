# Interface: FalImageProviderConfig

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:56](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FalImageProvider.ts#L56)

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

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:61](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FalImageProvider.ts#L61)

Fal.ai API key. Sent as `Authorization: Key ${apiKey}`.
Obtain from https://fal.ai/dashboard/keys

***

### baseURL?

> `optional` **baseURL**: `string`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:67](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FalImageProvider.ts#L67)

Base URL for the Fal.ai queue API. Override for testing or proxy setups.

#### Default

```ts
'https://queue.fal.run'
```

***

### defaultModelId?

> `optional` **defaultModelId**: `string`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:73](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FalImageProvider.ts#L73)

Default model to use when the request doesn't specify one.

#### Default

```ts
'fal-ai/flux/dev'
```

***

### pollIntervalMs?

> `optional` **pollIntervalMs**: `number`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:79](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FalImageProvider.ts#L79)

Milliseconds between status polls while waiting for generation.

#### Default

```ts
1000
```

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/media/images/providers/FalImageProvider.ts:85](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/images/providers/FalImageProvider.ts#L85)

Maximum milliseconds to wait for generation before timing out.

#### Default

```ts
120000
```
