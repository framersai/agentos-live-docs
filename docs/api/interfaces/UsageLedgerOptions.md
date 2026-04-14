# Interface: UsageLedgerOptions

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:41](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/utils/usage/UsageLedger.ts#L41)

Options for UsageLedger behavior.

## Properties

### includeInterimStreamingUsage?

> `optional` **includeInterimStreamingUsage**: `boolean`

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:43](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/utils/usage/UsageLedger.ts#L43)

When true, interim streaming usage (non-final chunks) will contribute estimated tokens.

***

### persistenceAdapter?

> `optional` **persistenceAdapter**: [`IUsageLedgerPersistence`](IUsageLedgerPersistence.md)

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:47](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/utils/usage/UsageLedger.ts#L47)

Persistence adapter for durability (undefined => in-memory only).

***

### pricingFallbacks?

> `optional` **pricingFallbacks**: `Record`\<`string`, \{ `inputPer1M?`: `number`; `outputPer1M?`: `number`; `totalPer1M?`: `number`; \}\>

Defined in: [packages/agentos/src/core/utils/usage/UsageLedger.ts:45](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/utils/usage/UsageLedger.ts#L45)

Optional pricing fallback map: modelId -> { inputPer1M, outputPer1M }.
