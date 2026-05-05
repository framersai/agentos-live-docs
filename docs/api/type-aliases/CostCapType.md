# Type Alias: CostCapType

> **CostCapType** = `"session"` \| `"daily"` \| `"single_operation"`

Defined in: [packages/agentos/src/safety/runtime/CostGuard.ts:8](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/safety/runtime/CostGuard.ts#L8)

## File

CostGuard.ts

## Description

In-process spending caps per agent session/day.
Complements the backend CostService (which handles billing persistence)
by enforcing hard limits that halt execution immediately.
