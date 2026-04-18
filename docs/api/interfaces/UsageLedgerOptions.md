# Interface: UsageLedgerOptions

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:41](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/utils/usage/UsageLedger.ts#L41)

Options for UsageLedger behavior.

## Properties

### includeInterimStreamingUsage?

> `optional` **includeInterimStreamingUsage**: `boolean`

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:43](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/utils/usage/UsageLedger.ts#L43)

When true, interim streaming usage (non-final chunks) will contribute estimated tokens.

***

### persistenceAdapter?

> `optional` **persistenceAdapter**: [`IUsageLedgerPersistence`](IUsageLedgerPersistence.md)

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/utils/usage/UsageLedger.ts#L47)

Persistence adapter for durability (undefined => in-memory only).

***

### pricingFallbacks?

> `optional` **pricingFallbacks**: `Record`\<`string`, \{ `inputPer1M?`: `number`; `outputPer1M?`: `number`; `totalPer1M?`: `number`; \}\>

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:45](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/core/utils/usage/UsageLedger.ts#L45)

Optional pricing fallback map: modelId -> { inputPer1M, outputPer1M }.
