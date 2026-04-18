# Interface: AgentMemory

Defined in: [core/state.ts:99](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L99)

Persistent memory state for a agent across simulation turns.

## Properties

### longTerm

> **longTerm**: `string`[]

Defined in: [core/state.ts:103](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L103)

Consolidated long-term beliefs and relationships (auto-summarized)

***

### relationships

> **relationships**: `Record`\<`string`, `number`\>

Defined in: [core/state.ts:107](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L107)

Relationship sentiment toward other agents by ID, -1 to 1

***

### shortTerm

> **shortTerm**: [`AgentMemoryEntry`](AgentMemoryEntry.md)[]

Defined in: [core/state.ts:101](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L101)

Recent memories (last 3-5 turns, full detail)

***

### stances

> **stances**: `Record`\<`string`, `number`\>

Defined in: [core/state.ts:105](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/core/state.ts#L105)

Stance on recurring themes, -1 to 1 (e.g., "independence": 0.7)
