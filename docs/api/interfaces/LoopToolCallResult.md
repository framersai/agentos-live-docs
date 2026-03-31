# Interface: LoopToolCallResult

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:108](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L108)

The outcome of executing a [LoopToolCallRequest](LoopToolCallRequest.md).

## Properties

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:122](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L122)

Human-readable error message when `success` is `false`.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:110](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L110)

Matches the originating `LoopToolCallRequest.id`.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:113](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L113)

Name of the tool that was called.

***

### output?

> `optional` **output**: `unknown`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:119](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L119)

Serialisable output returned by the tool on success.

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:116](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L116)

Whether the tool executed without error.
