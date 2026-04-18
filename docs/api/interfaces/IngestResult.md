# Interface: IngestResult

Defined in: [packages/agentos/src/memory/io/facade/types.ts:430](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L430)

Summary of a completed ingestion run returned by `Memory.ingest()`.

## Properties

### chunksCreated

> **chunksCreated**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:444](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L444)

Total number of document chunks created and stored.

***

### failed

> **failed**: `object`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:439](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L439)

Files that could not be ingested, with per-file error messages.

#### error

> **error**: `string`

#### path

> **path**: `string`

***

### succeeded

> **succeeded**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:434](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L434)

Absolute paths of all files that were successfully ingested.

***

### tracesCreated

> **tracesCreated**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:449](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/io/facade/types.ts#L449)

Total number of new memory traces created from the ingested content.
