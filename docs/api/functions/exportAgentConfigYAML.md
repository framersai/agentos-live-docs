# Function: exportAgentConfigYAML()

> **exportAgentConfigYAML**(`agentInstance`, `metadata?`): `string`

Defined in: [packages/agentos/src/api/agentExport.ts:57](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agentExport.ts#L57)

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
