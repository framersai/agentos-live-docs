# Function: typedFactToScoredTrace()

> **typedFactToScoredTrace**(`fact`, `activation`, `scope`): [`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedNetworkRetriever.ts:160](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L160)

Convert a [TypedFact](../interfaces/TypedFact.md) into a [ScoredMemoryTrace](../interfaces/ScoredMemoryTrace.md) for
the bench's downstream reader pipeline. Renders the bank label
inline in the content so the reader can distinguish typed facts
from raw chunks at prompt time.

Defaults follow the HybridRetriever.factToScoredTrace
pattern: encoding strength 1, retrieval score = activation level,
neutral emotional context, lifecycle timestamps drawn from the
fact's mention timestamp.

## Parameters

### fact

[`TypedFact`](../interfaces/TypedFact.md)

### activation

`number`

### scope

#### scope

[`MemoryScope`](../type-aliases/MemoryScope.md)

#### scopeId

`string`

## Returns

[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)
