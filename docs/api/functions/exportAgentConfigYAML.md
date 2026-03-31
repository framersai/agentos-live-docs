# Function: exportAgentConfigYAML()

> **exportAgentConfigYAML**(`agentInstance`, `metadata?`): `string`

Defined in: [packages/agentos/src/api/agentExport.ts:57](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/agentExport.ts#L57)

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
