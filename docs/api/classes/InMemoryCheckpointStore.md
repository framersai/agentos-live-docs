# Class: InMemoryCheckpointStore

Defined in: [packages/agentos/src/orchestration/checkpoint/InMemoryCheckpointStore.ts:50](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/checkpoint/InMemoryCheckpointStore.ts#L50)

In-memory `ICheckpointStore` implementation.

All checkpoints are stored in a `Map` keyed by checkpoint `id`. Scans are O(n) over
the number of stored checkpoints — acceptable for test workloads; a production store
should use indexed secondary keys (runId, graphId).

## Example

```ts
const store = new InMemoryCheckpointStore();
await store.save(checkpoint);
const restored = await store.latest(runId);
```

## Implements

- [`ICheckpointStore`](../interfaces/ICheckpointStore.md)

## Constructors

### Constructor

> **new InMemoryCheckpointStore**(): `InMemoryCheckpointStore`

#### Returns

`InMemoryCheckpointStore`

## Methods

### delete()

> **delete**(`checkpointId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/InMemoryCheckpointStore.ts:102](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/checkpoint/InMemoryCheckpointStore.ts#L102)

Permanently remove a checkpoint from the store.

Silently succeeds when `checkpointId` does not exist.

#### Parameters

##### checkpointId

`string`

The checkpoint to remove.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICheckpointStore`](../interfaces/ICheckpointStore.md).[`delete`](../interfaces/ICheckpointStore.md#delete)

***

### fork()

> **fork**(`checkpointId`, `patchState?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/InMemoryCheckpointStore.ts:107](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/checkpoint/InMemoryCheckpointStore.ts#L107)

Create a new run branching from an existing checkpoint.

The operation deep-clones the source checkpoint, assigns a fresh `runId` and
checkpoint `id`, applies any `patchState` overrides, persists the new checkpoint,
and returns the new `runId`.

#### Parameters

##### checkpointId

`string`

The checkpoint to fork from.

##### patchState?

`Partial`\<[`GraphState`](../interfaces/GraphState.md)\<`unknown`, `unknown`, `unknown`\>\>

Optional partial `GraphState` overrides applied after cloning.

#### Returns

`Promise`\<`string`\>

The new `runId` for the forked run.

#### Implementation of

[`ICheckpointStore`](../interfaces/ICheckpointStore.md).[`fork`](../interfaces/ICheckpointStore.md#fork)

***

### get()

> **get**(`checkpointId`): `Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/InMemoryCheckpointStore.ts:60](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/checkpoint/InMemoryCheckpointStore.ts#L60)

Load a checkpoint by its unique checkpoint identifier.

#### Parameters

##### checkpointId

`string`

The exact checkpoint id assigned at save-time.

#### Returns

`Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md) \| `null`\>

The matching checkpoint, or `null` when none exists.

#### Implementation of

[`ICheckpointStore`](../interfaces/ICheckpointStore.md).[`get`](../interfaces/ICheckpointStore.md#get)

***

### latest()

> **latest**(`runId`): `Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/InMemoryCheckpointStore.ts:78](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/checkpoint/InMemoryCheckpointStore.ts#L78)

Return the most recently persisted checkpoint for a run, or `null` when the run
has no checkpoints.

#### Parameters

##### runId

`string`

The graph run identifier.

#### Returns

`Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md) \| `null`\>

#### Implementation of

[`ICheckpointStore`](../interfaces/ICheckpointStore.md).[`latest`](../interfaces/ICheckpointStore.md#latest)

***

### list()

> **list**(`graphId`, `options?`): `Promise`\<[`CheckpointMetadata`](../interfaces/CheckpointMetadata.md)[]\>

Defined in: [packages/agentos/src/orchestration/checkpoint/InMemoryCheckpointStore.ts:83](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/checkpoint/InMemoryCheckpointStore.ts#L83)

List lightweight metadata descriptors for all checkpoints belonging to a graph.

#### Parameters

##### graphId

`string`

The compiled graph identifier.

##### options?

###### limit?

`number`

###### runId?

`string`

#### Returns

`Promise`\<[`CheckpointMetadata`](../interfaces/CheckpointMetadata.md)[]\>

Array of `CheckpointMetadata`, sorted by `timestamp` descending.

#### Implementation of

[`ICheckpointStore`](../interfaces/ICheckpointStore.md).[`list`](../interfaces/ICheckpointStore.md#list)

***

### load()

> **load**(`runId`, `nodeId?`): `Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md) \| `null`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/InMemoryCheckpointStore.ts:65](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/checkpoint/InMemoryCheckpointStore.ts#L65)

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

`Promise`\<[`Checkpoint`](../interfaces/Checkpoint.md) \| `null`\>

The matching checkpoint, or `null` when none exists.

#### Implementation of

[`ICheckpointStore`](../interfaces/ICheckpointStore.md).[`load`](../interfaces/ICheckpointStore.md#load)

***

### save()

> **save**(`checkpoint`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/checkpoint/InMemoryCheckpointStore.ts:55](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/checkpoint/InMemoryCheckpointStore.ts#L55)

Persist a checkpoint snapshot.

If a checkpoint with the same `id` already exists it is overwritten.

#### Parameters

##### checkpoint

[`Checkpoint`](../interfaces/Checkpoint.md)

The snapshot to persist.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ICheckpointStore`](../interfaces/ICheckpointStore.md).[`save`](../interfaces/ICheckpointStore.md#save)
