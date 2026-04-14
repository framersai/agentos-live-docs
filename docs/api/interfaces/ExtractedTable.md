# Interface: ExtractedTable

Defined in: [packages/agentos/src/memory/io/facade/types.ts:762](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L762)

A structured table extracted from a document.

## Properties

### caption?

> `optional` **caption**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:776](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L776)

Optional caption or title for the table.

***

### headers

> **headers**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:766](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L766)

Column header labels, in order.

***

### pageNumber?

> `optional` **pageNumber**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:781](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L781)

Page number the table appears on (1-based, PDF/DOCX).

***

### rows

> **rows**: `string`[][]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:771](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L771)

Data rows; each row is an array of cell strings aligned to `headers`.
