# Interface: FlushReflectionResult

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:88](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L88)

Result from a forced reflection via [CognitiveMemoryManager.flushReflection](../classes/CognitiveMemoryManager.md#flushreflection).
Step-8: used to surface reflection-derived trace IDs so downstream
consumers (e.g. a hybrid BM25 index) can apply side effects.

## Properties

### compressionRatio

> **compressionRatio**: `number`

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:94](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L94)

Compression ratio achieved by the reflection.

***

### encodedTraceIds

> **encodedTraceIds**: `string`[]

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:90](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L90)

IDs of traces newly encoded from the reflection result.

***

### supersededTraceIds

> **supersededTraceIds**: `string`[]

Defined in: [packages/agentos/src/memory/CognitiveMemoryManager.ts:92](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/CognitiveMemoryManager.ts#L92)

IDs of existing traces soft-deleted because they were superseded.
