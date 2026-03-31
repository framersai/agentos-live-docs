# Class: JsonExporter

Defined in: [packages/agentos/src/memory/io/JsonExporter.ts:143](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/JsonExporter.ts#L143)

Exports a `SqliteBrain` to a structured JSON file.

**Usage:**
```ts
const exporter = new JsonExporter(brain);
await exporter.export('/path/to/export.json', { includeEmbeddings: false });
```

## Constructors

### Constructor

> **new JsonExporter**(`brain`): `JsonExporter`

Defined in: [packages/agentos/src/memory/io/JsonExporter.ts:147](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/JsonExporter.ts#L147)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The `SqliteBrain` instance to read from.

#### Returns

`JsonExporter`

## Methods

### export()

> **export**(`outputPath`, `options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/io/JsonExporter.ts:163](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/JsonExporter.ts#L163)

Export the full brain state to a JSON file at `outputPath`.

#### Parameters

##### outputPath

`string`

Absolute path to write the JSON output.

##### options?

[`ExportOptions`](../interfaces/ExportOptions.md)

Optional export configuration.

#### Returns

`Promise`\<`void`\>

***

### exportToString()

> **exportToString**(`options?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/memory/io/JsonExporter.ts:175](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/io/JsonExporter.ts#L175)

Export the full brain state as a JSON string without filesystem access.

#### Parameters

##### options?

[`ExportOptions`](../interfaces/ExportOptions.md)

Optional export configuration (embeddings, conversations).

#### Returns

`Promise`\<`string`\>

Pretty-printed JSON string of the full brain payload.
