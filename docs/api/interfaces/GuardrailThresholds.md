# Interface: GuardrailThresholds

Defined in: [packages/agentos/src/orchestration/planning/types.ts:26](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/planning/types.ts#L26)

Configurable thresholds for guardrailed autonomy mode.

## Properties

### costPerExpansionCap

> **costPerExpansionCap**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:38](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/planning/types.ts#L38)

Maximum cost per single expansion operation.

***

### maxAgentCount

> **maxAgentCount**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:30](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/planning/types.ts#L30)

Maximum concurrent agent count.

***

### maxDepth

> **maxDepth**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:36](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/planning/types.ts#L36)

Maximum sub-mission nesting depth.

***

### maxExpansions

> **maxExpansions**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:34](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/planning/types.ts#L34)

Maximum graph expansion operations.

***

### maxToolForges

> **maxToolForges**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:32](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/planning/types.ts#L32)

Maximum emergent tool forge operations.

***

### maxTotalCost

> **maxTotalCost**: `number`

Defined in: [packages/agentos/src/orchestration/planning/types.ts:28](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/planning/types.ts#L28)

Maximum total spend in USD before pausing.
