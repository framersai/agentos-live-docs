# Interface: InterferenceResult

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:107](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/decay/DecayModel.ts#L107)

## Properties

### proactiveReduction

> **proactiveReduction**: `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:111](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/decay/DecayModel.ts#L111)

Amount to reduce new trace's strength by (proactive).

***

### retroactiveVictims

> **retroactiveVictims**: [`InterferenceVictim`](InterferenceVictim.md)[]

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:109](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/core/decay/DecayModel.ts#L109)

Existing traces whose strength should be reduced (retroactive).
