# Interface: ForgeDefaults

Defined in: [packages/agentos/src/emergent/EmergentAgentForge.ts:31](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/EmergentAgentForge.ts#L31)

Defaults the forge inherits from agency-level config when the spec omits them.

## Properties

### defaultModel

> **defaultModel**: `string`

Defined in: [packages/agentos/src/emergent/EmergentAgentForge.ts:33](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/EmergentAgentForge.ts#L33)

Default model for synthesised agents (typically the agency's model).

***

### defaultProvider

> **defaultProvider**: `string`

Defined in: [packages/agentos/src/emergent/EmergentAgentForge.ts:35](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/EmergentAgentForge.ts#L35)

Default provider for synthesised agents (typically the agency's provider).

***

### maxInstructionsLength?

> `optional` **maxInstructionsLength**: `number`

Defined in: [packages/agentos/src/emergent/EmergentAgentForge.ts:37](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/EmergentAgentForge.ts#L37)

Hard cap on synthesised instructions length to bound token cost. Default: 8192.
