# Interface: SeedIngestionOptions

Defined in: [apps/paracosm/src/engine/compiler/seed-ingestion.ts:24](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/seed-ingestion.ts#L24)

## Extends

- `SearchCredentialOptions`

## Properties

### braveKey?

> `optional` **braveKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:16](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L16)

#### Inherited from

`SearchCredentialOptions.braveKey`

***

### cohereKey?

> `optional` **cohereKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:17](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L17)

#### Inherited from

`SearchCredentialOptions.cohereKey`

***

### firecrawlKey?

> `optional` **firecrawlKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:14](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L14)

#### Inherited from

`SearchCredentialOptions.firecrawlKey`

***

### generateText

> **generateText**: [`GenerateTextFn`](../type-aliases/GenerateTextFn.md)

Defined in: [apps/paracosm/src/engine/compiler/seed-ingestion.ts:26](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/seed-ingestion.ts#L26)

LLM generateText function

***

### maxSearches?

> `optional` **maxSearches**: `number`

Defined in: [apps/paracosm/src/engine/compiler/seed-ingestion.ts:30](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/seed-ingestion.ts#L30)

Maximum number of web searches to perform. Default: 5.

***

### onProgress()?

> `optional` **onProgress**: (`step`, `status`) => `void`

Defined in: [apps/paracosm/src/engine/compiler/seed-ingestion.ts:32](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/seed-ingestion.ts#L32)

Progress callback

#### Parameters

##### step

`string`

##### status

`"done"` | `"start"`

#### Returns

`void`

***

### serperKey?

> `optional` **serperKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:13](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L13)

#### Inherited from

`SearchCredentialOptions.serperKey`

***

### tavilyKey?

> `optional` **tavilyKey**: `string`

Defined in: [apps/paracosm/src/engine/provider-credentials.ts:15](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/provider-credentials.ts#L15)

#### Inherited from

`SearchCredentialOptions.tavilyKey`

***

### webSearch?

> `optional` **webSearch**: `boolean`

Defined in: [apps/paracosm/src/engine/compiler/seed-ingestion.ts:28](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/compiler/seed-ingestion.ts#L28)

Enable live web search to enrich with real citations. Requires search API keys in env.
