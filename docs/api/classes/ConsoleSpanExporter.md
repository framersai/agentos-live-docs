# Class: ConsoleSpanExporter

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:140](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/Tracer.ts#L140)

Simple console exporter for development.

## Implements

- [`ISpanExporter`](../interfaces/ISpanExporter.md)

## Constructors

### Constructor

> **new ConsoleSpanExporter**(`prefix?`): `ConsoleSpanExporter`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:143](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/Tracer.ts#L143)

#### Parameters

##### prefix?

`string` = `'[Trace]'`

#### Returns

`ConsoleSpanExporter`

## Methods

### export()

> **export**(`spans`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:147](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/Tracer.ts#L147)

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

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:166](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/Tracer.ts#L166)

Shuts down the exporter.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ISpanExporter`](../interfaces/ISpanExporter.md).[`shutdown`](../interfaces/ISpanExporter.md#shutdown)
