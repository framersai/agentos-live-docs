# Interface: AgentOSResponseChunk

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:43](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L43)

## Extended by

- [`AgentOSTextDeltaChunk`](AgentOSTextDeltaChunk.md)
- [`AgentOSSystemProgressChunk`](AgentOSSystemProgressChunk.md)
- [`AgentOSToolCallRequestChunk`](AgentOSToolCallRequestChunk.md)
- [`AgentOSToolResultEmissionChunk`](AgentOSToolResultEmissionChunk.md)
- [`AgentOSUICommandChunk`](AgentOSUICommandChunk.md)
- [`AgentOSFinalResponseChunk`](AgentOSFinalResponseChunk.md)
- [`AgentOSErrorChunk`](AgentOSErrorChunk.md)
- [`AgentOSMetadataUpdateChunk`](AgentOSMetadataUpdateChunk.md)
- [`AgentOSWorkflowUpdateChunk`](AgentOSWorkflowUpdateChunk.md)
- [`AgentOSAgencyUpdateChunk`](AgentOSAgencyUpdateChunk.md)
- [`AgentOSProvenanceEventChunk`](AgentOSProvenanceEventChunk.md)

## Properties

### gmiInstanceId

> **gmiInstanceId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:46](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L46)

***

### isFinal

> **isFinal**: `boolean`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:48](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L48)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:50](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L50)

***

### personaId

> **personaId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:47](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L47)

***

### streamId

> **streamId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:45](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L45)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:49](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L49)

***

### type

> **type**: [`AgentOSResponseChunkType`](../enumerations/AgentOSResponseChunkType.md)

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:44](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L44)
