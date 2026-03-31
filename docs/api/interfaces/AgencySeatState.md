# Interface: AgencySeatState

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:15](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L15)

Captures the runtime state of a single seat within an Agency.
A seat represents a role filled by a specific GMI instance.

## Properties

### attachedAt

> **attachedAt**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:23](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L23)

ISO timestamp when GMI was attached to this seat

***

### gmiInstanceId

> **gmiInstanceId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:19](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L19)

GMI instance currently filling this seat

***

### history?

> `optional` **history**: [`AgencySeatHistoryEntry`](AgencySeatHistoryEntry.md)[]

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:27](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L27)

Historical record of seat activity

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:25](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L25)

Custom metadata for this seat

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:21](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L21)

Persona configuration for this seat

***

### roleId

> **roleId**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:17](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L17)

Unique role identifier within the agency
