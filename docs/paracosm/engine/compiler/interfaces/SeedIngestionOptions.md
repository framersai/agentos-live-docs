# Interface: SeedIngestionOptions

Defined in: [engine/compiler/seed-ingestion.ts:20](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/seed-ingestion.ts#L20)

## Properties

### generateText

> **generateText**: [`GenerateTextFn`](../type-aliases/GenerateTextFn.md)

Defined in: [engine/compiler/seed-ingestion.ts:22](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/seed-ingestion.ts#L22)

LLM generateText function

***

### maxSearches?

> `optional` **maxSearches**: `number`

Defined in: [engine/compiler/seed-ingestion.ts:26](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/seed-ingestion.ts#L26)

Maximum number of web searches to perform. Default: 5.

***

### onProgress()?

> `optional` **onProgress**: (`step`, `status`) => `void`

Defined in: [engine/compiler/seed-ingestion.ts:28](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/seed-ingestion.ts#L28)

Progress callback

#### Parameters

##### step

`string`

##### status

`"done"` | `"start"`

#### Returns

`void`

***

### webSearch?

> `optional` **webSearch**: `boolean`

Defined in: [engine/compiler/seed-ingestion.ts:24](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/compiler/seed-ingestion.ts#L24)

Enable live web search to enrich with real citations. Requires search API keys in env.
