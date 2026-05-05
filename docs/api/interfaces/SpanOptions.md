# Interface: SpanOptions

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:146](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/evaluation/observability/ITracer.ts#L146)

Options for creating a span.

## Properties

### attributes?

> `optional` **attributes**: [`SpanAttributes`](../type-aliases/SpanAttributes.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:150](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/evaluation/observability/ITracer.ts#L150)

Initial attributes

***

### kind?

> `optional` **kind**: [`SpanKind`](../type-aliases/SpanKind.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:148](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/evaluation/observability/ITracer.ts#L148)

Span kind

***

### links?

> `optional` **links**: [`SpanLink`](SpanLink.md)[]

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:152](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/evaluation/observability/ITracer.ts#L152)

Links to other spans

***

### parent?

> `optional` **parent**: [`TraceContext`](TraceContext.md)

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:156](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/evaluation/observability/ITracer.ts#L156)

Parent context

***

### startTime?

> `optional` **startTime**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:154](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/evaluation/observability/ITracer.ts#L154)

Start time override
