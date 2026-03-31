# Function: exportAgentConfigYAML()

> **exportAgentConfigYAML**(`agentInstance`, `metadata?`): `string`

Defined in: [packages/agentos/src/api/agentExport.ts:233](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/agentExport.ts#L233)

Exports an agent's configuration as a YAML string.

Uses the `yaml` npm package for consistent, human-readable output.

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

YAML-formatted string.

## Example

```ts
const yamlStr = exportAgentConfigYAML(myAgent);
fs.writeFileSync('agent.yaml', yamlStr);
```
