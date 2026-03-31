# Type Alias: ToolTier

> **ToolTier** = `"session"` \| `"agent"` \| `"shared"`

Defined in: [packages/agentos/src/emergent/types.ts:35](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/emergent/types.ts#L35)

Lifecycle scope tier for an emergent tool.

Tools progress through tiers as they prove reliability. Higher tiers require
more stringent promotion verdicts and multi-reviewer sign-off.

- `'session'` — Exists only for the current agent session; discarded on shutdown.
- `'agent'`   — Persisted for the agent that created it; not shared globally.
- `'shared'`  — Promoted to a shared tool registry; available to all agents.
