# Interface: AgentMemoryEntry

Defined in: [apps/paracosm/src/engine/core/state.ts:83](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L83)

A single memory entry from a agent's persistent memory.

## Properties

### category

> **category**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:93](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L93)

Category of event that created this memory

***

### content

> **content**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:89](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L89)

What the agent remembers (1-2 sentences)

***

### salience

> **salience**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:95](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L95)

Salience score 0-1 (higher = more likely to be recalled in future prompts)

***

### turn

> **turn**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:85](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L85)

Turn when this memory was formed

***

### valence

> **valence**: `"positive"` \| `"negative"` \| `"neutral"`

Defined in: [apps/paracosm/src/engine/core/state.ts:91](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L91)

Emotional valence of the memory

***

### year

> **year**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:87](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L87)

Simulated year
