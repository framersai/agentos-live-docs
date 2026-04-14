# Type Alias: QueryRouterRuntimeMode

> **QueryRouterRuntimeMode** = `"placeholder"` \| `"heuristic"` \| `"active"`

Defined in: [packages/agentos/src/query-router/types.ts:342](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L342)

Runtime mode for a branch that is always available in some form.

- `heuristic` means AgentOS is using its built-in lightweight implementation
- `active` means the host injected or wired a stronger runtime implementation
