# Class: CsvImporter

Defined in: [packages/agentos/src/memory/io/CsvImporter.ts:34](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/CsvImporter.ts#L34)

Imports a flat CSV file into a `Brain`.

## Constructors

### Constructor

> **new CsvImporter**(`brain`): `CsvImporter`

Defined in: [packages/agentos/src/memory/io/CsvImporter.ts:35](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/CsvImporter.ts#L35)

#### Parameters

##### brain

[`Brain`](Brain.md)

#### Returns

`CsvImporter`

## Methods

### import()

> **import**(`sourcePath`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/io/CsvImporter.ts:43](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/CsvImporter.ts#L43)

Read, parse, and import a CSV file.

#### Parameters

##### sourcePath

`string`

Absolute or relative path to the CSV file.

##### options?

`Pick`\<[`ImportOptions`](../interfaces/ImportOptions.md), `"dedup"`\>

#### Returns

`Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Import summary with imported/skipped/error counts.

***

### importFromString()

> **importFromString**(`csvContent`, `options?`): `Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Defined in: [packages/agentos/src/memory/io/CsvImporter.ts:64](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/CsvImporter.ts#L64)

Import a CSV string directly into the target brain without filesystem access.

#### Parameters

##### csvContent

`string`

The raw CSV string to parse and import.

##### options?

`Pick`\<[`ImportOptions`](../interfaces/ImportOptions.md), `"dedup"`\>

#### Returns

`Promise`\<[`ImportResult`](../interfaces/ImportResult.md)\>

Import summary with imported/skipped/error counts.
