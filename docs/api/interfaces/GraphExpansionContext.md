# Interface: GraphExpansionContext

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:76](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L76)

## Properties

### checkpointIdBefore?

> `optional` **checkpointIdBefore**: `string`

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:82](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L82)

***

### completedNodes

> **completedNodes**: `string`[]

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:83](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L83)

***

### graph

> **graph**: [`CompiledExecutionGraph`](CompiledExecutionGraph.md)

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:77](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L77)

***

### nodeId

> **nodeId**: `string`

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:79](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L79)

***

### nodeResults

> **nodeResults**: `Record`\<`string`, \{ `durationMs`: `number`; `effectClass`: [`EffectClass`](../type-aliases/EffectClass.md); `output`: `unknown`; \}\>

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:85](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L85)

***

### request

> **request**: [`GraphExpansionRequest`](GraphExpansionRequest.md)

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:81](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L81)

***

### runId

> **runId**: `string`

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:78](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L78)

***

### skippedNodes

> **skippedNodes**: `string`[]

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:84](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L84)

***

### state

> **state**: [`GraphState`](GraphState.md)

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:80](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/runtime/GraphRuntime.ts#L80)
