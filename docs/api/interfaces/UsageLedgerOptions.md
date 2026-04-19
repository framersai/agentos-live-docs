# Interface: UsageLedgerOptions

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:54](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/utils/usage/UsageLedger.ts#L54)

Options for UsageLedger behavior.

## Properties

### includeInterimStreamingUsage?

> `optional` **includeInterimStreamingUsage**: `boolean`

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:56](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/utils/usage/UsageLedger.ts#L56)

When true, interim streaming usage (non-final chunks) will contribute estimated tokens.

***

### persistenceAdapter?

> `optional` **persistenceAdapter**: [`IUsageLedgerPersistence`](IUsageLedgerPersistence.md)

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:60](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/utils/usage/UsageLedger.ts#L60)

Persistence adapter for durability (undefined => in-memory only).

***

### pricingFallbacks?

> `optional` **pricingFallbacks**: `Record`\<`string`, \{ `inputPer1M?`: `number`; `outputPer1M?`: `number`; `totalPer1M?`: `number`; \}\>

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:58](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/utils/usage/UsageLedger.ts#L58)

Optional pricing fallback map: modelId -> { inputPer1M, outputPer1M }.
