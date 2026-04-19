# Interface: TraceContext

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:39](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L39)

Context for propagating trace information.

## Properties

### baggage?

> `optional` **baggage**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:49](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L49)

Baggage items

***

### parentSpanId?

> `optional` **parentSpanId**: `string`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:45](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L45)

Parent span ID if exists

***

### spanId

> **spanId**: `string`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:43](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L43)

Current span ID

***

### traceFlags

> **traceFlags**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:47](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L47)

Trace flags (e.g., sampling)

***

### traceId

> **traceId**: `string`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:41](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L41)

Unique trace ID
