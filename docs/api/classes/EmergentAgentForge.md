# Class: EmergentAgentForge

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:67](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L67)

Synthesizes BaseAgentConfig instances from manager-supplied specs.

Stateless — safe to share one instance across many agency runs. Validation
happens entirely client-side (no LLM call) so a `forge()` invocation is
cheap and deterministic given the same spec + defaults.

## Constructors

### Constructor

> **new EmergentAgentForge**(`defaults`): `EmergentAgentForge`

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:70](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L70)

#### Parameters

##### defaults

[`ForgeDefaults`](../interfaces/ForgeDefaults.md)

#### Returns

`EmergentAgentForge`

## Methods

### forge()

> **forge**(`spec`, `inheritedConfig?`): `Promise`\<[`ForgeResult`](../type-aliases/ForgeResult.md)\>

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:88](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L88)

Forge a new BaseAgentConfig from the supplied spec.

#### Parameters

##### spec

[`AgentSpec`](../interfaces/AgentSpec.md)

The manager's request: role, instructions, optional model overrides.

##### inheritedConfig?

`Partial`\<`BaseAgentConfig`\> = `{}`

Subset of agency-level config the new agent inherits
  (memory, guardrails, security, etc). Pass through whatever the agency
  wants its synthesised children to share.

#### Returns

`Promise`\<[`ForgeResult`](../type-aliases/ForgeResult.md)\>

A `{ ok: true, config }` or `{ ok: false, reason }` result.
  Never throws — all rejection paths return structured failures so the
  caller can surface them back to the manager as tool errors.
