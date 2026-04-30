# Interface: DecayResult

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:94](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/PersonalityMutationStore.ts#L94)

Result of a decay cycle, reporting how many mutations were weakened
and how many were pruned (deleted) for falling below the threshold.

## Properties

### decayed

> **decayed**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:96](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/PersonalityMutationStore.ts#L96)

Number of mutations whose strength was reduced but still above threshold.

***

### pruned

> **pruned**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:99](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/emergent/PersonalityMutationStore.ts#L99)

Number of mutations deleted for falling at or below the 0.1 threshold.
