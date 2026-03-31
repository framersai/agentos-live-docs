# Interface: AutonomyConfig

Defined in: [packages/agentos/src/provenance/types.ts:126](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/types.ts#L126)

## Properties

### allowConfigEdits

> **allowConfigEdits**: `boolean`

Defined in: [packages/agentos/src/provenance/types.ts:130](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/types.ts#L130)

Whether humans can edit agent configuration after genesis.

***

### allowedHumanActions?

> `optional` **allowedHumanActions**: `string`[]

Defined in: [packages/agentos/src/provenance/types.ts:134](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/types.ts#L134)

Whitelist of specific human actions allowed even in restricted mode.

***

### allowHumanPrompting

> **allowHumanPrompting**: `boolean`

Defined in: [packages/agentos/src/provenance/types.ts:128](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/types.ts#L128)

Whether human prompting is allowed after genesis.

***

### allowToolChanges

> **allowToolChanges**: `boolean`

Defined in: [packages/agentos/src/provenance/types.ts:132](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/types.ts#L132)

Whether humans can add/remove tools after genesis.

***

### genesisEventId?

> `optional` **genesisEventId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:136](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/provenance/types.ts#L136)

Genesis event ID (set automatically on first sealed activation).
