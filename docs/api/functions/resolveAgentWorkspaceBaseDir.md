# Function: resolveAgentWorkspaceBaseDir()

> **resolveAgentWorkspaceBaseDir**(): `string`

Defined in: [packages/agentos/src/marketplace/workspace/AgentWorkspace.ts:45](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/marketplace/workspace/AgentWorkspace.ts#L45)

Resolve the base directory used for per-agent workspace folders.

Override via env vars:
- WUNDERLAND_WORKSPACES_DIR (preferred for Wunderland runtimes)
- AGENTOS_WORKSPACES_DIR
- AGENTOS_AGENT_WORKSPACES_DIR

## Returns

`string`
