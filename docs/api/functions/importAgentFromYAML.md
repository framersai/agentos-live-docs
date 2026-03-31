# Function: importAgentFromYAML()

> **importAgentFromYAML**(`yamlStr`): `Agent`

Defined in: [packages/agentos/src/api/agentExport.ts:354](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L354)

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
