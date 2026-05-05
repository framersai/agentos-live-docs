# Interface: CompileOptions

Defined in: [apps/paracosm/src/engine/compiler/types.ts:38](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L38)

Options for compileScenario().

## Extends

- `RuntimeCredentialOptions`

## Properties

### anthropicKey?

> `optional` **anthropicKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:8](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L8)

Anthropic API key.

#### Inherited from

`RuntimeCredentialOptions.anthropicKey`

***

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:6](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L6)

OpenAI API key. Historical dashboard field name.

#### Inherited from

`RuntimeCredentialOptions.apiKey`

***

### braveKey?

> `optional` **braveKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:16](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L16)

#### Inherited from

`RuntimeCredentialOptions.braveKey`

***

### cache?

> `optional` **cache**: `boolean`

Defined in: [apps/paracosm/src/engine/compiler/types.ts:44](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L44)

Whether to use disk caching. Default: true.

***

### cacheDir?

> `optional` **cacheDir**: `string`

Defined in: [apps/paracosm/src/engine/compiler/types.ts:46](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L46)

Base directory for the disk cache. Default: '.paracosm/cache'.

***

### cohereKey?

> `optional` **cohereKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:17](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L17)

#### Inherited from

`RuntimeCredentialOptions.cohereKey`

***

### firecrawlKey?

> `optional` **firecrawlKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:14](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L14)

#### Inherited from

`RuntimeCredentialOptions.firecrawlKey`

***

### generateText?

> `optional` **generateText**: [`GenerateTextFn`](../type-aliases/GenerateTextFn.md)

Defined in: [apps/paracosm/src/engine/compiler/types.ts:48](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L48)

Custom generateText function (overrides provider/model).

***

### maxSearches?

> `optional` **maxSearches**: `number`

Defined in: [apps/paracosm/src/engine/compiler/types.ts:58](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L58)

Max web searches during seed ingestion. Default: 5.

***

### model?

> `optional` **model**: `string`

Defined in: [apps/paracosm/src/engine/compiler/types.ts:42](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L42)

Model name for hook generation.

***

### onProgress()?

> `optional` **onProgress**: (`hookName`, `status`) => `void`

Defined in: [apps/paracosm/src/engine/compiler/types.ts:50](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L50)

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

Defined in: [apps/paracosm/src/engine/compiler/types.ts:40](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L40)

LLM provider to use for hook generation.

***

### seedText?

> `optional` **seedText**: `string`

Defined in: [apps/paracosm/src/engine/compiler/types.ts:52](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L52)

Prompt, brief, or document text to ingest into the scenario's knowledge bundle via LLM extraction + optional web search.

***

### seedUrl?

> `optional` **seedUrl**: `string`

Defined in: [apps/paracosm/src/engine/compiler/types.ts:54](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L54)

URL to fetch and ingest as source material. If set, seedText is ignored.

***

### serperKey?

> `optional` **serperKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:13](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L13)

#### Inherited from

`RuntimeCredentialOptions.serperKey`

***

### tavilyKey?

> `optional` **tavilyKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:15](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L15)

#### Inherited from

`RuntimeCredentialOptions.tavilyKey`

***

### telemetry?

> `optional` **telemetry**: `CompilerTelemetry`

Defined in: [apps/paracosm/src/engine/compiler/types.ts:65](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L65)

Optional telemetry sink that collects per-hook attempt counts and
any exhausted-retry fallbacks. Use when you want to surface compile
reliability in a dashboard or snapshot into /retry-stats. See
CompilerTelemetry.

***

### webSearch?

> `optional` **webSearch**: `boolean`

Defined in: [apps/paracosm/src/engine/compiler/types.ts:56](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/types.ts#L56)

Enable live web search during seed ingestion. Requires search API keys. Default: true.
