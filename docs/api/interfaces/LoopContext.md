# Interface: LoopContext

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:65](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/runtime/LoopController.ts#L65)

Execution context provided to the LoopController by the caller.
Abstracts away the underlying LLM/GMI implementation so the loop logic
remains provider-agnostic.

## Properties

### addToolResults()

> **addToolResults**: (`results`) => `void`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:84](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/runtime/LoopController.ts#L84)

Feed tool results back into the conversation so the next `generateStream`
call has access to them. Typically appends tool messages to the message list.

#### Parameters

##### results

[`LoopToolCallResult`](LoopToolCallResult.md)[]

#### Returns

`void`

***

### executeTool()

> **executeTool**: (`toolCall`) => `Promise`\<[`LoopToolCallResult`](LoopToolCallResult.md)\>

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:78](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/runtime/LoopController.ts#L78)

Execute a single tool call and return its result.
Implementations should never throw — instead return a result with
`success: false` and a populated `error` field.

#### Parameters

##### toolCall

[`LoopToolCallRequest`](LoopToolCallRequest.md)

#### Returns

`Promise`\<[`LoopToolCallResult`](LoopToolCallResult.md)\>

***

### generateStream()

> **generateStream**: () => `AsyncGenerator`\<`LoopChunk`, `LoopOutput`, `undefined`\>

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:71](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/orchestration/runtime/LoopController.ts#L71)

Async generator that streams chunks during a single LLM inference pass.
Must return a `LoopOutput` as its generator return value (the value
passed to the final `done: true` result from `.next()`).

#### Returns

`AsyncGenerator`\<`LoopChunk`, `LoopOutput`, `undefined`\>
