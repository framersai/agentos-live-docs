# Interface: ISpan

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:77](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L77)

Represents a single trace span.

## Properties

### attributes

> **attributes**: [`SpanAttributes`](../type-aliases/SpanAttributes.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:93](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L93)

Span attributes

***

### context

> **context**: [`TraceContext`](TraceContext.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:81](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L81)

Trace context

***

### endTime?

> `optional` **endTime**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:87](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L87)

End timestamp in milliseconds

***

### events

> **events**: [`SpanEvent`](SpanEvent.md)[]

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:95](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L95)

Span events

***

### kind

> **kind**: [`SpanKind`](../type-aliases/SpanKind.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:83](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L83)

Span kind

***

### links

> **links**: [`SpanLink`](SpanLink.md)[]

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:97](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L97)

Links to other spans

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:79](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L79)

Span name

***

### startTime

> **startTime**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:85](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L85)

Start timestamp in milliseconds

***

### status

> **status**: [`SpanStatus`](../type-aliases/SpanStatus.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:89](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L89)

Span status

***

### statusMessage?

> `optional` **statusMessage**: `string`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:91](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L91)

Status message

## Methods

### addEvent()

> **addEvent**(`name`, `attributes?`): `void`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:117](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L117)

Records an event.

#### Parameters

##### name

`string`

Event name

##### attributes?

[`SpanAttributes`](../type-aliases/SpanAttributes.md)

Event attributes

#### Returns

`void`

***

### end()

> **end**(): `void`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:135](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L135)

Ends the span.

#### Returns

`void`

***

### isRecording()

> **isRecording**(): `boolean`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:140](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L140)

Checks if the span is recording.

#### Returns

`boolean`

***

### recordException()

> **recordException**(`error`): `void`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:130](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L130)

Records an exception.

#### Parameters

##### error

`Error`

The error object

#### Returns

`void`

***

### setAttribute()

> **setAttribute**(`key`, `value`): `void`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:104](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L104)

Sets an attribute on the span.

#### Parameters

##### key

`string`

Attribute key

##### value

[`AttributeValue`](../type-aliases/AttributeValue.md)

Attribute value

#### Returns

`void`

***

### setAttributes()

> **setAttributes**(`attributes`): `void`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:110](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L110)

Sets multiple attributes.

#### Parameters

##### attributes

[`SpanAttributes`](../type-aliases/SpanAttributes.md)

Attributes to set

#### Returns

`void`

***

### setStatus()

> **setStatus**(`status`, `message?`): `void`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:124](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/ITracer.ts#L124)

Sets the span status.

#### Parameters

##### status

[`SpanStatus`](../type-aliases/SpanStatus.md)

Status code

##### message?

`string`

Optional message

#### Returns

`void`
