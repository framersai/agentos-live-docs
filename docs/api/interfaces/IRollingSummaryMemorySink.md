# Interface: IRollingSummaryMemorySink

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:45](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/IRollingSummaryMemorySink.ts#L45)

Implement this interface to capture rolling-summary updates into a durable store.

Implementations should be:
- idempotent (same update may be retried)
- best-effort (failures should not break the core chat loop)

## Methods

### upsertRollingSummaryMemory()

> **upsertRollingSummaryMemory**(`update`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:46](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/core/conversation/IRollingSummaryMemorySink.ts#L46)

#### Parameters

##### update

[`RollingSummaryMemoryUpdate`](RollingSummaryMemoryUpdate.md)

#### Returns

`Promise`\<`void`\>
