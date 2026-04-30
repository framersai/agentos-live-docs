# Function: importAgentFromJSON()

> **importAgentFromJSON**(`json`): `Agent`

Defined in: [packages/agentos/src/api/agentExport.ts:157](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/agentExport.ts#L157)

Imports an agent from a JSON string.

Parses the string and delegates to [importAgent](importAgent.md).

## Parameters

### json

`string`

JSON string containing an [AgentExportConfig](../interfaces/AgentExportConfig.md).

## Returns

`Agent`

A new Agent instance.

## Throws

If the JSON is malformed.

## Throws

If the parsed config fails validation.

## Example

```ts
const agent = importAgentFromJSON(fs.readFileSync('agent.json', 'utf-8'));
```
