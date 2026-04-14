# Function: sanitizeAgentWorkspaceId()

> **sanitizeAgentWorkspaceId**(`raw`): `string`

Defined in: [packages/agentos/src/marketplace/workspace/AgentWorkspace.ts:25](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/marketplace/workspace/AgentWorkspace.ts#L25)

Sanitize an arbitrary agent identifier into a safe folder name.

- trims whitespace
- replaces slashes with '-'
- collapses non-alphanumerics to '-'
- limits length to 80 chars

## Parameters

### raw

`string`

## Returns

`string`
