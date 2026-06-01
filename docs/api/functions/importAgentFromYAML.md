# Function: importAgentFromYAML()

> **importAgentFromYAML**(`yamlStr`): `Agent`

Defined in: [packages/agentos/src/api/agentExport.ts:178](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agentExport.ts#L178)

Imports an agent from a YAML string.

Parses the string using the `yaml` npm package and delegates to
[importAgent](importAgent.md).

## Parameters

### yamlStr

`string`

YAML string containing an [AgentExportConfig](../interfaces/AgentExportConfig.md).

## Returns

`Agent`

A new Agent instance.

## Throws

If the YAML is malformed or the config fails validation.

## Example

```ts
const agent = importAgentFromYAML(fs.readFileSync('agent.yaml', 'utf-8'));
```
