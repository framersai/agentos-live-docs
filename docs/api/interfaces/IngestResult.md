# Interface: IngestResult

Defined in: [packages/agentos/src/memory/io/facade/types.ts:438](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L438)

Summary of a completed ingestion run returned by `Memory.ingest()`.

## Properties

### chunksCreated

> **chunksCreated**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:452](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L452)

Total number of document chunks created and stored.

***

### failed

> **failed**: `object`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:447](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L447)

Files that could not be ingested, with per-file error messages.

#### error

> **error**: `string`

#### path

> **path**: `string`

***

### succeeded

> **succeeded**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:442](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L442)

Absolute paths of all files that were successfully ingested.

***

### tracesCreated

> **tracesCreated**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:457](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L457)

Total number of new memory traces created from the ingested content.
