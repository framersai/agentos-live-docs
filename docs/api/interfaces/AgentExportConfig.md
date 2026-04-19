# Interface: AgentExportConfig

Defined in: [packages/agentos/src/api/agentExportCore.ts:18](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/agentExportCore.ts#L18)

Portable agent configuration envelope.

Wraps a `BaseAgentConfig` with version metadata, export timestamp,
and type discriminator so import logic can reconstruct the correct agent
variant (single agent vs. multi-agent agency).

## Properties

### adaptive?

> `optional` **adaptive**: `boolean`

Defined in: [packages/agentos/src/api/agentExportCore.ts:41](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/agentExportCore.ts#L41)

Whether runtime strategy adaptation is enabled.

***

### agents?

> `optional` **agents**: `Record`\<`string`, `BaseAgentConfig`\>

Defined in: [packages/agentos/src/api/agentExportCore.ts:35](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/agentExportCore.ts#L35)

Sub-agent roster keyed by agent name. Present for agency exports.

***

### config

> **config**: `BaseAgentConfig`

Defined in: [packages/agentos/src/api/agentExportCore.ts:32](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/agentExportCore.ts#L32)

The full agent configuration.

***

### exportedAt

> **exportedAt**: `string`

Defined in: [packages/agentos/src/api/agentExportCore.ts:23](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/agentExportCore.ts#L23)

ISO 8601 timestamp of when the export was created.

***

### maxRounds?

> `optional` **maxRounds**: `number`

Defined in: [packages/agentos/src/api/agentExportCore.ts:44](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/agentExportCore.ts#L44)

Maximum orchestration rounds for iterative strategies.

***

### metadata?

> `optional` **metadata**: `object`

Defined in: [packages/agentos/src/api/agentExportCore.ts:47](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/agentExportCore.ts#L47)

Human-readable metadata about the export (name, author, tags, etc.).

#### author?

> `optional` **author**: `string`

#### description?

> `optional` **description**: `string`

#### name?

> `optional` **name**: `string`

#### tags?

> `optional` **tags**: `string`[]

***

### strategy?

> `optional` **strategy**: [`AgencyStrategy`](../type-aliases/AgencyStrategy.md)

Defined in: [packages/agentos/src/api/agentExportCore.ts:38](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/agentExportCore.ts#L38)

Orchestration strategy. Present for agency exports.

***

### type

> **type**: `"agent"` \| `"agency"`

Defined in: [packages/agentos/src/api/agentExportCore.ts:29](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/agentExportCore.ts#L29)

Discriminator: `'agent'` for a single-agent export, `'agency'` for
a multi-agent export that includes a sub-agent roster.

***

### version

> **version**: `"1.0.0"`

Defined in: [packages/agentos/src/api/agentExportCore.ts:20](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/agentExportCore.ts#L20)

Schema version for forward-compatible deserialization.
