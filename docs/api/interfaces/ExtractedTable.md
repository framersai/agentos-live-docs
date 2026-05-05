# Interface: ExtractedTable

Defined in: [packages/agentos/src/memory/io/facade/types.ts:770](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L770)

A structured table extracted from a document.

## Properties

### caption?

> `optional` **caption**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:784](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L784)

Optional caption or title for the table.

***

### headers

> **headers**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:774](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L774)

Column header labels, in order.

***

### pageNumber?

> `optional` **pageNumber**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:789](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L789)

Page number the table appears on (1-based, PDF/DOCX).

***

### rows

> **rows**: `string`[][]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:779](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L779)

Data rows; each row is an array of cell strings aligned to `headers`.
