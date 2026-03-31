# Interface: MissionGraphPatch

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:20](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/events/GraphEvent.ts#L20)

## Properties

### addEdges

> **addEdges**: [`GraphEdge`](GraphEdge.md)[]

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:22](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/events/GraphEvent.ts#L22)

***

### addNodes

> **addNodes**: [`GraphNode`](GraphNode.md)[]

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:21](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/events/GraphEvent.ts#L21)

***

### estimatedCostDelta

> **estimatedCostDelta**: `number`

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:26](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/events/GraphEvent.ts#L26)

***

### estimatedLatencyDelta

> **estimatedLatencyDelta**: `number`

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:27](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/events/GraphEvent.ts#L27)

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:25](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/events/GraphEvent.ts#L25)

***

### removeNodes?

> `optional` **removeNodes**: `string`[]

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:23](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/events/GraphEvent.ts#L23)

***

### rewireEdges?

> `optional` **rewireEdges**: `object`[]

Defined in: [packages/agentos/src/orchestration/events/GraphEvent.ts:24](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/events/GraphEvent.ts#L24)

#### from

> **from**: `string`

#### newTarget

> **newTarget**: `string`

#### to

> **to**: `string`
