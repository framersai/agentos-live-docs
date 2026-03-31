# Class: JsonImporter

Defined in: [packages/agentos/src/memory/io/JsonImporter.ts:159](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/JsonImporter.ts#L159)

Imports a `JsonExporter`-compatible JSON file into a `SqliteBrain`.

**Usage:**
```ts
const importer = new JsonImporter(brain);
const result = await importer.import('/path/to/export.json');
console.log(result.imported, result.skipped, result.errors);
```

## Constructors

### Constructor

> **new JsonImporter**(`brain`): `JsonImporter`

Defined in: [packages/agentos/src/memory/io/JsonImporter.ts:163](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/JsonImporter.ts#L163)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The target `SqliteBrain` to import into.

#### Returns

`JsonImporter`

## Methods

### import()

> **import**(`sourcePath`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/io/JsonImporter.ts:185](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/JsonImporter.ts#L185)

Read and merge a JSON export file into the target brain.

Validation:
- The file must be valid JSON.
- The top-level object must contain a `traces` array.

Deduplication:
- For `memory_traces`: SHA-256 of `content` is used as the dedup key.
  Existing rows with the same hash are skipped.
- For `knowledge_nodes`: SHA-256 of `label` + `type`.
- For `knowledge_edges`: SHA-256 of `source_id` + `target_id` + `type`.

#### Parameters

##### sourcePath

`string`

Absolute path to the JSON file to import.

##### options?

`Pick`\<[`ImportOptions`](../interfaces/ImportOptions.md), `"dedup"`\>

#### Returns

`Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

`ImportResult` with counts of imported, skipped, and errored items.

***

### importFromString()

> **importFromString**(`jsonContent`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/io/JsonImporter.ts:207](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/JsonImporter.ts#L207)

Import a JSON string directly into the target brain without filesystem access.

#### Parameters

##### jsonContent

`string`

The JSON string to parse and import.

##### options?

`Pick`\<[`ImportOptions`](../interfaces/ImportOptions.md), `"dedup"`\>

#### Returns

`Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

`ImportResult` with counts of imported, skipped, and errored items.
