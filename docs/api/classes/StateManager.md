# Class: StateManager

Defined in: [packages/agentos/src/orchestration/runtime/StateManager.ts:46](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/StateManager.ts#L46)

Manages the [GraphState](../interfaces/GraphState.md) partitions (`input`, `scratch`, `artifacts`,
`memory`, `diagnostics`) for a single graph run.

All methods return a *new* `GraphState` object; the original is never mutated.

## Example

```ts
const manager = new StateManager({ 'scratch.messages': 'concat' });
let state = manager.initialize({ prompt: 'Hello' });
state = manager.updateScratch(state, { messages: ['first'] });
state = manager.updateScratch(state, { messages: ['second'] });
// state.scratch.messages === ['first', 'second']
```

## Constructors

### Constructor

> **new StateManager**(`reducers`): `StateManager`

Defined in: [packages/agentos/src/orchestration/runtime/StateManager.ts:52](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/StateManager.ts#L52)

#### Parameters

##### reducers

[`StateReducers`](../interfaces/StateReducers.md)

Field-level reducer configuration keyed by dot-notation paths
                  (e.g. `'scratch.messages'`).  Determines how conflicting values
                  are merged during `updateScratch()` and `mergeParallelBranches()`.

#### Returns

`StateManager`

## Methods

### initialize()

> **initialize**(`input`): [`GraphState`](../interfaces/GraphState.md)

Defined in: [packages/agentos/src/orchestration/runtime/StateManager.ts:67](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/StateManager.ts#L67)

Create a clean initial [GraphState](../interfaces/GraphState.md) from the caller-supplied `input` value.

The `input` partition is frozen with `Object.freeze()` so that no node can
accidentally mutate it.  All other partitions start empty.

#### Parameters

##### input

`unknown`

Arbitrary value provided by the graph caller; becomes `state.input`.

#### Returns

[`GraphState`](../interfaces/GraphState.md)

A fully initialised `GraphState` ready for the first node execution.

***

### mergeParallelBranches()

> **mergeParallelBranches**(`baseState`, `branchStates`): [`GraphState`](../interfaces/GraphState.md)

Defined in: [packages/agentos/src/orchestration/runtime/StateManager.ts:164](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/StateManager.ts#L164)

Merge the `scratch` partitions of one or more parallel branch states back into
a single `GraphState`.

The algorithm walks every key present in any branch's scratch object and applies
the registered reducer for that key (if any) against the accumulator.  When no
reducer is registered, the last branch's value wins.

The `artifacts`, `memory`, `diagnostics`, `visitedNodes`, and `iteration` fields
of `baseState` are preserved unchanged — the caller is responsible for merging
those separately if needed.

#### Parameters

##### baseState

[`GraphState`](../interfaces/GraphState.md)

State prior to the parallel fan-out (provides the baseline scratch).

##### branchStates

[`GraphState`](../interfaces/GraphState.md)\<`unknown`, `unknown`, `unknown`\>[]

States produced by each parallel branch.

#### Returns

[`GraphState`](../interfaces/GraphState.md)

New `GraphState` with the merged scratch partition.

***

### recordNodeVisit()

> **recordNodeVisit**(`state`, `nodeId`): [`GraphState`](../interfaces/GraphState.md)

Defined in: [packages/agentos/src/orchestration/runtime/StateManager.ts:139](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/StateManager.ts#L139)

Record that execution has entered `nodeId`.

Updates `currentNodeId`, appends to `visitedNodes`, and increments `iteration`.

#### Parameters

##### state

[`GraphState`](../interfaces/GraphState.md)

Current graph state (not mutated).

##### nodeId

`string`

Id of the node that is about to execute.

#### Returns

[`GraphState`](../interfaces/GraphState.md)

New `GraphState` reflecting the visit.

***

### updateArtifacts()

> **updateArtifacts**(`state`, `patch`): [`GraphState`](../interfaces/GraphState.md)

Defined in: [packages/agentos/src/orchestration/runtime/StateManager.ts:123](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/StateManager.ts#L123)

Apply a `patch` to the `artifacts` partition using last-write-wins semantics.

Artifact fields are intended for caller-facing outputs and are not subject to
reducer logic in this method.  If you need reducer-aware artifact merging, use
`mergeParallelBranches()` instead.

#### Parameters

##### state

[`GraphState`](../interfaces/GraphState.md)

Current graph state (not mutated).

##### patch

`Record`\<`string`, `unknown`\>

Partial artifacts update emitted by a completed node.

#### Returns

[`GraphState`](../interfaces/GraphState.md)

New `GraphState` with the updated artifacts partition.

***

### updateScratch()

> **updateScratch**(`state`, `patch`): [`GraphState`](../interfaces/GraphState.md)

Defined in: [packages/agentos/src/orchestration/runtime/StateManager.ts:93](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/StateManager.ts#L93)

Apply a `patch` to the `scratch` partition, honoring any registered reducers.

For each key in `patch`:
 - If a reducer is registered at `scratch.<key>` **and** the key already exists
   in the current scratch, the reducer is called to merge the existing and incoming
   values.
 - Otherwise the incoming value simply overwrites (last-write-wins semantics).

#### Parameters

##### state

[`GraphState`](../interfaces/GraphState.md)

Current graph state (not mutated).

##### patch

`Record`\<`string`, `unknown`\>

Partial scratch update emitted by a completed node.

#### Returns

[`GraphState`](../interfaces/GraphState.md)

New `GraphState` with the merged scratch partition.
