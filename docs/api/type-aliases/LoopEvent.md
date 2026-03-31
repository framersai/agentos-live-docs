# Type Alias: LoopEvent

> **LoopEvent** = \{ `content`: `string`; `type`: `"text_delta"`; \} \| \{ `toolCalls`: [`LoopToolCallRequest`](../interfaces/LoopToolCallRequest.md)[]; `type`: `"tool_call_request"`; \} \| \{ `result`: [`LoopToolCallResult`](../interfaces/LoopToolCallResult.md); `toolName`: `string`; `type`: `"tool_result"`; \} \| \{ `error`: `string`; `toolName`: `string`; `type`: `"tool_error"`; \} \| \{ `iteration`: `number`; `type`: `"max_iterations_reached"`; \} \| \{ `totalIterations`: `number`; `type`: `"loop_complete"`; \}

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:176](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/runtime/LoopController.ts#L176)

Discriminated union of all events emitted by [LoopController.execute](../classes/LoopController.md#execute).
Consumers can switch on `event.type` to handle each case.
