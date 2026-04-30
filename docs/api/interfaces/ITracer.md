# Interface: ITracer

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:243](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L243)

Interface for the distributed tracer.

## Example

```typescript
const tracer = new Tracer();

const span = tracer.startSpan('process-request', {
  kind: 'server',
  attributes: { 'gmi.id': 'gmi-123' },
});

try {
  // Process request
  span.addEvent('processing-started');
  const result = await processRequest();
  span.setAttribute('result.count', result.length);
  span.setStatus('ok');
} catch (error) {
  span.recordException(error);
  span.setStatus('error', error.message);
} finally {
  span.end();
}
```

## Properties

### name

> `readonly` **name**: `string`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:247](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L247)

Gets the tracer name.

## Methods

### addExporter()

> **addExporter**(`exporter`): `void`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:302](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L302)

Adds a span exporter.

#### Parameters

##### exporter

[`ISpanExporter`](ISpanExporter.md)

Exporter to add

#### Returns

`void`

***

### extract()

> **extract**(`carrier`): [`TraceContext`](TraceContext.md) \| `undefined`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:283](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L283)

Extracts trace context from a carrier.

#### Parameters

##### carrier

`Record`\<`string`, `string`\>

Object to extract from

#### Returns

[`TraceContext`](TraceContext.md) \| `undefined`

Extracted context or undefined

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:307](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L307)

Forces export of all completed spans.

#### Returns

`Promise`\<`void`\>

***

### getActiveSpans()

> **getActiveSpans**(): [`ISpan`](ISpan.md)[]

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:296](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L296)

Gets all active spans.

#### Returns

[`ISpan`](ISpan.md)[]

Array of active spans

***

### getCurrentContext()

> **getCurrentContext**(): [`TraceContext`](TraceContext.md) \| `undefined`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:252](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L252)

Gets the current trace context.

#### Returns

[`TraceContext`](TraceContext.md) \| `undefined`

***

### getSpan()

> **getSpan**(`spanId`): [`ISpan`](ISpan.md) \| `undefined`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:290](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L290)

Gets a span by ID.

#### Parameters

##### spanId

`string`

Span ID

#### Returns

[`ISpan`](ISpan.md) \| `undefined`

The span or undefined

***

### getStats()

> **getStats**(): [`TracerStats`](TracerStats.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:312](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L312)

Gets tracer statistics.

#### Returns

[`TracerStats`](TracerStats.md)

***

### inject()

> **inject**\<`T`\>(`carrier`): `T`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:276](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L276)

Injects trace context into a carrier (for propagation).

#### Type Parameters

##### T

`T` *extends* `Record`\<`string`, `string`\>

#### Parameters

##### carrier

`T`

Object to inject into

#### Returns

`T`

The carrier with injected context

***

### resetStats()

> **resetStats**(): `void`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:317](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L317)

Resets statistics.

#### Returns

`void`

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:322](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L322)

Shuts down the tracer.

#### Returns

`Promise`\<`void`\>

***

### startSpan()

> **startSpan**(`name`, `options?`): [`ISpan`](ISpan.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:260](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L260)

Starts a new span.

#### Parameters

##### name

`string`

Span name

##### options?

[`SpanOptions`](SpanOptions.md)

Span options

#### Returns

[`ISpan`](ISpan.md)

The created span

***

### withSpan()

> **withSpan**\<`T`\>(`name`, `fn`, `options?`): `Promise`\<`T`\>

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:269](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/observability/ITracer.ts#L269)

Wraps an async function with tracing.

#### Type Parameters

##### T

`T`

#### Parameters

##### name

`string`

Span name

##### fn

(`span`) => `Promise`\<`T`\>

Function to wrap

##### options?

[`SpanOptions`](SpanOptions.md)

Span options

#### Returns

`Promise`\<`T`\>

Result of the function
