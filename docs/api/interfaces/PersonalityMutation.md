# Interface: PersonalityMutation

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:30](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L30)

A single persisted personality mutation record.

Represents a specific HEXACO trait adjustment made by the agent, along with
its current strength (which decays over time) and the reasoning that
motivated the change.

## Properties

### agentId

> **agentId**: `string`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:35](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L35)

The agent that made this mutation.

***

### baselineValue

> **baselineValue**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L47)

The trait value before this mutation was applied.

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:61](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L61)

Unix epoch millisecond timestamp of when this mutation was recorded.

***

### delta

> **delta**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:41](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L41)

The signed delta applied to the trait value. Positive = increase, negative = decrease.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:32](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L32)

Unique mutation identifier (format: `pm_<timestamp>_<random>`).

***

### mutatedValue

> **mutatedValue**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:50](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L50)

The trait value after this mutation was applied.

***

### reasoning

> **reasoning**: `string`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:44](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L44)

Free-text reasoning explaining why the agent chose to mutate this trait.

***

### strength

> **strength**: `number`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:58](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L58)

Current strength of this mutation in the range (0, 1].

Starts at 1.0 when recorded and decays each consolidation cycle.
When strength drops to 0.1 or below, the mutation is pruned.

***

### trait

> **trait**: `string`

Defined in: [packages/agentos/src/emergent/PersonalityMutationStore.ts:38](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/PersonalityMutationStore.ts#L38)

The HEXACO trait that was mutated (e.g., `'openness'`, `'conscientiousness'`).
