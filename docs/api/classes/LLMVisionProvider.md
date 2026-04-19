# Class: LLMVisionProvider

Defined in: [packages/agentos/src/vision/providers/LLMVisionProvider.ts:119](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/vision/providers/LLMVisionProvider.ts#L119)

Vision provider that delegates to a cloud LLM via `generateText()`.

Satisfies the narrow [IVisionProvider](../interfaces/IVisionProvider.md) contract used by the
[MultimodalIndexer](MultimodalIndexer.md), allowing any vision-capable LLM to serve
as the image description backend.

## Example

```typescript
const provider = new LLMVisionProvider({ provider: 'openai' });
const indexer = new MultimodalIndexer({
  embeddingManager,
  vectorStore,
  visionProvider: provider,
});
```

## Implements

- [`IVisionProvider`](../interfaces/IVisionProvider.md)

## Constructors

### Constructor

> **new LLMVisionProvider**(`config`): `LLMVisionProvider`

Defined in: [packages/agentos/src/vision/providers/LLMVisionProvider.ts:141](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/vision/providers/LLMVisionProvider.ts#L141)

Create a new LLM vision provider.

#### Parameters

##### config

[`LLMVisionProviderConfig`](../interfaces/LLMVisionProviderConfig.md)

Provider configuration specifying which LLM to use.

#### Returns

`LLMVisionProvider`

#### Throws

If `config.provider` is not specified.

#### Example

```typescript
const provider = new LLMVisionProvider({
  provider: 'anthropic',
  model: 'claude-sonnet-4-20250514',
});
```

## Methods

### describeImage()

> **describeImage**(`image`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/vision/providers/LLMVisionProvider.ts:175](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/vision/providers/LLMVisionProvider.ts#L175)

Generate a text description of the provided image using a cloud
vision LLM.

The image is sent as a base64 data URL in a multimodal message
to the configured provider. The LLM's response is returned as-is.

#### Parameters

##### image

`string`

Image as a URL string (https://...) or base64 data URL
  (data:image/png;base64,...).

#### Returns

`Promise`\<`string`\>

Detailed text description of the image content.

#### Throws

If the LLM call fails.

#### Throws

If the LLM returns an empty response.

#### Example

```typescript
const description = await provider.describeImage(
  'data:image/png;base64,iVBORw0KGgoAAAA...'
);
console.log(description);
// "A golden retriever playing fetch on a sandy beach..."
```

#### Implementation of

[`IVisionProvider`](../interfaces/IVisionProvider.md).[`describeImage`](../interfaces/IVisionProvider.md#describeimage)
