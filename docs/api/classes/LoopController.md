# Class: LoopController

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:202](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/LoopController.ts#L202)

Configurable ReAct loop controller.

Drives a generate → act → observe cycle, delegating LLM inference and
tool execution to the caller-provided [LoopContext](../interfaces/LoopContext.md). The loop
terminates when:

1. The LLM returns no tool calls (natural stop), or
2. `maxIterations` is exceeded, or
3. A tool fails and `failureMode` is `'fail_closed'`.

All intermediate events are yielded so callers can stream output to the
user or record an audit trace.

## Constructors

### Constructor

> **new LoopController**(): `LoopController`

#### Returns

`LoopController`

## Methods

### execute()

> **execute**(`config`, `context`): `AsyncGenerator`\<[`LoopEvent`](../type-aliases/LoopEvent.md)\>

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:211](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/LoopController.ts#L211)

Execute the ReAct loop and yield [LoopEvent](../type-aliases/LoopEvent.md)s.

#### Parameters

##### config

[`LoopConfig`](../interfaces/LoopConfig.md)

Loop behaviour configuration.

##### context

[`LoopContext`](../interfaces/LoopContext.md)

Callbacks to the underlying LLM/tool layer.

#### Returns

`AsyncGenerator`\<[`LoopEvent`](../type-aliases/LoopEvent.md)\>

#### Yields

Structured events for each phase of the loop.

#### Throws

Only when `failureMode === 'fail_closed'` and a tool fails.
