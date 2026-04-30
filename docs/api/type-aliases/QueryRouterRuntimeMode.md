# Type Alias: QueryRouterRuntimeMode

> **QueryRouterRuntimeMode** = `"placeholder"` \| `"heuristic"` \| `"active"`

Defined in: [packages/agentos/src/query-router/types.ts:344](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L344)

Runtime mode for a branch that is always available in some form.

- `heuristic` means AgentOS is using its built-in lightweight implementation
- `active` means the host injected or wired a stronger runtime implementation
