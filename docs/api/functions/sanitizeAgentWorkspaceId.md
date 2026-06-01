# Function: sanitizeAgentWorkspaceId()

> **sanitizeAgentWorkspaceId**(`raw`): `string`

Defined in: [packages/agentos/src/cognition/marketplace/workspace/AgentWorkspace.ts:25](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/marketplace/workspace/AgentWorkspace.ts#L25)

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
