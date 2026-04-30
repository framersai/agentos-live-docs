# Function: exportAgentConfigYAML()

> **exportAgentConfigYAML**(`agentInstance`, `metadata?`): `string`

Defined in: [packages/agentos/src/api/agentExport.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/agentExport.ts#L57)

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

#### description?

`string`

#### name?

`string`

#### tags?

`string`[]

## Returns

`string`

YAML-formatted string.

## Example

```ts
const yamlStr = exportAgentConfigYAML(myAgent);
fs.writeFileSync('agent.yaml', yamlStr);
```
