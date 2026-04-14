# Interface: AgentMemoryEntry

Defined in: [core/state.ts:78](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L78)

A single memory entry from a agent's persistent memory.

## Properties

### category

> **category**: `string`

Defined in: [core/state.ts:88](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L88)

Category of event that created this memory

***

### content

> **content**: `string`

Defined in: [core/state.ts:84](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L84)

What the agent remembers (1-2 sentences)

***

### salience

> **salience**: `number`

Defined in: [core/state.ts:90](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L90)

Salience score 0-1 (higher = more likely to be recalled in future prompts)

***

### turn

> **turn**: `number`

Defined in: [core/state.ts:80](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L80)

Turn when this memory was formed

***

### valence

> **valence**: `"positive"` \| `"negative"` \| `"neutral"`

Defined in: [core/state.ts:86](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L86)

Emotional valence of the memory

***

### year

> **year**: `number`

Defined in: [core/state.ts:82](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L82)

Simulated year
