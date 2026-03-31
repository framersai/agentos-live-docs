# Interface: DecayResult

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:94](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/PersonalityMutationStore.ts#L94)

Result of a decay cycle, reporting how many mutations were weakened
and how many were pruned (deleted) for falling below the threshold.

## Properties

### decayed

> **decayed**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:96](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/PersonalityMutationStore.ts#L96)

Number of mutations whose strength was reduced but still above threshold.

***

### pruned

> **pruned**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:99](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/PersonalityMutationStore.ts#L99)

Number of mutations deleted for falling at or below the 0.1 threshold.
