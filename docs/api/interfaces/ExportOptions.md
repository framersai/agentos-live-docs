# Interface: ExportOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:459](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L459)

Options for exporting the memory store via `Memory.export()`.

## Properties

### format?

> `optional` **format**: `"json"` \| `"markdown"` \| `"sqlite"` \| `"obsidian"`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:468](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L468)

Serialisation format for the export artifact.
- `'sqlite'`   – copy of the SQLite file (binary).
- `'json'`     – newline-delimited JSON of all traces.
- `'markdown'` – human-readable Markdown summary.
- `'obsidian'` – Obsidian vault with one note per trace and wiki-links.

#### Default

```ts
'json'
```

***

### includeConversations?

> `optional` **includeConversations**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:482](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L482)

Whether to include conversation turn traces in the export.

#### Default

```ts
true
```

***

### includeEmbeddings?

> `optional` **includeEmbeddings**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:476](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/facade/types.ts#L476)

Whether to include raw embedding vectors in the export.
Embeddings dramatically increase file size but allow round-trip import
without re-embedding.

#### Default

```ts
false
```
