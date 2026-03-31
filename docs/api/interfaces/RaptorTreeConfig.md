# Interface: RaptorTreeConfig

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:39](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L39)

Configuration for the RAPTOR tree.

## Interface

RaptorTreeConfig

## Properties

### clusterSize?

> `optional` **clusterSize**: `number`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:59](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L59)

Number of chunks per cluster. Default: 8.

***

### collectionName?

> `optional` **collectionName**: `string`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:56](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L56)

Collection name in the vector store. Default: 'raptor-tree'.

***

### embeddingManager

> **embeddingManager**: [`IEmbeddingManager`](IEmbeddingManager.md)

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:50](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L50)

Embedding manager for generating embeddings for clustering and storage.

***

### llmCaller()

> **llmCaller**: (`prompt`) => `Promise`\<`string`\>

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:47](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L47)

LLM caller for generating summaries.
Takes a prompt string and returns the LLM completion.

#### Parameters

##### prompt

`string`

The full prompt including chain-of-thought instructions.

#### Returns

`Promise`\<`string`\>

The generated summary text.

***

### maxDepth?

> `optional` **maxDepth**: `number`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:62](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L62)

Maximum tree depth (layers above leaf). Default: 4.

***

### minChunksForLayer?

> `optional` **minChunksForLayer**: `number`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:65](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L65)

Minimum number of chunks required to form a new summary layer. Default: 3.

***

### vectorStore

> **vectorStore**: [`IVectorStore`](IVectorStore.md)

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:53](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/raptor/RaptorTree.ts#L53)

Vector store for persisting all layers of the tree.
