# Type Alias: ToolTier

> **ToolTier** = `"session"` \| `"agent"` \| `"shared"`

Defined in: [packages/agentos/src/emergent/types.ts:35](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L35)

Lifecycle scope tier for an emergent tool.

Tools progress through tiers as they prove reliability. Higher tiers require
more stringent promotion verdicts and multi-reviewer sign-off.

- `'session'` — Exists only for the current agent session; discarded on shutdown.
- `'agent'`   — Persisted for the agent that created it; not shared globally.
- `'shared'`  — Promoted to a shared tool registry; available to all agents.
