# Interface: ScoredTrace

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:97](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/Memory.ts#L97)

A memory trace paired with its retrieval relevance score.

Returned by [Memory.recall](../classes/Memory.md#recall) as a ranked list of matches.

## Properties

### score

> **score**: `number`

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:101](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/Memory.ts#L101)

Composite relevance score; higher is better.

***

### trace

> **trace**: [`MemoryTrace`](MemoryTrace.md)

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:99](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/Memory.ts#L99)

The full memory trace envelope.
