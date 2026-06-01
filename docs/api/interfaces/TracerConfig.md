# Interface: TracerConfig

Defined in: [packages/agentos/src/safety/evaluation/observability/Tracer.ts:222](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/observability/Tracer.ts#L222)

Tracer configuration.

## Properties

### autoExport?

> `optional` **autoExport**: `boolean`

Defined in: [packages/agentos/src/safety/evaluation/observability/Tracer.ts:226](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/observability/Tracer.ts#L226)

Whether to auto-export on span end

***

### exportBatchSize?

> `optional` **exportBatchSize**: `number`

Defined in: [packages/agentos/src/safety/evaluation/observability/Tracer.ts:228](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/observability/Tracer.ts#L228)

Batch size for export

***

### exportIntervalMs?

> `optional` **exportIntervalMs**: `number`

Defined in: [packages/agentos/src/safety/evaluation/observability/Tracer.ts:230](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/observability/Tracer.ts#L230)

Export interval in ms

***

### maxBufferSize?

> `optional` **maxBufferSize**: `number`

Defined in: [packages/agentos/src/safety/evaluation/observability/Tracer.ts:232](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/observability/Tracer.ts#L232)

Maximum spans to buffer

***

### name?

> `optional` **name**: `string`

Defined in: [packages/agentos/src/safety/evaluation/observability/Tracer.ts:224](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/observability/Tracer.ts#L224)

Tracer name
