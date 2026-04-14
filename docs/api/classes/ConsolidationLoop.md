# Class: ConsolidationLoop

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationLoop.ts:102](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/consolidation/ConsolidationLoop.ts#L102)

Self-improving background consolidation loop with 6 ordered steps:
prune, merge, strengthen, derive, compact, re-index.

All database operations use the async `StorageAdapter` API through
the shared [SqliteBrain](SqliteBrain.md) connection. The `run()` method is async
to accommodate both the database calls and the LLM-backed derive step.

## Constructors

### Constructor

> **new ConsolidationLoop**(`brain`, `memoryGraph`, `options?`): `ConsolidationLoop`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationLoop.ts:115](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/consolidation/ConsolidationLoop.ts#L115)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The agent's SQLite brain database connection.

##### memoryGraph

[`IMemoryGraph`](../interfaces/IMemoryGraph.md)

The memory association graph for co-activation and clustering.

##### options?

Optional LLM invoker, embedding function, and
  personality mutation store for derive, merge, and decay steps respectively.

###### embedFn?

(`texts`) => `Promise`\<`number`[][]\>

Embedding function for computing trace similarity.

###### llmInvoker?

(`prompt`) => `Promise`\<`string`\>

LLM function for deriving insights from memory clusters.

###### personalityDecayRate?

`number`

Decay rate subtracted from each personality mutation's strength per cycle.
Mutations at or below 0.1 after decay are pruned.

**Default**

```ts
0.05
```

###### personalityMutationStore?

[`PersonalityMutationStore`](PersonalityMutationStore.md)

Optional personality mutation store for Ebbinghaus-style decay.

When provided, each consolidation cycle decays all active personality
mutations and prunes those whose strength falls below the threshold.

#### Returns

`ConsolidationLoop`

## Accessors

### isRunning

#### Get Signature

> **get** **isRunning**(): `boolean`

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationLoop.ts:213](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/consolidation/ConsolidationLoop.ts#L213)

Whether consolidation is currently running.
Useful for callers to check before scheduling a new run.

##### Returns

`boolean`

## Methods

### run()

> **run**(`config?`): `Promise`\<[`MemoryConsolidationResult`](../interfaces/MemoryConsolidationResult.md)\>

Defined in: [packages/agentos/src/memory/pipeline/consolidation/ConsolidationLoop.ts:152](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/pipeline/consolidation/ConsolidationLoop.ts#L152)

Run one full consolidation cycle.

The mutex prevents concurrent runs — if `_running` is already true,
returns immediately with a zero-count result.

#### Parameters

##### config?

`Partial`\<[`ExtendedConsolidationConfig`](../interfaces/ExtendedConsolidationConfig.md)\>

Optional overrides for consolidation thresholds.

#### Returns

`Promise`\<[`MemoryConsolidationResult`](../interfaces/MemoryConsolidationResult.md)\>

Consolidation statistics (pruned, merged, derived, compacted, durationMs).
