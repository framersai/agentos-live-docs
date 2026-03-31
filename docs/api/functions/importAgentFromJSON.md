# Function: importAgentFromJSON()

> **importAgentFromJSON**(`json`): `Agent`

Defined in: [packages/agentos/src/api/agentExport.ts:333](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/agentExport.ts#L333)

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
