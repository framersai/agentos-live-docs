# Class: CognitiveMechanismsEngine

Defined in: [packages/agentos/src/memory/mechanisms/CognitiveMechanismsEngine.ts:141](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/CognitiveMechanismsEngine.ts#L141)

Orchestrates 8 cognitive mechanisms across the memory pipeline lifecycle.

When `cognitiveMechanisms` config is present on `CognitiveMemoryConfig`,
an instance is created during initialization. Existing pipeline files
call the lifecycle hooks at the appropriate points.

If HEXACO traits are provided, mechanism parameters are personality-modulated:
emotionality → reconsolidation drift, conscientiousness → RIF strength,
openness → involuntary recall probability + novelty boost, honesty → source
skepticism, agreeableness → emotion regulation, extraversion → FOK surfacing.

## Constructors

### Constructor

> **new CognitiveMechanismsEngine**(`config`, `traits?`): `CognitiveMechanismsEngine`

Defined in: [packages/agentos/src/memory/mechanisms/CognitiveMechanismsEngine.ts:147](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/CognitiveMechanismsEngine.ts#L147)

#### Parameters

##### config

[`CognitiveMechanismsConfig`](../interfaces/CognitiveMechanismsConfig.md)

##### traits?

[`HexacoTraits`](../interfaces/HexacoTraits.md)

#### Returns

`CognitiveMechanismsEngine`

## Methods

### getConfig()

> **getConfig**(): [`ResolvedMechanismsConfig`](../interfaces/ResolvedMechanismsConfig.md)

Defined in: [packages/agentos/src/memory/mechanisms/CognitiveMechanismsEngine.ts:270](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/CognitiveMechanismsEngine.ts#L270)

Get resolved config for diagnostics.

#### Returns

[`ResolvedMechanismsConfig`](../interfaces/ResolvedMechanismsConfig.md)

***

### onAccess()

> **onAccess**(`trace`, `currentMood`): `void`

Defined in: [packages/agentos/src/memory/mechanisms/CognitiveMechanismsEngine.ts:159](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/CognitiveMechanismsEngine.ts#L159)

Called by MemoryStore.recordAccess().
Applies reconsolidation drift to the trace's emotional context.

#### Parameters

##### trace

[`MemoryTrace`](../interfaces/MemoryTrace.md)

##### currentMood

[`PADState`](../interfaces/PADState.md)

#### Returns

`void`

***

### onConsolidation()

> **onConsolidation**(`traces`, `llmFn?`): `Promise`\<\{ `gistedCount`: `number`; `regulatedCount`: `number`; `sourceDecayedCount`: `number`; \}\>

Defined in: [packages/agentos/src/memory/mechanisms/CognitiveMechanismsEngine.ts:234](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/CognitiveMechanismsEngine.ts#L234)

Called by ConsolidationLoop.run() after step 5 (compact).
Runs temporal gist, source confidence decay, and emotion regulation.

#### Parameters

##### traces

[`MemoryTrace`](../interfaces/MemoryTrace.md)[]

##### llmFn?

(`prompt`) => `Promise`\<`string`\>

#### Returns

`Promise`\<\{ `gistedCount`: `number`; `regulatedCount`: `number`; `sourceDecayedCount`: `number`; \}\>

***

### onEncoding()

> **onEncoding**(`trace`, `traceEmbedding`): `void`

Defined in: [packages/agentos/src/memory/mechanisms/CognitiveMechanismsEngine.ts:221](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/CognitiveMechanismsEngine.ts#L221)

Called by EncodingModel.encode().
Classifies the trace as schema-congruent or schema-violating and adjusts
encoding strength accordingly.

#### Parameters

##### trace

[`MemoryTrace`](../interfaces/MemoryTrace.md)

##### traceEmbedding

`number`[]

#### Returns

`void`

***

### onPromptAssembly()

> **onPromptAssembly**(`allTraces`, `retrievedIds`): `object`

Defined in: [packages/agentos/src/memory/mechanisms/CognitiveMechanismsEngine.ts:248](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/CognitiveMechanismsEngine.ts#L248)

Called by MemoryPromptAssembler.
May inject an involuntary recall memory into the assembled context.

#### Parameters

##### allTraces

[`MemoryTrace`](../interfaces/MemoryTrace.md)[]

##### retrievedIds

`Set`\<`string`\>

#### Returns

`object`

##### involuntaryMemory

> **involuntaryMemory**: [`MemoryTrace`](../interfaces/MemoryTrace.md) \| `null`

***

### onRetrieval()

> **onRetrieval**(`results`, `allCandidates`, `retrievalCutoff`, `queryEntities`): `object`

Defined in: [packages/agentos/src/memory/mechanisms/CognitiveMechanismsEngine.ts:169](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/CognitiveMechanismsEngine.ts#L169)

Called by MemoryStore.query() after scoring.
Applies retrieval-induced forgetting to competitors and detects FOK signals.

#### Parameters

##### results

[`ScoredMemoryTrace`](../interfaces/ScoredMemoryTrace.md)[]

##### allCandidates

[`CandidateTrace`](../interfaces/CandidateTrace.md)[]

##### retrievalCutoff

`number`

##### queryEntities

`string`[]

#### Returns

`object`

Suppressed trace IDs and metacognitive signals.

##### metacognitiveSignals

> **metacognitiveSignals**: [`MetacognitiveSignal`](../interfaces/MetacognitiveSignal.md)[]

##### suppressedIds

> **suppressedIds**: `string`[]

***

### setClusterCentroids()

> **setClusterCentroids**(`centroids`): `void`

Defined in: [packages/agentos/src/memory/mechanisms/CognitiveMechanismsEngine.ts:265](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/mechanisms/CognitiveMechanismsEngine.ts#L265)

Update cluster centroids (called after consolidation derive step).

#### Parameters

##### centroids

`Map`\<`string`, `number`[]\>

#### Returns

`void`
