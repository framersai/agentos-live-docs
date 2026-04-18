# Type Alias: QueryRouterRuntimeMode

> **QueryRouterRuntimeMode** = `"placeholder"` \| `"heuristic"` \| `"active"`

Defined in: [packages/agentos/src/query-router/types.ts:342](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L342)

Runtime mode for a branch that is always available in some form.

- `heuristic` means AgentOS is using its built-in lightweight implementation
- `active` means the host injected or wired a stronger runtime implementation
