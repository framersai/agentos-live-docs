# Interface: CognitiveMechanismsConfig

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:121](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/mechanisms/types.ts#L121)

Per-mechanism toggle config for cognitive mechanisms.

When present (even as `{}`), all mechanisms default to enabled with
sensible constants. When `undefined` on `CognitiveMemoryConfig`,
the engine is never instantiated.

## Properties

### emotionRegulation?

> `optional` **emotionRegulation**: `Partial`\<`EmotionRegulationConfig`\>

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:129](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/mechanisms/types.ts#L129)

***

### involuntaryRecall?

> `optional` **involuntaryRecall**: `Partial`\<`InvoluntaryRecallConfig`\>

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:124](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/mechanisms/types.ts#L124)

***

### metacognitiveFOK?

> `optional` **metacognitiveFOK**: `Partial`\<`MetacognitiveFOKConfig`\>

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:125](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/mechanisms/types.ts#L125)

***

### reconsolidation?

> `optional` **reconsolidation**: `Partial`\<`ReconsolidationConfig`\>

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:122](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/mechanisms/types.ts#L122)

***

### retrievalInducedForgetting?

> `optional` **retrievalInducedForgetting**: `Partial`\<`RetrievalInducedForgettingConfig`\>

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:123](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/mechanisms/types.ts#L123)

***

### schemaEncoding?

> `optional` **schemaEncoding**: `Partial`\<`SchemaEncodingConfig`\>

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:127](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/mechanisms/types.ts#L127)

***

### sourceConfidenceDecay?

> `optional` **sourceConfidenceDecay**: `Partial`\<`SourceConfidenceDecayConfig`\>

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:128](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/mechanisms/types.ts#L128)

***

### temporalGist?

> `optional` **temporalGist**: `Partial`\<`TemporalGistConfig`\>

Defined in: [packages/agentos/src/memory/mechanisms/types.ts:126](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/mechanisms/types.ts#L126)
