# Interface: FlushReflectionResult

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:89](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L89)

Result from a forced reflection via [CognitiveMemoryManager.flushReflection](../classes/CognitiveMemoryManager.md#flushreflection).
Step-8: used to surface reflection-derived trace IDs so downstream
consumers (e.g. a hybrid BM25 index) can apply side effects.

## Properties

### compressionRatio

> **compressionRatio**: `number`

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:95](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L95)

Compression ratio achieved by the reflection.

***

### encodedTraceIds

> **encodedTraceIds**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:91](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L91)

IDs of traces newly encoded from the reflection result.

***

### supersededTraceIds

> **supersededTraceIds**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/CognitiveMemoryManager.ts:93](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/CognitiveMemoryManager.ts#L93)

IDs of existing traces soft-deleted because they were superseded.
