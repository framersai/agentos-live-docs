# Interface: ExportedSpan

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:162](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L162)

Exported span data for serialization.

## Properties

### attributes

> **attributes**: [`SpanAttributes`](../type-aliases/SpanAttributes.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:172](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L172)

***

### endTime?

> `optional` **endTime**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:169](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L169)

***

### events

> **events**: [`SpanEvent`](SpanEvent.md)[]

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:173](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L173)

***

### kind

> **kind**: [`SpanKind`](../type-aliases/SpanKind.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:167](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L167)

***

### links

> **links**: [`SpanLink`](SpanLink.md)[]

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:174](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L174)

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:166](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L166)

***

### parentSpanId?

> `optional` **parentSpanId**: `string`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:165](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L165)

***

### spanId

> **spanId**: `string`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:164](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L164)

***

### startTime

> **startTime**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:168](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L168)

***

### status

> **status**: [`SpanStatus`](../type-aliases/SpanStatus.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:170](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L170)

***

### statusMessage?

> `optional` **statusMessage**: `string`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:171](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L171)

***

### traceId

> **traceId**: `string`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:163](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L163)
