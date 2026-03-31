# Interface: AgentOSObservabilityConfig

Defined in: [packages/agentos/src/evaluation/observability/otel.ts:4](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/observability/otel.ts#L4)

## Properties

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/evaluation/observability/otel.ts:9](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/observability/otel.ts#L9)

Master switch. When explicitly `false`, all AgentOS observability helpers are disabled
regardless of environment variables.

***

### logging?

> `optional` **logging**: `object`

Defined in: [packages/agentos/src/evaluation/observability/otel.ts:32](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/observability/otel.ts#L32)

#### exportToOtel?

> `optional` **exportToOtel**: `boolean`

When enabled, AgentOS will emit OpenTelemetry LogRecords using `@opentelemetry/api-logs`.

This is still opt-in because it can increase CPU/network usage and may result in double-ingestion
if you already ship stdout logs separately.

Note: This does not start OpenTelemetry. Your host app must install/start an OTEL SDK and
configure a logs exporter (e.g. `OTEL_LOGS_EXPORTER=otlp` in NodeSDK).

Default: false.

#### includeTraceIds?

> `optional` **includeTraceIds**: `boolean`

When enabled, `PinoLogger` will add `trace_id` and `span_id` fields to log meta
when an active span exists.

Note: This does not start OpenTelemetry by itself; it only correlates logs with
whatever tracing provider your host app installed.

Default: false.

#### otelLoggerName?

> `optional` **otelLoggerName**: `string`

OpenTelemetry logger name used for AgentOS LogRecords.
Default: "@framers/agentos".

***

### metrics?

> `optional` **metrics**: `object`

Defined in: [packages/agentos/src/evaluation/observability/otel.ts:64](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/observability/otel.ts#L64)

#### enabled?

> `optional` **enabled**: `boolean`

Enables AgentOS metrics (counters/histograms).
Default: false.

#### meterName?

> `optional` **meterName**: `string`

OpenTelemetry meter name used for AgentOS metrics.
Default: "@framers/agentos".

***

### tracing?

> `optional` **tracing**: `object`

Defined in: [packages/agentos/src/evaluation/observability/otel.ts:11](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/observability/otel.ts#L11)

#### enabled?

> `optional` **enabled**: `boolean`

Enables manual AgentOS spans (agent turn, tool-result handling, etc).
Default: false.

#### includeTraceInResponses?

> `optional` **includeTraceInResponses**: `boolean`

When enabled, AgentOS attaches `metadata.trace` (traceId/spanId/traceparent)
to select streamed chunks (e.g. metadata updates, final responses, errors).
Default: false.

#### tracerName?

> `optional` **tracerName**: `string`

OpenTelemetry tracer name used for AgentOS spans.
Default: "@framers/agentos".
