# Interface: CompileOptions

Defined in: [engine/compiler/types.ts:37](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L37)

Options for compileScenario().

## Properties

### cache?

> `optional` **cache**: `boolean`

Defined in: [engine/compiler/types.ts:43](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L43)

Whether to use disk caching. Default: true.

***

### cacheDir?

> `optional` **cacheDir**: `string`

Defined in: [engine/compiler/types.ts:45](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L45)

Base directory for the disk cache. Default: '.paracosm/cache'.

***

### generateText?

> `optional` **generateText**: [`GenerateTextFn`](../type-aliases/GenerateTextFn.md)

Defined in: [engine/compiler/types.ts:47](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L47)

Custom generateText function (overrides provider/model).

***

### maxSearches?

> `optional` **maxSearches**: `number`

Defined in: [engine/compiler/types.ts:57](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L57)

Max web searches during seed ingestion. Default: 5.

***

### model?

> `optional` **model**: `string`

Defined in: [engine/compiler/types.ts:41](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L41)

Model name for hook generation.

***

### onProgress()?

> `optional` **onProgress**: (`hookName`, `status`) => `void`

Defined in: [engine/compiler/types.ts:49](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L49)

Progress callback for each hook being generated.

#### Parameters

##### hookName

`string`

##### status

`"generating"` | `"cached"` | `"done"` | `"fallback"`

#### Returns

`void`

***

### provider?

> `optional` **provider**: [`LlmProvider`](../../type-aliases/LlmProvider.md)

Defined in: [engine/compiler/types.ts:39](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L39)

LLM provider to use for hook generation.

***

### seedText?

> `optional` **seedText**: `string`

Defined in: [engine/compiler/types.ts:51](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L51)

Seed text to ingest into the scenario's knowledge bundle via LLM extraction + optional web search.

***

### seedUrl?

> `optional` **seedUrl**: `string`

Defined in: [engine/compiler/types.ts:53](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L53)

Seed URL to fetch and ingest. If set, seedText is ignored.

***

### telemetry?

> `optional` **telemetry**: `CompilerTelemetry`

Defined in: [engine/compiler/types.ts:64](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L64)

Optional telemetry sink that collects per-hook attempt counts and
any exhausted-retry fallbacks. Use when you want to surface compile
reliability in a dashboard or snapshot into /retry-stats. See
CompilerTelemetry.

***

### webSearch?

> `optional` **webSearch**: `boolean`

Defined in: [engine/compiler/types.ts:55](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/types.ts#L55)

Enable live web search during seed ingestion. Requires search API keys. Default: true.
