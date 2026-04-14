# Interface: AgentMemory

Defined in: [core/state.ts:94](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L94)

Persistent memory state for a agent across simulation turns.

## Properties

### longTerm

> **longTerm**: `string`[]

Defined in: [core/state.ts:98](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L98)

Consolidated long-term beliefs and relationships (auto-summarized)

***

### relationships

> **relationships**: `Record`\<`string`, `number`\>

Defined in: [core/state.ts:102](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L102)

Relationship sentiment toward other agents by ID, -1 to 1

***

### shortTerm

> **shortTerm**: [`AgentMemoryEntry`](AgentMemoryEntry.md)[]

Defined in: [core/state.ts:96](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L96)

Recent memories (last 3-5 turns, full detail)

***

### stances

> **stances**: `Record`\<`string`, `number`\>

Defined in: [core/state.ts:100](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/core/state.ts#L100)

Stance on recurring themes, -1 to 1 (e.g., "independence": 0.7)
