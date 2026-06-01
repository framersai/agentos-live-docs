# Interface: IFaceEmbeddingService

Defined in: [packages/agentos/src/io/media/images/face/IFaceEmbeddingService.ts:51](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/media/images/face/IFaceEmbeddingService.ts#L51)

Provider-agnostic service for extracting face embeddings from images
and comparing them for identity consistency.

## Methods

### compareFaces()

> **compareFaces**(`a`, `b`, `threshold?`): `FaceComparisonResult`

Defined in: [packages/agentos/src/io/media/images/face/IFaceEmbeddingService.ts:68](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/media/images/face/IFaceEmbeddingService.ts#L68)

Compare two face embeddings and return a similarity score.

#### Parameters

##### a

`number`[]

First face embedding vector.

##### b

`number`[]

Second face embedding vector.

##### threshold?

`number`

Minimum similarity to consider a match (default 0.6).

#### Returns

`FaceComparisonResult`

Comparison result with similarity and match flag.

***

### extractEmbedding()

> **extractEmbedding**(`imageUrl`): `Promise`\<[`FaceEmbedding`](FaceEmbedding.md)\>

Defined in: [packages/agentos/src/io/media/images/face/IFaceEmbeddingService.ts:58](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/media/images/face/IFaceEmbeddingService.ts#L58)

Extract a face embedding vector from an image URL or data URI.

#### Parameters

##### imageUrl

`string`

Public URL or base64 data URI of the image.

#### Returns

`Promise`\<[`FaceEmbedding`](FaceEmbedding.md)\>

The extracted face embedding.
