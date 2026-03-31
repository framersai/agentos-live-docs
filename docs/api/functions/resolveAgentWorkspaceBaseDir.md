# Function: resolveAgentWorkspaceBaseDir()

> **resolveAgentWorkspaceBaseDir**(): `string`

Defined in: [packages/agentos/src/marketplace/workspace/AgentWorkspace.ts:45](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/marketplace/workspace/AgentWorkspace.ts#L45)

Resolve the base directory used for per-agent workspace folders.

Override via env vars:
- WUNDERLAND_WORKSPACES_DIR (preferred for Wunderland runtimes)
- AGENTOS_WORKSPACES_DIR
- AGENTOS_AGENT_WORKSPACES_DIR

## Returns

`string`
