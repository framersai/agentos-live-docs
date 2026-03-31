# Interface: AgentExportConfig

Defined in: [packages/agentos/src/api/agentExport.ts:49](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L49)

Portable agent configuration envelope.

Wraps a `BaseAgentConfig` with version metadata, export timestamp,
and type discriminator so import logic can reconstruct the correct agent
variant (single agent vs. multi-agent agency).

## Properties

### adaptive?

> `optional` **adaptive**: `boolean`

Defined in: [packages/agentos/src/api/agentExport.ts:74](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L74)

Whether runtime strategy adaptation is enabled.

***

### agents?

> `optional` **agents**: `Record`\<`string`, `BaseAgentConfig`\>

Defined in: [packages/agentos/src/api/agentExport.ts:68](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L68)

Sub-agent roster keyed by agent name. Present for agency exports.

***

### config

> **config**: `BaseAgentConfig`

Defined in: [packages/agentos/src/api/agentExport.ts:63](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L63)

The full agent configuration.

***

### exportedAt

> **exportedAt**: `string`

Defined in: [packages/agentos/src/api/agentExport.ts:54](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L54)

ISO 8601 timestamp of when the export was created.

***

### maxRounds?

> `optional` **maxRounds**: `number`

Defined in: [packages/agentos/src/api/agentExport.ts:77](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L77)

Maximum orchestration rounds for iterative strategies.

***

### metadata?

> `optional` **metadata**: `object`

Defined in: [packages/agentos/src/api/agentExport.ts:82](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L82)

Human-readable metadata about the export (name, author, tags, etc.).

#### author?

> `optional` **author**: `string`

Author identifier (person or system).

#### description?

> `optional` **description**: `string`

Free-text description of what this agent does.

#### name?

> `optional` **name**: `string`

Display name for the exported agent.

#### tags?

> `optional` **tags**: `string`[]

Searchable tags for categorization.

***

### strategy?

> `optional` **strategy**: [`AgencyStrategy`](../type-aliases/AgencyStrategy.md)

Defined in: [packages/agentos/src/api/agentExport.ts:71](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L71)

Orchestration strategy. Present for agency exports.

***

### type

> **type**: `"agent"` \| `"agency"`

Defined in: [packages/agentos/src/api/agentExport.ts:60](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L60)

Discriminator: `'agent'` for a single-agent export, `'agency'` for
a multi-agent export that includes a sub-agent roster.

***

### version

> **version**: `"1.0.0"`

Defined in: [packages/agentos/src/api/agentExport.ts:51](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/agentExport.ts#L51)

Schema version for forward-compatible deserialization.
