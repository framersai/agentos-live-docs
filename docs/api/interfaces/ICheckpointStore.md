# Interface: ICheckpointStore

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:118](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/checkpoint/ICheckpointStore.ts#L118)

Persistence contract for checkpoint snapshots.

Implementations may back this with in-memory maps (for testing / ephemeral runs),
SQLite / Postgres rows, object storage blobs, or any other durable medium.

All methods are async to accommodate I/O-bound backends without interface changes.

## Methods

### delete()

> **delete**(`checkpointId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:177](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/checkpoint/ICheckpointStore.ts#L177)

Permanently remove a checkpoint from the store.

Silently succeeds when `checkpointId` does not exist.

#### Parameters

##### checkpointId

`string`

The checkpoint to remove.

#### Returns

`Promise`\<`void`\>

***

### fork()

> **fork**(`checkpointId`, `patchState?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:191](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/checkpoint/ICheckpointStore.ts#L191)

Create a new run branching from an existing checkpoint.

The operation deep-clones the source checkpoint, assigns a fresh `runId` and
checkpoint `id`, applies any `patchState` overrides, persists the new checkpoint,
and returns the new `runId`.

#### Parameters

##### checkpointId

`string`

The checkpoint to fork from.

##### patchState?

`Partial`\<[`GraphState`](GraphState.md)\<`unknown`, `unknown`, `unknown`\>\>

Optional partial `GraphState` overrides applied after cloning.

#### Returns

`Promise`\<`string`\>

The new `runId` for the forked run.

#### Throws

When `checkpointId` does not exist.

***

### get()

> **get**(`checkpointId`): `Promise`\<[`Checkpoint`](Checkpoint.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:134](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/checkpoint/ICheckpointStore.ts#L134)

Load a checkpoint by its unique checkpoint identifier.

#### Parameters

##### checkpointId

`string`

The exact checkpoint id assigned at save-time.

#### Returns

`Promise`\<[`Checkpoint`](Checkpoint.md) \| `null`\>

The matching checkpoint, or `null` when none exists.

***

### latest()

> **latest**(`runId`): `Promise`\<[`Checkpoint`](Checkpoint.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:155](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/checkpoint/ICheckpointStore.ts#L155)

Return the most recently persisted checkpoint for a run, or `null` when the run
has no checkpoints.

#### Parameters

##### runId

`string`

The graph run identifier.

#### Returns

`Promise`\<[`Checkpoint`](Checkpoint.md) \| `null`\>

***

### list()

> **list**(`graphId`, `options?`): `Promise`\<[`CheckpointMetadata`](CheckpointMetadata.md)[]\>

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:165](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/checkpoint/ICheckpointStore.ts#L165)

List lightweight metadata descriptors for all checkpoints belonging to a graph.

#### Parameters

##### graphId

`string`

The compiled graph identifier.

##### options?

###### limit?

`number`

Maximum number of entries to return (most-recent-first).

###### runId?

`string`

Optional filter to a single run within the graph.

#### Returns

`Promise`\<[`CheckpointMetadata`](CheckpointMetadata.md)[]\>

Array of `CheckpointMetadata`, sorted by `timestamp` descending.

***

### load()

> **load**(`runId`, `nodeId?`): `Promise`\<[`Checkpoint`](Checkpoint.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:147](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/checkpoint/ICheckpointStore.ts#L147)

Load a checkpoint for the given `runId`.

When `nodeId` is supplied, returns the most recent checkpoint for that specific
node within the run. When `nodeId` is omitted, returns the most recent checkpoint
for the run regardless of node (equivalent to `latest(runId)`).

#### Parameters

##### runId

`string`

The graph run identifier.

##### nodeId?

`string`

Optional node filter.

#### Returns

`Promise`\<[`Checkpoint`](Checkpoint.md) \| `null`\>

The matching checkpoint, or `null` when none exists.

***

### save()

> **save**(`checkpoint`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/ICheckpointStore.ts:126](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/checkpoint/ICheckpointStore.ts#L126)

Persist a checkpoint snapshot.

If a checkpoint with the same `id` already exists it is overwritten.

#### Parameters

##### checkpoint

[`Checkpoint`](Checkpoint.md)

The snapshot to persist.

#### Returns

`Promise`\<`void`\>
