# Function: resolveAgentWorkspaceBaseDir()

> **resolveAgentWorkspaceBaseDir**(): `string`

Defined in: [packages/agentos/src/marketplace/workspace/AgentWorkspace.ts:45](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/marketplace/workspace/AgentWorkspace.ts#L45)

Resolve the base directory used for per-agent workspace folders.

Override via env vars:
- WUNDERLAND_WORKSPACES_DIR (preferred for Wunderland runtimes)
- AGENTOS_WORKSPACES_DIR
- AGENTOS_AGENT_WORKSPACES_DIR

## Returns

`string`
