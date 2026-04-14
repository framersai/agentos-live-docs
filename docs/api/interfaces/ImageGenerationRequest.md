# Interface: ImageGenerationRequest

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:140](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L140)

## Properties

### aspectRatio?

> `optional` **aspectRatio**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:146](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L146)

***

### background?

> `optional` **background**: [`ImageBackground`](../type-aliases/ImageBackground.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:148](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L148)

***

### consistencyMode?

> `optional` **consistencyMode**: `"balanced"` \| `"strict"` \| `"loose"`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:190](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L190)

Character consistency mode controlling identity preservation strength.

- `'strict'` — Maximum preservation. Uses Pulid/InstantID. Face guaranteed
  consistent but output creativity is constrained.
- `'balanced'` — Moderate preservation. IP-Adapter strength ~0.6. Good for
  expression variants where some variation is acceptable.
- `'loose'` — Light guidance. Reference influences mood/style but face may
  drift. Good for "inspired by" generations.

#### Default

```ts
'balanced'
```

***

### faceEmbedding?

> `optional` **faceEmbedding**: `number`[]

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:176](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L176)

Pre-computed 512-dim face embedding vector for drift detection.

When provided alongside `referenceImageUrl`, the AvatarPipeline
verifies generated face identity via cosine similarity against
this anchor vector.

***

### modalities?

> `optional` **modalities**: [`ImageModality`](../type-aliases/ImageModality.md)[]

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:143](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L143)

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:141](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L141)

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:144](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L144)

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:154](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L154)

***

### outputCompression?

> `optional` **outputCompression**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:150](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L150)

***

### outputFormat?

> `optional` **outputFormat**: [`ImageOutputFormat`](../type-aliases/ImageOutputFormat.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:149](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L149)

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:142](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L142)

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\> \| [`ImageProviderOptionBag`](ImageProviderOptionBag.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:155](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L155)

***

### quality?

> `optional` **quality**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:147](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L147)

***

### referenceImageUrl?

> `optional` **referenceImageUrl**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:167](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L167)

Reference image URL or data URI for character/face consistency.

Providers that support identity preservation map this to model-specific inputs:
- Replicate (Pulid): `main_face_image`
- Replicate (Flux Redux): `image`
- Fal (IP-Adapter): `ip_adapter_image`
- SD-Local: ControlNet with IP-Adapter preprocessor
- OpenAI/Stability/OpenRouter/BFL: ignored (debug warning logged)

***

### responseFormat?

> `optional` **responseFormat**: [`ImageResponseFormat`](../type-aliases/ImageResponseFormat.md)

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:151](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L151)

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:153](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L153)

***

### size?

> `optional` **size**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:145](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L145)

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/media/images/IImageProvider.ts:152](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/IImageProvider.ts#L152)
