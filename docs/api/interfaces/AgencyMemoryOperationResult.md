# Interface: AgencyMemoryOperationResult

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:204](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L204)

Result of an agency memory operation.

## Properties

### documentsAffected

> **documentsAffected**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:208](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L208)

Number of documents affected

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:210](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L210)

Error message if failed

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:212](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L212)

Operation metadata

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:206](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgencyTypes.ts#L206)

Whether the operation succeeded
