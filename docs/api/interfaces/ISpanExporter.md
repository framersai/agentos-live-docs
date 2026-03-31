# Interface: ISpanExporter

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:180](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/observability/ITracer.ts#L180)

Span exporter interface.

## Methods

### export()

> **export**(`spans`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:185](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/observability/ITracer.ts#L185)

Exports spans to a backend.

#### Parameters

##### spans

[`ExportedSpan`](ExportedSpan.md)[]

Spans to export

#### Returns

`Promise`\<`void`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:190](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/observability/ITracer.ts#L190)

Shuts down the exporter.

#### Returns

`Promise`\<`void`\>
