# Interface: ISpanExporter

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:180](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/ITracer.ts#L180)

Span exporter interface.

## Methods

### export()

> **export**(`spans`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:185](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/ITracer.ts#L185)

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

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:190](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/ITracer.ts#L190)

Shuts down the exporter.

#### Returns

`Promise`\<`void`\>
