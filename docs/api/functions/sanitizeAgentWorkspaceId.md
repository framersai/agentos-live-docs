# Function: sanitizeAgentWorkspaceId()

> **sanitizeAgentWorkspaceId**(`raw`): `string`

Defined in: [packages/agentos/src/marketplace/workspace/AgentWorkspace.ts:25](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/marketplace/workspace/AgentWorkspace.ts#L25)

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
