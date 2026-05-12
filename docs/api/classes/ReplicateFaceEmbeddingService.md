# Class: ReplicateFaceEmbeddingService

Defined in: [packages/agentos/src/media/images/face/ReplicateFaceEmbeddingService.ts:61](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/media/images/face/ReplicateFaceEmbeddingService.ts#L61)

Extracts face embeddings via the Replicate API using InsightFace.

Sends a prediction request with the provided image URL, polls until the
prediction completes, then parses the embedding vector from the response.

## Implements

- [`IFaceEmbeddingService`](../interfaces/IFaceEmbeddingService.md)

## Constructors

### Constructor

> **new ReplicateFaceEmbeddingService**(`config`): `ReplicateFaceEmbeddingService`

Defined in: [packages/agentos/src/media/images/face/ReplicateFaceEmbeddingService.ts:66](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/media/images/face/ReplicateFaceEmbeddingService.ts#L66)

#### Parameters

##### config

[`ReplicateFaceEmbeddingConfig`](../interfaces/ReplicateFaceEmbeddingConfig.md)

#### Returns

`ReplicateFaceEmbeddingService`

## Methods

### compareFaces()

> **compareFaces**(`a`, `b`, `threshold?`): `FaceComparisonResult`

Defined in: [packages/agentos/src/media/images/face/ReplicateFaceEmbeddingService.ts:168](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/media/images/face/ReplicateFaceEmbeddingService.ts#L168)

Compare two face embedding vectors using cosine similarity.

#### Parameters

##### a

`number`[]

First embedding vector.

##### b

`number`[]

Second embedding vector.

##### threshold?

`number` = `0.6`

Minimum similarity to consider a match (default 0.6).

#### Returns

`FaceComparisonResult`

Comparison result with similarity score and match flag.

#### Implementation of

[`IFaceEmbeddingService`](../interfaces/IFaceEmbeddingService.md).[`compareFaces`](../interfaces/IFaceEmbeddingService.md#comparefaces)

***

### extractEmbedding()

> **extractEmbedding**(`imageUrl`): `Promise`\<[`FaceEmbedding`](../interfaces/FaceEmbedding.md)\>

Defined in: [packages/agentos/src/media/images/face/ReplicateFaceEmbeddingService.ts:81](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/media/images/face/ReplicateFaceEmbeddingService.ts#L81)

Extract a face embedding from an image.

#### Parameters

##### imageUrl

`string`

Public URL or base64 data URI of the image.

#### Returns

`Promise`\<[`FaceEmbedding`](../interfaces/FaceEmbedding.md)\>

Face embedding with 512-dim vector and optional bounding box.

#### Implementation of

[`IFaceEmbeddingService`](../interfaces/IFaceEmbeddingService.md).[`extractEmbedding`](../interfaces/IFaceEmbeddingService.md#extractembedding)
