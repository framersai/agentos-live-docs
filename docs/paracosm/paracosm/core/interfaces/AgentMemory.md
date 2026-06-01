# Interface: AgentMemory

Defined in: [apps/paracosm/src/engine/core/state.ts:112](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L112)

Persistent memory state for a agent across simulation turns.

## Properties

### longTerm

> **longTerm**: `string`[]

Defined in: [apps/paracosm/src/engine/core/state.ts:116](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L116)

Consolidated long-term beliefs and relationships (auto-summarized)

***

### relationships

> **relationships**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:120](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L120)

Relationship sentiment toward other agents by ID, -1 to 1

***

### shortTerm

> **shortTerm**: [`AgentMemoryEntry`](AgentMemoryEntry.md)[]

Defined in: [apps/paracosm/src/engine/core/state.ts:114](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L114)

Recent memories (last 3-5 turns, full detail)

***

### stances

> **stances**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:118](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L118)

Stance on recurring themes, -1 to 1 (e.g., "independence": 0.7)
