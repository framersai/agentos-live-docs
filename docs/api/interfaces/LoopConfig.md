# Interface: LoopConfig

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:32](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L32)

Configuration that governs a single LoopController execution.

## Properties

### failureMode

> **failureMode**: `"fail_open"` \| `"fail_closed"`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:47](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L47)

Determines how tool errors are handled:
- `'fail_open'`  — emit a `tool_error` event and continue the loop.
- `'fail_closed'` — throw immediately, aborting the loop.

***

### maxIterations

> **maxIterations**: `number`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:34](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L34)

Maximum number of ReAct iterations before the loop is forcibly terminated.

***

### parallelTools

> **parallelTools**: `boolean`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:40](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L40)

When `true`, all tool calls within a single iteration are dispatched in
parallel via `Promise.allSettled()`. When `false`, they execute sequentially.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:53](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L53)

Optional per-loop timeout in milliseconds. Currently reserved for
future implementation via AbortController; not enforced in v1.
