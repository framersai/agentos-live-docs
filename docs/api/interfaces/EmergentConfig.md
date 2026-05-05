# Interface: EmergentConfig

Defined in: [packages/agentos/src/emergent/types.ts:641](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L641)

Configuration options for the Emergent Capability Engine.

All fields have sensible defaults defined in [DEFAULT\_EMERGENT\_CONFIG](../variables/DEFAULT_EMERGENT_CONFIG.md).
Pass a partial object to override only the fields you need.

## Properties

### allowSandboxTools

> **allowSandboxTools**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:675](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L675)

Whether sandboxed code tools may be forged at all.

When `false`, agents may still create compose-mode tools from existing
registered tools, but any forge request using `implementation.mode:
'sandbox'` is rejected before validation or execution.

This is intentionally disabled by default because sandboxed code carries
higher review and persistence risk than safe-by-construction composition.

#### Default

```ts
false
```

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:647](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L647)

Master switch. When `false`, all forge / promote / execute requests are
rejected immediately with a `"emergent capabilities disabled"` error.

#### Default

```ts
false
```

***

### judgeModel

> **judgeModel**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:731](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L731)

Model ID used by the single LLM judge at forge time ([CreationVerdict](CreationVerdict.md)).
Should be a fast, cost-efficient model — correctness is handled by test cases.

#### Default

```ts
"gpt-4o-mini"
```

***

### maxAgentTools

> **maxAgentTools**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:661](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L661)

Maximum number of agent-scoped emergent tools persisted per agent.
Promotion from `'session'` to `'agent'` is blocked when this limit is reached.

#### Default

```ts
50
```

***

### maxSessionTools

> **maxSessionTools**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:654](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L654)

Maximum number of session-scoped emergent tools an agent may hold at once.
Forge requests beyond this limit are rejected until older tools are evicted.

#### Default

```ts
10
```

***

### persistSandboxSource

> **persistSandboxSource**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:690](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L690)

Whether sandbox source code should be persisted at rest.

When `false`, sandbox tools still run in memory for the active process, but
durable storage only receives redacted metadata instead of raw source code.
This reduces the blast radius of runtime-forged code while preserving audit
visibility and non-source tool metadata.

Persisting raw sandbox source should be an explicit opt-in for trusted
environments that need restart-time rehydration of sandbox tools.

#### Default

```ts
false
```

***

### promotionJudgeModel

> **promotionJudgeModel**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:738](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L738)

Model ID used by both reviewers in the multi-reviewer promotion panel
([PromotionVerdict](PromotionVerdict.md)). Should be a more capable model than `judgeModel`.

#### Default

```ts
"gpt-4o"
```

***

### promotionThreshold

> **promotionThreshold**: `object`

Defined in: [packages/agentos/src/emergent/types.ts:711](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L711)

Thresholds that must be met before a tool is eligible for tier promotion.

#### confidence

> **confidence**: `number`

Minimum aggregate confidence score (from usage stats) before promotion.
In the range [0, 1].

##### Default

```ts
0.8
```

#### uses

> **uses**: `number`

Minimum total invocation count before promotion is considered.

##### Default

```ts
5
```

***

### sandboxMemoryMB

> **sandboxMemoryMB**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:699](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L699)

Nominal memory budget in megabytes for each sandboxed tool execution.
The current node:vm-backed executor reports heap deltas but does not
preemptively enforce this limit.
Passed as `SandboxExecutionRequest.memoryMB`.

#### Default

```ts
128
```

***

### sandboxTimeoutMs

> **sandboxTimeoutMs**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:706](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L706)

Wall-clock timeout in milliseconds for each sandboxed tool execution.
Passed as `SandboxExecutionRequest.timeoutMs`.

#### Default

```ts
5000
```

***

### selfImprovement?

> `optional` **selfImprovement**: [`SelfImprovementConfig`](SelfImprovementConfig.md)

Defined in: [packages/agentos/src/emergent/types.ts:747](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L747)

Self-improvement configuration for bounded autonomous personality mutation,
skill management, workflow composition, and self-evaluation.

When omitted or `undefined`, self-improvement tools are not registered.

#### Default

```ts
undefined (disabled)
```
