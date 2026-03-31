# Type Alias: CostCapType

> **CostCapType** = `"session"` \| `"daily"` \| `"single_operation"`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:8](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/runtime/CostGuard.ts#L8)

## File

CostGuard.ts

## Description

In-process spending caps per agent session/day.
Complements the backend CostService (which handles billing persistence)
by enforcing hard limits that halt execution immediately.
