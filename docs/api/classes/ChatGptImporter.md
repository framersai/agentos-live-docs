# Class: ChatGptImporter

Defined in: [packages/agentos/src/memory/io/ChatGptImporter.ts:94](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ChatGptImporter.ts#L94)

Imports a ChatGPT `conversations.json` export into a `SqliteBrain`.

**Usage:**
```ts
const importer = new ChatGptImporter(brain);
const result = await importer.import('/path/to/conversations.json');
```

## Constructors

### Constructor

> **new ChatGptImporter**(`brain`): `ChatGptImporter`

Defined in: [packages/agentos/src/memory/io/ChatGptImporter.ts:98](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ChatGptImporter.ts#L98)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The target `SqliteBrain` to import into.

#### Returns

`ChatGptImporter`

## Methods

### import()

> **import**(`sourcePath`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/io/ChatGptImporter.ts:111](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ChatGptImporter.ts#L111)

Parse `conversations.json` and import all conversations and message pairs.

#### Parameters

##### sourcePath

`string`

Absolute path to the ChatGPT `conversations.json` file.

##### options?

`Pick`\<[`ImportOptions`](../interfaces/ImportOptions.md), `"dedup"`\>

#### Returns

`Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

`ImportResult` with counts of imported traces, skipped duplicates,
  and any per-item error messages.
