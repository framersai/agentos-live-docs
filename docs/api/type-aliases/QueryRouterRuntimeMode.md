# Type Alias: QueryRouterRuntimeMode

> **QueryRouterRuntimeMode** = `"placeholder"` \| `"heuristic"` \| `"active"`

Defined in: [packages/agentos/src/query-router/types.ts:342](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/query-router/types.ts#L342)

Runtime mode for a branch that is always available in some form.

- `heuristic` means AgentOS is using its built-in lightweight implementation
- `active` means the host injected or wired a stronger runtime implementation
