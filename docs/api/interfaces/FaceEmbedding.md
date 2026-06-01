# Interface: FaceEmbedding

Defined in: [packages/agentos/src/io/media/images/face/IFaceEmbeddingService.ts:26](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/media/images/face/IFaceEmbeddingService.ts#L26)

Face embedding vector with optional detection metadata.

## Properties

### boundingBox?

> `optional` **boundingBox**: `FaceBoundingBox`

Defined in: [packages/agentos/src/io/media/images/face/IFaceEmbeddingService.ts:30](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/media/images/face/IFaceEmbeddingService.ts#L30)

Bounding box of the detected face in the source image.

***

### confidence?

> `optional` **confidence**: `number`

Defined in: [packages/agentos/src/io/media/images/face/IFaceEmbeddingService.ts:32](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/media/images/face/IFaceEmbeddingService.ts#L32)

Detection confidence score in [0, 1].

***

### vector

> **vector**: `number`[]

Defined in: [packages/agentos/src/io/media/images/face/IFaceEmbeddingService.ts:28](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/media/images/face/IFaceEmbeddingService.ts#L28)

High-dimensional vector representing facial features.
