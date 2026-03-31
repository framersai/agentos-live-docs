# Interface: ImageIndexOptions

Defined in: [packages/agentos/src/rag/multimodal/types.ts:58](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L58)

Options for indexing an image into the vector store.

The image is described by a vision-capable LLM, then the description
is embedded and stored alongside the original image reference.

## Example

```typescript
const result = await indexer.indexImage({
  image: fs.readFileSync('./photo.jpg'),
  metadata: { source: 'user-upload', fileName: 'photo.jpg' },
  collection: 'user-images',
});
```

## Properties

### collection?

> `optional` **collection**: `string`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:78](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L78)

Vector store collection to index into.

#### Default

```ts
'multimodal'
```

***

### image

> **image**: `string` \| `Buffer`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:64](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L64)

Image data as a URL string (file:// or https://) or a raw Buffer.
- URL: Passed directly to the vision LLM for description.
- Buffer: Converted to a base64 data URL before passing to the LLM.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/rag/multimodal/types.ts:72](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/multimodal/types.ts#L72)

Optional metadata to attach to the indexed document.
Stored alongside the embedding for filtering during search.

#### Example

```ts
{ source: 'upload', tags: ['landscape', 'nature'] }
```
