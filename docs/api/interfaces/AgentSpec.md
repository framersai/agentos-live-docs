# Interface: AgentSpec

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:17](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L17)

Minimum spec the manager must supply when calling `spawn_specialist`.

## Properties

### instructions

> **instructions**: `string`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:21](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L21)

System instructions for the new agent.

***

### justification?

> `optional` **justification**: `string`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:27](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L27)

Optional justification (required when `EmergentPlannerConfig.requireJustification` is true).

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:23](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L23)

Optional override of the agency-level model.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:25](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L25)

Optional override of the agency-level provider.

***

### role

> **role**: `string`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:19](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L19)

Identifier for the new agent — becomes part of `delegate_to_<role>`.
