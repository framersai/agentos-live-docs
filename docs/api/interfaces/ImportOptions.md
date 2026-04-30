# Interface: ImportOptions

Defined in: [packages/agentos/src/memory/io/facade/types.ts:500](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L500)

Options for importing memory data via `Memory.import()`.

## Properties

### dedup?

> `optional` **dedup**: `boolean`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:519](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L519)

Whether to skip importing traces whose content hash already exists in the
store, preventing duplicates on repeated imports.

#### Default

```ts
true
```

***

### format?

> `optional` **format**: `"json"` \| `"markdown"` \| `"auto"` \| `"sqlite"` \| `"csv"` \| `"obsidian"` \| `"chatgpt"`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:512](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L512)

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
