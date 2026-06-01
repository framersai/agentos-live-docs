# Class: VoiceNodeBuilder

Defined in: [packages/agentos/src/orchestration/builders/VoiceNodeBuilder.ts:99](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/VoiceNodeBuilder.ts#L99)

Fluent DSL builder for voice graph nodes.

Collects exit-reason -> target-node mappings via [on](#on) and produces a
fully-specified `GraphNode` via [build](#build).

The builder is designed to be chained. Each `on()` call returns `this`,
enabling a declarative voice node definition:

```typescript
voiceNode('listen', { mode: 'conversation', maxTurns: 5 })
  .on('completed', 'summarize')
  .on('interrupted', 'listen')
  .on('hangup', 'end')
```

## See

[voiceNode](../functions/voiceNode.md) -- the factory function that creates builder instances.
See `VoiceNodeExecutor` for the runtime that resolves exit reasons and edge routing.

## Constructors

### Constructor

> **new VoiceNodeBuilder**(`id`, `config`): `VoiceNodeBuilder`

Defined in: [packages/agentos/src/orchestration/builders/VoiceNodeBuilder.ts:119](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/VoiceNodeBuilder.ts#L119)

Creates a new VoiceNodeBuilder.

#### Parameters

##### id

`string`

Node identifier; exposed as a readonly property for
                introspection by callers that need to reference this
                node before building (e.g. for cross-node edge wiring).

##### config

[`VoiceNodeConfig`](../interfaces/VoiceNodeConfig.md)

`VoiceNodeConfig` forwarded to the node's `executorConfig`
                at build time. Immutable after construction.

#### Returns

`VoiceNodeBuilder`

## Properties

### id

> `readonly` **id**: `string`

Defined in: [packages/agentos/src/orchestration/builders/VoiceNodeBuilder.ts:121](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/VoiceNodeBuilder.ts#L121)

The node id assigned at construction time.

## Methods

### build()

> **build**(): [`GraphNode`](../interfaces/GraphNode.md)

Defined in: [packages/agentos/src/orchestration/builders/VoiceNodeBuilder.ts:195](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/VoiceNodeBuilder.ts#L195)

Produce a `GraphNode` IR object from the accumulated builder state.

The returned node has:
- `type: 'voice'` in sync with `executorConfig.type`.
- `executionMode: 'react_bounded'` -- voice nodes run a multi-turn loop.
- `effectClass: 'external'` -- voice I/O touches the real world.
- `checkpoint: 'before'` -- snapshot taken before the session starts so the
  run can be resumed from the start of the voice turn if the process crashes.
- `edges` -- plain object mapping exit-reason strings to target node ids,
  populated from all `on()` calls. The compiler is responsible for
  expanding these into `GraphEdge` instances.

#### Returns

[`GraphNode`](../interfaces/GraphNode.md)

A `GraphNode` with the `edges` extension field. Cast to `any`
         to accommodate the `edges` field not present on the base interface.

#### Example

```typescript
const node = voiceNode('greet', { mode: 'conversation' })
  .on('completed', 'process')
  .build();

console.log(node.type);             // 'voice'
console.log(node.edges.completed);  // 'process'
```

***

### on()

> **on**(`exitReason`, `target`): `this`

Defined in: [packages/agentos/src/orchestration/builders/VoiceNodeBuilder.ts:160](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/VoiceNodeBuilder.ts#L160)

Register an exit-reason -> target-node route.

When the voice node's session ends with `exitReason`, the graph transitions
to `target`. Multiple calls to `on()` accumulate routes; calling `on()` with
a reason that was already registered overwrites the previous target.

## Common exit reasons

| Reason              | When it fires                                    |
|---------------------|--------------------------------------------------|
| `'completed'`       | Session ended normally (catch-all).              |
| `'turns-exhausted'` | `maxTurns` reached.                              |
| `'hangup'`          | Transport disconnected.                          |
| `'interrupted'`     | User barged in (VoiceInterruptError).            |
| `'silence-timeout'` | No speech activity for 30 seconds.               |
| `'keyword:<word>'`  | A `final_transcript` contained an exit keyword.  |

#### Parameters

##### exitReason

`string`

The reason string returned by the voice executor.

##### target

Either the string id of the target node, or an object
                    with an `id` property (compatible with other builder
                    instances, e.g. `voiceNode('other', ...)`).

`string` | \{ `id`: `string`; \}

#### Returns

`this`

`this` for fluent chaining.

#### Example

```typescript
builder
  .on('completed', 'next-node')
  .on('hangup', { id: 'cleanup-node' });
```
