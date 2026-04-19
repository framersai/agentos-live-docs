# Class: GraphEventEmitter

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:320](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/events/GraphEvent.ts#L320)

Lightweight event emitter for `GraphEvent` values.

Supports both:
- **Push-based** consumption via `on()` / `off()` callbacks.
- **Pull-based** consumption via the `stream()` async generator.

The emitter is single-use: once `close()` is called it is permanently closed
and subsequent `emit()` calls are silently ignored.

## Example

```ts
const emitter = new GraphEventEmitter();

// Pull-based — collect events in order
async function consume() {
  for await (const event of emitter.stream()) {
    console.log(event.type);
  }
}

emitter.emit({ type: 'run_start', runId: 'r1', graphId: 'g1' });
emitter.close();
await consume(); // logs 'run_start'
```

## Constructors

### Constructor

> **new GraphEventEmitter**(): `GraphEventEmitter`

#### Returns

`GraphEventEmitter`

## Methods

### close()

> **close**(): `void`

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:382](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/events/GraphEvent.ts#L382)

Permanently closes the emitter.

- Future `emit()` calls are silently ignored.
- Active `stream()` generators are signalled to drain their queues and return.

#### Returns

`void`

***

### emit()

> **emit**(`event`): `void`

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:362](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/events/GraphEvent.ts#L362)

Dispatches `event` to all registered listeners and any active `stream()` generators.
If `close()` has already been called, this method is a no-op.

#### Parameters

##### event

[`GraphEvent`](../type-aliases/GraphEvent.md)

The `GraphEvent` to dispatch.

#### Returns

`void`

***

### off()

> **off**(`listener`): `void`

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:349](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/events/GraphEvent.ts#L349)

Removes a previously registered listener.
If the listener was not registered, this is a no-op.

#### Parameters

##### listener

(`event`) => `void`

The exact function reference passed to `on()`.

#### Returns

`void`

***

### on()

> **on**(`listener`): `void`

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:339](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/events/GraphEvent.ts#L339)

Registers a callback that is invoked synchronously for every subsequent `emit()` call.

#### Parameters

##### listener

(`event`) => `void`

Function to call with each emitted `GraphEvent`.

#### Returns

`void`

***

### stream()

> **stream**(): `AsyncGenerator`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:425](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/events/GraphEvent.ts#L425)

Returns an `AsyncGenerator` that yields every `GraphEvent` emitted after the
call to `stream()`, in the exact order they were emitted.

The generator completes (returns) when `close()` is called on the emitter
and any queued events have been yielded.

Multiple concurrent `stream()` calls are supported; each gets an independent
copy of the event stream.

#### Returns

`AsyncGenerator`\<[`GraphEvent`](../type-aliases/GraphEvent.md)\>

#### Example

```ts
for await (const event of emitter.stream()) {
  if (event.type === 'run_end') break;
}
```
