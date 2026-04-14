# Interface: IRollingSummaryMemorySink

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:45](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/IRollingSummaryMemorySink.ts#L45)

Implement this interface to capture rolling-summary updates into a durable store.

Implementations should be:
- idempotent (same update may be retried)
- best-effort (failures should not break the core chat loop)

## Methods

### upsertRollingSummaryMemory()

> **upsertRollingSummaryMemory**(`update`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/conversation/IRollingSummaryMemorySink.ts:46](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/conversation/IRollingSummaryMemorySink.ts#L46)

#### Parameters

##### update

[`RollingSummaryMemoryUpdate`](RollingSummaryMemoryUpdate.md)

#### Returns

`Promise`\<`void`\>
