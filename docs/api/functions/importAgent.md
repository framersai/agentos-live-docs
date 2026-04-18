# Function: importAgent()

> **importAgent**(`exportConfig`): `Agent`

Defined in: [packages/agentos/src/api/agentExport.ts:90](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/agentExport.ts#L90)

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
