# Interface: FactSupersessionResult

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts:54](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts#L54)

Per-call output from [FactSupersession.resolve](../classes/FactSupersession.md#resolve).

## Properties

### diagnostics

> **diagnostics**: `object`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts:59](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts#L59)

#### llmLatencyMs

> **llmLatencyMs**: `number`

#### notes?

> `optional` **notes**: `string`[]

#### parseOk

> **parseOk**: `boolean`

***

### droppedIds

> **droppedIds**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts:58](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts#L58)

IDs dropped by the LLM (subset of input trace IDs).

***

### traces

> **traces**: [`ScoredMemoryTrace`](ScoredMemoryTrace.md)[]

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts:56](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-supersession/FactSupersession.ts#L56)

Traces surviving the filter, in original order.
