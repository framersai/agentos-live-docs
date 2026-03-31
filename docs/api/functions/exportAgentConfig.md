# Function: exportAgentConfig()

> **exportAgentConfig**(`agentInstance`, `metadata?`): [`AgentExportConfig`](../interfaces/AgentExportConfig.md)

Defined in: [packages/agentos/src/api/agentExport.ts:167](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/agentExport.ts#L167)

Exports an agent's configuration as a portable [AgentExportConfig](../interfaces/AgentExportConfig.md) object.

Captures the full `BaseAgentConfig` including model, instructions,
personality, tools, guardrails, memory, RAG, voice, channels, and all
other configuration surfaces. For agency instances, the sub-agent roster,
strategy, and round limits are also included.

## Parameters

### agentInstance

`Agent`

The agent (or agency) instance to export.

### metadata?

Optional human-readable metadata to attach to the export.

#### author?

`string`

Author identifier (person or system).

#### description?

`string`

Free-text description of what this agent does.

#### name?

`string`

Display name for the exported agent.

#### tags?

`string`[]

Searchable tags for categorization.

## Returns

[`AgentExportConfig`](../interfaces/AgentExportConfig.md)

A portable config object that can be serialized to JSON or YAML.

## Example

```ts
const config = exportAgentConfig(myAgent, {
  name: 'Research Assistant',
  author: 'team-alpha',
  tags: ['research', 'summarization'],
});
```
