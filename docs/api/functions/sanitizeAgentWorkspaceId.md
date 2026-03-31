# Function: sanitizeAgentWorkspaceId()

> **sanitizeAgentWorkspaceId**(`raw`): `string`

Defined in: [packages/agentos/src/marketplace/workspace/AgentWorkspace.ts:25](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/marketplace/workspace/AgentWorkspace.ts#L25)

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
