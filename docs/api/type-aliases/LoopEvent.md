# Type Alias: LoopEvent

> **LoopEvent** = \{ `content`: `string`; `type`: `"text_delta"`; \} \| \{ `toolCalls`: [`LoopToolCallRequest`](../interfaces/LoopToolCallRequest.md)[]; `type`: `"tool_call_request"`; \} \| \{ `result`: [`LoopToolCallResult`](../interfaces/LoopToolCallResult.md); `toolName`: `string`; `type`: `"tool_result"`; \} \| \{ `error`: `string`; `toolName`: `string`; `type`: `"tool_error"`; \} \| \{ `iteration`: `number`; `type`: `"max_iterations_reached"`; \} \| \{ `totalIterations`: `number`; `type`: `"loop_complete"`; \}

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:176](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/runtime/LoopController.ts#L176)

Discriminated union of all events emitted by [LoopController.execute](../classes/LoopController.md#execute).
Consumers can switch on `event.type` to handle each case.
