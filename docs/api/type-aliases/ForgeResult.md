# Type Alias: ForgeResult

> **ForgeResult** = \{ `config`: `BaseAgentConfig`; `ok`: `true`; \} \| \{ `ok`: `false`; `reason`: `string`; `spec`: [`AgentSpec`](../interfaces/AgentSpec.md); \}

Defined in: [packages/agentos/src/emergent/EmergentAgentForge.ts:41](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/EmergentAgentForge.ts#L41)

Result of a forge call — discriminated success/failure.
