# Interface: ISpanExporter

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:180](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L180)

Span exporter interface.

## Methods

### export()

> **export**(`spans`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:185](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L185)

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

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:190](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L190)

Shuts down the exporter.

#### Returns

`Promise`\<`void`\>
