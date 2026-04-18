# Type Alias: ToolTier

> **ToolTier** = `"session"` \| `"agent"` \| `"shared"`

Defined in: [packages/agentos/src/emergent/types.ts:35](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/types.ts#L35)

Lifecycle scope tier for an emergent tool.

Tools progress through tiers as they prove reliability. Higher tiers require
more stringent promotion verdicts and multi-reviewer sign-off.

- `'session'` — Exists only for the current agent session; discarded on shutdown.
- `'agent'`   — Persisted for the agent that created it; not shared globally.
- `'shared'`  — Promoted to a shared tool registry; available to all agents.
