# Interface: TracerStats

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:196](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/ITracer.ts#L196)

Tracer statistics.

## Properties

### activeSpans

> **activeSpans**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:200](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/ITracer.ts#L200)

Active (unfinished) spans

***

### avgDurationMs

> **avgDurationMs**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:208](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/ITracer.ts#L208)

Average span duration

***

### errorSpans

> **errorSpans**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:202](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/ITracer.ts#L202)

Error spans

***

### exportedSpans

> **exportedSpans**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:210](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/ITracer.ts#L210)

Spans exported

***

### spansByName

> **spansByName**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:206](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/ITracer.ts#L206)

Spans by operation name

***

### totalEvents

> **totalEvents**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:204](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/ITracer.ts#L204)

Total events recorded

***

### totalSpans

> **totalSpans**: `number`

Defined in: [packages/agentos/src/evaluation/observability/ITracer.ts:198](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/ITracer.ts#L198)

Total spans created
