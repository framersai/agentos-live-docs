# Function: resolveAgentWorkspaceBaseDir()

> **resolveAgentWorkspaceBaseDir**(): `string`

Defined in: [packages/agentos/src/cognition/marketplace/workspace/AgentWorkspace.ts:45](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/marketplace/workspace/AgentWorkspace.ts#L45)

Resolve the base directory used for per-agent workspace folders.

Override via env vars:
- WUNDERLAND_WORKSPACES_DIR (preferred for Wunderland runtimes)
- AGENTOS_WORKSPACES_DIR
- AGENTOS_AGENT_WORKSPACES_DIR

## Returns

`string`
