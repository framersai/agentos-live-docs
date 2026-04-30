# Interface: ImportResult

Defined in: [packages/agentos/src/memory/io/facade/types.ts:529](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L529)

Summary of a completed import operation returned by `Memory.import()`.

## Properties

### errors

> **errors**: `string`[]

Defined in: [packages/agentos/src/memory/io/facade/types.ts:543](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L543)

Human-readable error messages for any traces that failed to import.

***

### imported

> **imported**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:533](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L533)

Number of traces successfully imported and written to the store.

***

### skipped

> **skipped**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:538](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L538)

Number of traces skipped (deduplication or format mismatch).
