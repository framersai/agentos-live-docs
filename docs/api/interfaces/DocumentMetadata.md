# Interface: DocumentMetadata

Defined in: [packages/agentos/src/memory/io/facade/types.ts:663](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L663)

Arbitrary key-value metadata attached to a loaded document.
Well-known fields are typed explicitly; any additional fields are allowed.

## Indexable

\[`key`: `string`\]: `unknown`

Any additional metadata fields from the source document.

## Properties

### author?

> `optional` **author**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:668](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L668)

Primary author of the document.

***

### createdAt?

> `optional` **createdAt**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:683](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L683)

ISO 8601 creation timestamp.

***

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:680](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L680)

ISO 639-1 language code detected in the document.

#### Example

```ts
'en' | 'de' | 'fr'
```

***

### modifiedAt?

> `optional` **modifiedAt**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:686](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L686)

ISO 8601 last-modified timestamp.

***

### pageCount?

> `optional` **pageCount**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:671](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L671)

Number of pages (PDF/DOCX).

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:689](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L689)

Original file path or URL the document was loaded from.

***

### title?

> `optional` **title**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:665](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L665)

Document title extracted from front-matter or PDF info dict.

***

### wordCount?

> `optional` **wordCount**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:674](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L674)

Approximate word count of the full document text.
