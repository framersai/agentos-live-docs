# Interface: DocumentMetadata

Defined in: [packages/agentos/src/memory/io/facade/types.ts:671](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L671)

Arbitrary key-value metadata attached to a loaded document.
Well-known fields are typed explicitly; any additional fields are allowed.

## Indexable

\[`key`: `string`\]: `unknown`

Any additional metadata fields from the source document.

## Properties

### author?

> `optional` **author**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:676](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L676)

Primary author of the document.

***

### createdAt?

> `optional` **createdAt**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:691](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L691)

ISO 8601 creation timestamp.

***

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:688](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L688)

ISO 639-1 language code detected in the document.

#### Example

```ts
'en' | 'de' | 'fr'
```

***

### modifiedAt?

> `optional` **modifiedAt**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:694](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L694)

ISO 8601 last-modified timestamp.

***

### pageCount?

> `optional` **pageCount**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:679](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L679)

Number of pages (PDF/DOCX).

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:697](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L697)

Original file path or URL the document was loaded from.

***

### title?

> `optional` **title**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:673](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L673)

Document title extracted from front-matter or PDF info dict.

***

### wordCount?

> `optional` **wordCount**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:682](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L682)

Approximate word count of the full document text.
