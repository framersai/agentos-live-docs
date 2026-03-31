# Function: resolveAgentWorkspaceBaseDir()

> **resolveAgentWorkspaceBaseDir**(): `string`

Defined in: [packages/agentos/src/marketplace/workspace/AgentWorkspace.ts:45](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/marketplace/workspace/AgentWorkspace.ts#L45)

Resolve the base directory used for per-agent workspace folders.

Override via env vars:
- WUNDERLAND_WORKSPACES_DIR (preferred for Wunderland runtimes)
- AGENTOS_WORKSPACES_DIR
- AGENTOS_AGENT_WORKSPACES_DIR

## Returns

`string`
