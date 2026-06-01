# Interface: ForgeDefaults

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:31](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L31)

Defaults the forge inherits from agency-level config when the spec omits them.

## Properties

### defaultModel

> **defaultModel**: `string`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:33](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L33)

Default model for synthesised agents (typically the agency's model).

***

### defaultProvider

> **defaultProvider**: `string`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:35](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L35)

Default provider for synthesised agents (typically the agency's provider).

***

### maxInstructionsLength?

> `optional` **maxInstructionsLength**: `number`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:37](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L37)

Hard cap on synthesised instructions length to bound token cost. Default: 8192.
