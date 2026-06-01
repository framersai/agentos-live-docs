# Interface: ScoredTrace

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:102](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L102)

A memory trace paired with its retrieval relevance score.

Returned by [Memory.recall](../classes/Memory.md#recall) as a ranked list of matches.

## Properties

### score

> **score**: `number`

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:106](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L106)

Composite relevance score; higher is better.

***

### trace

> **trace**: [`MemoryTrace`](MemoryTrace.md)

Defined in: [packages/agentos/src/cognition/memory/io/facade/Memory.ts:104](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/io/facade/Memory.ts#L104)

The full memory trace envelope.
