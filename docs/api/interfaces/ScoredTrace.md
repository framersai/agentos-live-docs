# Interface: ScoredTrace

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:102](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/Memory.ts#L102)

A memory trace paired with its retrieval relevance score.

Returned by [Memory.recall](../classes/Memory.md#recall) as a ranked list of matches.

## Properties

### score

> **score**: `number`

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:106](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/Memory.ts#L106)

Composite relevance score; higher is better.

***

### trace

> **trace**: [`MemoryTrace`](MemoryTrace.md)

Defined in: [packages/agentos/src/memory/io/facade/Memory.ts:104](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/Memory.ts#L104)

The full memory trace envelope.
