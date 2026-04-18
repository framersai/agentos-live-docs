# Interface: RaptorInputChunk

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:73](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/raptor/RaptorTree.ts#L73)

Input chunk for building the RAPTOR tree.

## Interface

RaptorInputChunk

## Properties

### id

> **id**: `string`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:75](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/raptor/RaptorTree.ts#L75)

Unique chunk identifier.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:79](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/raptor/RaptorTree.ts#L79)

Optional metadata to preserve in the tree.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:77](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/raptor/RaptorTree.ts#L77)

Chunk text content.
