# Interface: ImportOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:492](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L492)

Options for importing memory data via `Memory.import()`.

## Properties

### dedup?

> `optional` **dedup**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:511](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L511)

Whether to skip importing traces whose content hash already exists in the
store, preventing duplicates on repeated imports.

#### Default

```ts
true
```

***

### format?

> `optional` **format**: `"json"` \| `"markdown"` \| `"auto"` \| `"sqlite"` \| `"csv"` \| `"obsidian"` \| `"chatgpt"`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:504](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/io/facade/types.ts#L504)

Source format of the import file.
- `'auto'`     – detect from file extension / magic bytes.
- `'sqlite'`   – AgentOS SQLite export.
- `'json'`     – newline-delimited JSON export.
- `'markdown'` – parse headings as trace content.
- `'obsidian'` – Obsidian vault (wiki-links become graph edges).
- `'chatgpt'`  – ChatGPT conversation export (conversations.json).
- `'csv'`      – flat CSV with `content` column.

#### Default

```ts
'auto'
```
