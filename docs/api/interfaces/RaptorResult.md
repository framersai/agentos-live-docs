# Interface: RaptorResult

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:105](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/raptor/RaptorTree.ts#L105)

A single RAPTOR search result with layer information.

## Interface

RaptorResult

## Properties

### id

> **id**: `string`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:107](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/raptor/RaptorTree.ts#L107)

Document/chunk identifier.

***

### isSummary

> **isSummary**: `boolean`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:115](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/raptor/RaptorTree.ts#L115)

Whether this is a summary node or an original leaf chunk.

***

### layer

> **layer**: `number`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:113](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/raptor/RaptorTree.ts#L113)

Layer in the RAPTOR tree (0 = leaf, higher = more abstract).

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:117](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/raptor/RaptorTree.ts#L117)

Optional metadata.

***

### score

> **score**: `number`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:111](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/raptor/RaptorTree.ts#L111)

Similarity score from vector search.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:109](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/raptor/RaptorTree.ts#L109)

Text content.
