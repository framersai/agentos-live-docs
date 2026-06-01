# Interface: AgentMemoryEntry

Defined in: [apps/paracosm/src/engine/core/state.ts:96](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L96)

A single memory entry from a agent's persistent memory.

## Properties

### category

> **category**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:106](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L106)

Category of event that created this memory

***

### content

> **content**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:102](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L102)

What the agent remembers (1-2 sentences)

***

### salience

> **salience**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:108](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L108)

Salience score 0-1 (higher = more likely to be recalled in future prompts)

***

### time

> **time**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:100](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L100)

Simulated time (year/hour/quarter/tick per scenario's timeUnitNoun)

***

### turn

> **turn**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:98](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L98)

Turn when this memory was formed

***

### valence

> **valence**: `"positive"` \| `"negative"` \| `"neutral"`

Defined in: [apps/paracosm/src/engine/core/state.ts:104](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L104)

Emotional valence of the memory
