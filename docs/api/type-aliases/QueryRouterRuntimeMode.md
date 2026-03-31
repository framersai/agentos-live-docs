# Type Alias: QueryRouterRuntimeMode

> **QueryRouterRuntimeMode** = `"placeholder"` \| `"heuristic"` \| `"active"`

Defined in: [packages/agentos/src/query-router/types.ts:336](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L336)

Runtime mode for a branch that is always available in some form.

- `heuristic` means AgentOS is using its built-in lightweight implementation
- `active` means the host injected or wired a stronger runtime implementation
