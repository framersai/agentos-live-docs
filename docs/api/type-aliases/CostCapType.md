# Type Alias: CostCapType

> **CostCapType** = `"session"` \| `"daily"` \| `"single_operation"`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:8](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/CostGuard.ts#L8)

## File

CostGuard.ts

## Description

In-process spending caps per agent session/day.
Complements the backend CostService (which handles billing persistence)
by enforcing hard limits that halt execution immediately.
