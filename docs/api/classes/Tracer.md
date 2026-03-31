# Class: Tracer

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:246](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L246)

Distributed tracer implementation.

## Implements

- [`ITracer`](../interfaces/ITracer.md)

## Constructors

### Constructor

> **new Tracer**(`config?`): `Tracer`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:257](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L257)

#### Parameters

##### config?

`Partial`\<[`TracerConfig`](../interfaces/TracerConfig.md)\>

#### Returns

`Tracer`

## Properties

### name

> `readonly` **name**: `string`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:247](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L247)

Gets the tracer name.

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`name`](../interfaces/ITracer.md#name)

## Methods

### addExporter()

> **addExporter**(`exporter`): `void`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:381](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L381)

Adds a span exporter.

#### Parameters

##### exporter

[`ISpanExporter`](../interfaces/ISpanExporter.md)

Exporter to add

#### Returns

`void`

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`addExporter`](../interfaces/ITracer.md#addexporter)

***

### extract()

> **extract**(`carrier`): [`TraceContext`](../interfaces/TraceContext.md) \| `undefined`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:346](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L346)

Extracts trace context from a carrier.

#### Parameters

##### carrier

`Record`\<`string`, `string`\>

Object to extract from

#### Returns

[`TraceContext`](../interfaces/TraceContext.md) \| `undefined`

Extracted context or undefined

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`extract`](../interfaces/ITracer.md#extract)

***

### flush()

> **flush**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:385](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L385)

Forces export of all completed spans.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`flush`](../interfaces/ITracer.md#flush)

***

### getActiveSpans()

> **getActiveSpans**(): [`ISpan`](../interfaces/ISpan.md)[]

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:377](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L377)

Gets all active spans.

#### Returns

[`ISpan`](../interfaces/ISpan.md)[]

Array of active spans

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`getActiveSpans`](../interfaces/ITracer.md#getactivespans)

***

### getCurrentContext()

> **getCurrentContext**(): [`TraceContext`](../interfaces/TraceContext.md) \| `undefined`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:267](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L267)

Gets the current trace context.

#### Returns

[`TraceContext`](../interfaces/TraceContext.md) \| `undefined`

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`getCurrentContext`](../interfaces/ITracer.md#getcurrentcontext)

***

### getSpan()

> **getSpan**(`spanId`): [`ISpan`](../interfaces/ISpan.md) \| `undefined`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:373](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L373)

Gets a span by ID.

#### Parameters

##### spanId

`string`

Span ID

#### Returns

[`ISpan`](../interfaces/ISpan.md) \| `undefined`

The span or undefined

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`getSpan`](../interfaces/ITracer.md#getspan)

***

### getStats()

> **getStats**(): [`TracerStats`](../interfaces/TracerStats.md)

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:401](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L401)

Gets tracer statistics.

#### Returns

[`TracerStats`](../interfaces/TracerStats.md)

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`getStats`](../interfaces/ITracer.md#getstats)

***

### inject()

> **inject**\<`T`\>(`carrier`): `T`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:334](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L334)

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

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`inject`](../interfaces/ITracer.md#inject)

***

### resetStats()

> **resetStats**(): `void`

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:405](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L405)

Resets statistics.

#### Returns

`void`

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`resetStats`](../interfaces/ITracer.md#resetstats)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:409](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L409)

Shuts down the tracer.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`shutdown`](../interfaces/ITracer.md#shutdown)

***

### startSpan()

> **startSpan**(`name`, `options?`): [`ISpan`](../interfaces/ISpan.md)

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:271](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L271)

Starts a new span.

#### Parameters

##### name

`string`

Span name

##### options?

[`SpanOptions`](../interfaces/SpanOptions.md)

Span options

#### Returns

[`ISpan`](../interfaces/ISpan.md)

The created span

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`startSpan`](../interfaces/ITracer.md#startspan)

***

### withSpan()

> **withSpan**\<`T`\>(`name`, `fn`, `options?`): `Promise`\<`T`\>

Defined in: [packages/agentos/src/evaluation/observability/Tracer.ts:320](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/evaluation/observability/Tracer.ts#L320)

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

[`SpanOptions`](../interfaces/SpanOptions.md)

Span options

#### Returns

`Promise`\<`T`\>

Result of the function

#### Implementation of

[`ITracer`](../interfaces/ITracer.md).[`withSpan`](../interfaces/ITracer.md#withspan)
