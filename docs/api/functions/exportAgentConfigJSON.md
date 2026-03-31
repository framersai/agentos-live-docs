# Function: exportAgentConfigJSON()

> **exportAgentConfigJSON**(`agentInstance`, `metadata?`): `string`

Defined in: [packages/agentos/src/api/agentExport.ts:211](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L211)

Exports an agent's configuration as a pretty-printed JSON string.

## Parameters

### agentInstance

`Agent`

The agent (or agency) instance to export.

### metadata?

Optional human-readable metadata to attach.

#### author?

`string`

Author identifier (person or system).

#### description?

`string`

Free-text description of what this agent does.

#### name?

`string`

Display name for the exported agent.

#### tags?

`string`[]

Searchable tags for categorization.

## Returns

`string`

JSON string with 2-space indentation.

## Example

```ts
const json = exportAgentConfigJSON(myAgent);
fs.writeFileSync('agent.json', json);
```
