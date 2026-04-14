# Interface: ToolOrchestratorHITLConfig

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:34](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/config/ToolOrchestratorConfig.ts#L34)

## Properties

### approvalTimeoutMs?

> `optional` **approvalTimeoutMs**: `number`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:53](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/config/ToolOrchestratorConfig.ts#L53)

Optional per-approval timeout (ms). If omitted, the HITL manager's default timeout is used.

***

### autoApproveWhenNoManager?

> `optional` **autoApproveWhenNoManager**: `boolean`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:58](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/config/ToolOrchestratorConfig.ts#L58)

If true, ToolOrchestrator will execute side-effect tools even if no HITL manager was provided.
Default: false.

***

### defaultSideEffectsSeverity?

> `optional` **defaultSideEffectsSeverity**: `"critical"` \| `"low"` \| `"medium"` \| `"high"`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:49](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/config/ToolOrchestratorConfig.ts#L49)

Default severity for side-effect tool approvals.
Default: 'high'.

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:39](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/config/ToolOrchestratorConfig.ts#L39)

Enable HITL gating inside the ToolOrchestrator.
Default: false.

***

### requireApprovalForSideEffects?

> `optional` **requireApprovalForSideEffects**: `boolean`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:44](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/core/config/ToolOrchestratorConfig.ts#L44)

If true, tools with `tool.hasSideEffects === true` require an approval before execution.
Default: true (when HITL is enabled).
