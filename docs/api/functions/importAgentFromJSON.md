# Function: importAgentFromJSON()

> **importAgentFromJSON**(`json`): `Agent`

Defined in: [packages/agentos/src/api/agentExport.ts:157](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/agentExport.ts#L157)

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
