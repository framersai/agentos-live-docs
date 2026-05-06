# Interface: AgentMemory

Defined in: [apps/paracosm/src/engine/core/state.ts:107](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L107)

Persistent memory state for a agent across simulation turns.

## Properties

### longTerm

> **longTerm**: `string`[]

Defined in: [apps/paracosm/src/engine/core/state.ts:111](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L111)

Consolidated long-term beliefs and relationships (auto-summarized)

***

### relationships

> **relationships**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:115](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L115)

Relationship sentiment toward other agents by ID, -1 to 1

***

### shortTerm

> **shortTerm**: [`AgentMemoryEntry`](AgentMemoryEntry.md)[]

Defined in: [apps/paracosm/src/engine/core/state.ts:109](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L109)

Recent memories (last 3-5 turns, full detail)

***

### stances

> **stances**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/core/state.ts:113](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L113)

Stance on recurring themes, -1 to 1 (e.g., "independence": 0.7)
