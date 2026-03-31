# Function: importAgent()

> **importAgent**(`exportConfig`): `Agent`

Defined in: [packages/agentos/src/api/agentExport.ts:266](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/agentExport.ts#L266)

Imports an agent from an [AgentExportConfig](../interfaces/AgentExportConfig.md) object.

For `type: 'agent'`, calls the `agent()` factory with the stored config.
For `type: 'agency'`, calls the `agency()` factory with the stored config
plus the sub-agent roster and strategy.

The imported agent is a fully functional instance with `generate`, `stream`,
`session`, and `close` methods.

## Parameters

### exportConfig

[`AgentExportConfig`](../interfaces/AgentExportConfig.md)

A validated export config object.

## Returns

`Agent`

A new Agent instance constructed from the config.

## Throws

If the config is invalid or missing required fields.

## Example

```ts
const config = JSON.parse(fs.readFileSync('agent.json', 'utf-8'));
const agent = importAgent(config);
const reply = await agent.generate('Hello!');
```
