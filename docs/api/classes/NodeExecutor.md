# Class: NodeExecutor

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:188](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/NodeExecutor.ts#L188)

Stateless executor that dispatches a `GraphNode` to the appropriate handler.

One `NodeExecutor` instance is typically shared across the lifetime of a `GraphRuntime`
and reused for every node invocation within every run. All state is passed through
`GraphState` and returned via `NodeExecutionResult`.

## Example

```ts
const executor = new NodeExecutor({ toolOrchestrator, guardrailEngine });
const result = await executor.execute(node, graphState);
if (!result.success) console.error(result.error);
```

## Constructors

### Constructor

> **new NodeExecutor**(`deps`): `NodeExecutor`

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:193](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/NodeExecutor.ts#L193)

#### Parameters

##### deps

`NodeExecutorDeps`

External service adapters. All fields are optional; missing services
              cause graceful degradation rather than hard failures.

#### Returns

`NodeExecutor`

## Methods

### execute()

> **execute**(`node`, `state`): `Promise`\<[`NodeExecutionResult`](../interfaces/NodeExecutionResult.md)\>

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:214](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/NodeExecutor.ts#L214)

Execute `node` against the provided `state`, optionally racing against a timeout.

If `node.timeout` is set, execution races against a timer that resolves with a
`success: false` result after the specified number of milliseconds.

For `human` nodes with an `onTimeout` directive, the timeout result is modified:
- `'accept'` — auto-accept on timeout.
- `'reject'` — auto-reject on timeout.
- `'error'`  — standard timeout error (default behaviour for all node types).

#### Parameters

##### node

[`GraphNode`](../interfaces/GraphNode.md)

Immutable node descriptor from the compiled graph IR.

##### state

`Partial`\<[`GraphState`](../interfaces/GraphState.md)\>

Current (partial) graph state threaded from the runtime.

#### Returns

`Promise`\<[`NodeExecutionResult`](../interfaces/NodeExecutionResult.md)\>

A `NodeExecutionResult` describing the outcome.
