# Class: JsonExporter

Defined in: [packages/agentos/src/memory/io/JsonExporter.ts:143](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/JsonExporter.ts#L143)

Exports a `Brain` to a structured JSON file.

**Usage:**
```ts
const exporter = new JsonExporter(brain);
await exporter.export('/path/to/export.json', { includeEmbeddings: false });
```

## Constructors

### Constructor

> **new JsonExporter**(`brain`): `JsonExporter`

Defined in: [packages/agentos/src/memory/io/JsonExporter.ts:147](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/JsonExporter.ts#L147)

#### Parameters

##### brain

[`Brain`](Brain.md)

The `Brain` instance to read from.

#### Returns

`JsonExporter`

## Methods

### export()

> **export**(`outputPath`, `options?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/io/JsonExporter.ts:163](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/JsonExporter.ts#L163)

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

Defined in: [packages/agentos/src/memory/io/JsonExporter.ts:175](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/JsonExporter.ts#L175)

Export the full brain state as a JSON string without filesystem access.

#### Parameters

##### options?

[`ExportOptions`](../interfaces/ExportOptions.md)

Optional export configuration (embeddings, conversations).

#### Returns

`Promise`\<`string`\>

Pretty-printed JSON string of the full brain payload.
