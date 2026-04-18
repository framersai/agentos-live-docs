# Interface: DecayResult

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:94](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L94)

Result of a decay cycle, reporting how many mutations were weakened
and how many were pruned (deleted) for falling below the threshold.

## Properties

### decayed

> **decayed**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:96](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L96)

Number of mutations whose strength was reduced but still above threshold.

***

### pruned

> **pruned**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:99](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L99)

Number of mutations deleted for falling at or below the 0.1 threshold.
