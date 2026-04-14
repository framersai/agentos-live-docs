# Interface: InterferenceResult

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:107](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/decay/DecayModel.ts#L107)

## Properties

### proactiveReduction

> **proactiveReduction**: `number`

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:111](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/decay/DecayModel.ts#L111)

Amount to reduce new trace's strength by (proactive).

***

### retroactiveVictims

> **retroactiveVictims**: [`InterferenceVictim`](InterferenceVictim.md)[]

Defined in: [packages/agentos/src/memory/core/decay/DecayModel.ts:109](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/core/decay/DecayModel.ts#L109)

Existing traces whose strength should be reduced (retroactive).
