# Interface: ImportResult

Defined in: [packages/agentos/src/memory/io/facade/types.ts:521](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/facade/types.ts#L521)

Summary of a completed import operation returned by `Memory.import()`.

## Properties

### errors

> **errors**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:535](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/facade/types.ts#L535)

Human-readable error messages for any traces that failed to import.

***

### imported

> **imported**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:525](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/facade/types.ts#L525)

Number of traces successfully imported and written to the store.

***

### skipped

> **skipped**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:530](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/io/facade/types.ts#L530)

Number of traces skipped (deduplication or format mismatch).
