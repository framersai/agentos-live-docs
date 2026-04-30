# Interface: AgentMemory

Defined in: [apps/paracosm/src/engine/core/state.ts:99](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L99)

Persistent memory state for a agent across simulation turns.

## Properties

### longTerm

> **longTerm**: `string`[]

Defined in: [apps/paracosm/src/engine/core/state.ts:103](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L103)

Consolidated long-term beliefs and relationships (auto-summarized)

***

### relationships

> **relationships**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:107](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L107)

Relationship sentiment toward other agents by ID, -1 to 1

***

### shortTerm

> **shortTerm**: [`AgentMemoryEntry`](AgentMemoryEntry.md)[]

Defined in: [apps/paracosm/src/engine/core/state.ts:101](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L101)

Recent memories (last 3-5 turns, full detail)

***

### stances

> **stances**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:105](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L105)

Stance on recurring themes, -1 to 1 (e.g., "independence": 0.7)
