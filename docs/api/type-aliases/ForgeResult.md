# Type Alias: ForgeResult

> **ForgeResult** = \{ `config`: `BaseAgentConfig`; `ok`: `true`; \} \| \{ `ok`: `false`; `reason`: `string`; `spec`: [`AgentSpec`](../interfaces/AgentSpec.md); \}

Defined in: [packages/agentos/src/cognition/emergent/EmergentAgentForge.ts:41](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/EmergentAgentForge.ts#L41)

Result of a forge call — discriminated success/failure.
