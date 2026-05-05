# Function: updateOnRetrieval()

> **updateOnRetrieval**(`trace`, `now`): [`RetrievalUpdateResult`](../interfaces/RetrievalUpdateResult.md)

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:68](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/decay/DecayModel.ts#L68)

Update a trace's decay parameters after a successful retrieval.

Implements the **desirable difficulty** effect: memories that were
harder to retrieve (lower current strength) receive a larger stability
boost, making the next retrieval easier and longer-lasting.

Stability growth also accounts for:
- Diminishing returns on repeated retrievals (logarithmic saturation)
- Emotional intensity bonus (emotional memories consolidate faster)

## Parameters

### trace

[`MemoryTrace`](../interfaces/MemoryTrace.md)

### now

`number`

## Returns

[`RetrievalUpdateResult`](../interfaces/RetrievalUpdateResult.md)
