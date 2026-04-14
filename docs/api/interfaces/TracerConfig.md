# Interface: TracerConfig

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:222](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/observability/Tracer.ts#L222)

Tracer configuration.

## Properties

### autoExport?

> `optional` **autoExport**: `boolean`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:226](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/observability/Tracer.ts#L226)

Whether to auto-export on span end

***

### exportBatchSize?

> `optional` **exportBatchSize**: `number`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:228](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/observability/Tracer.ts#L228)

Batch size for export

***

### exportIntervalMs?

> `optional` **exportIntervalMs**: `number`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:230](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/observability/Tracer.ts#L230)

Export interval in ms

***

### maxBufferSize?

> `optional` **maxBufferSize**: `number`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:232](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/observability/Tracer.ts#L232)

Maximum spans to buffer

***

### name?

> `optional` **name**: `string`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:224](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/observability/Tracer.ts#L224)

Tracer name
