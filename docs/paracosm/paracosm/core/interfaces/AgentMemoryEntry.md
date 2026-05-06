# Interface: AgentMemoryEntry

Defined in: [apps/paracosm/src/engine/core/state.ts:91](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L91)

A single memory entry from a agent's persistent memory.

## Properties

### category

> **category**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:101](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L101)

Category of event that created this memory

***

### content

> **content**: `string`

Defined in: [apps/paracosm/src/engine/core/state.ts:97](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L97)

What the agent remembers (1-2 sentences)

***

### salience

> **salience**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:103](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L103)

Salience score 0-1 (higher = more likely to be recalled in future prompts)

***

### time

> **time**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:95](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L95)

Simulated time (year/hour/quarter/tick per scenario's timeUnitNoun)

***

### turn

> **turn**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:93](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L93)

Turn when this memory was formed

***

### valence

> **valence**: `"positive"` \| `"negative"` \| `"neutral"`

Defined in: [apps/paracosm/src/engine/core/state.ts:99](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L99)

Emotional valence of the memory
