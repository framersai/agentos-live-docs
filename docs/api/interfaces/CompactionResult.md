# Interface: CompactionResult

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:134](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L134)

## Properties

### entry

> **entry**: [`CompactionEntry`](CompactionEntry.md)

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:140](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L140)

Compaction log entry.

***

### messages

> **messages**: [`ContextMessage`](ContextMessage.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:136](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L136)

Messages after compaction (some replaced with summary blocks).

***

### newNodes

> **newNodes**: [`SummaryChainNode`](SummaryChainNode.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:138](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L138)

New summary chain nodes produced.

***

### tracesToEncode

> **tracesToEncode**: `Partial`\<[`MemoryTrace`](MemoryTrace.md)\>[]

Defined in: [packages/agentos/src/memory/pipeline/context/types.ts:142](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/pipeline/context/types.ts#L142)

Memory traces to encode from the compacted content.
