# Class: InMemorySpanExporter

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:178](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/Tracer.ts#L178)

In-memory exporter that stores spans for retrieval.

## Implements

- [`ISpanExporter`](../interfaces/ISpanExporter.md)

## Constructors

### Constructor

> **new InMemorySpanExporter**(`maxSpans?`): `InMemorySpanExporter`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:182](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/Tracer.ts#L182)

#### Parameters

##### maxSpans?

`number` = `1000`

#### Returns

`InMemorySpanExporter`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:206](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/Tracer.ts#L206)

#### Returns

`void`

***

### export()

> **export**(`spans`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:186](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/Tracer.ts#L186)

Exports spans to a backend.

#### Parameters

##### spans

[`ExportedSpan`](../interfaces/ExportedSpan.md)[]

Spans to export

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ISpanExporter`](../interfaces/ISpanExporter.md).[`export`](../interfaces/ISpanExporter.md#export)

***

### getSpans()

> **getSpans**(): [`ExportedSpan`](../interfaces/ExportedSpan.md)[]

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:194](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/Tracer.ts#L194)

#### Returns

[`ExportedSpan`](../interfaces/ExportedSpan.md)[]

***

### getSpansByName()

> **getSpansByName**(`name`): [`ExportedSpan`](../interfaces/ExportedSpan.md)[]

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:198](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/Tracer.ts#L198)

#### Parameters

##### name

`string`

#### Returns

[`ExportedSpan`](../interfaces/ExportedSpan.md)[]

***

### getSpansByTraceId()

> **getSpansByTraceId**(`traceId`): [`ExportedSpan`](../interfaces/ExportedSpan.md)[]

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:202](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/Tracer.ts#L202)

#### Parameters

##### traceId

`string`

#### Returns

[`ExportedSpan`](../interfaces/ExportedSpan.md)[]

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:210](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/Tracer.ts#L210)

Shuts down the exporter.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ISpanExporter`](../interfaces/ISpanExporter.md).[`shutdown`](../interfaces/ISpanExporter.md#shutdown)
