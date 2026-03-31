# Interface: EmergentConfig

Defined in: [packages/agentos/src/emergent/types.ts:639](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L639)

Configuration options for the Emergent Capability Engine.

All fields have sensible defaults defined in [DEFAULT\_EMERGENT\_CONFIG](../variables/DEFAULT_EMERGENT_CONFIG.md).
Pass a partial object to override only the fields you need.

## Properties

### allowSandboxTools

> **allowSandboxTools**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:673](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L673)

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

Defined in: [packages/agentos/src/emergent/types.ts:645](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L645)

Master switch. When `false`, all forge / promote / execute requests are
rejected immediately with a `"emergent capabilities disabled"` error.

#### Default

```ts
false
```

***

### judgeModel

> **judgeModel**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:727](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L727)

Model ID used by the single LLM judge at forge time ([CreationVerdict](CreationVerdict.md)).
Should be a fast, cost-efficient model — correctness is handled by test cases.

#### Default

```ts
"gpt-4o-mini"
```

***

### maxAgentTools

> **maxAgentTools**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:659](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L659)

Maximum number of agent-scoped emergent tools persisted per agent.
Promotion from `'session'` to `'agent'` is blocked when this limit is reached.

#### Default

```ts
50
```

***

### maxSessionTools

> **maxSessionTools**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:652](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L652)

Maximum number of session-scoped emergent tools an agent may hold at once.
Forge requests beyond this limit are rejected until older tools are evicted.

#### Default

```ts
10
```

***

### persistSandboxSource

> **persistSandboxSource**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:688](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L688)

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

Defined in: [packages/agentos/src/emergent/types.ts:734](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L734)

Model ID used by both reviewers in the multi-reviewer promotion panel
([PromotionVerdict](PromotionVerdict.md)). Should be a more capable model than `judgeModel`.

#### Default

```ts
"gpt-4o"
```

***

### promotionThreshold

> **promotionThreshold**: `object`

Defined in: [packages/agentos/src/emergent/types.ts:707](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L707)

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

Defined in: [packages/agentos/src/emergent/types.ts:695](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L695)

Memory limit in megabytes for each sandboxed tool execution.
Passed as `SandboxExecutionRequest.memoryMB`.

#### Default

```ts
128
```

***

### sandboxTimeoutMs

> **sandboxTimeoutMs**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:702](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L702)

Wall-clock timeout in milliseconds for each sandboxed tool execution.
Passed as `SandboxExecutionRequest.timeoutMs`.

#### Default

```ts
5000
```

***

### selfImprovement?

> `optional` **selfImprovement**: [`SelfImprovementConfig`](SelfImprovementConfig.md)

Defined in: [packages/agentos/src/emergent/types.ts:743](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/emergent/types.ts#L743)

Self-improvement configuration for bounded autonomous personality mutation,
skill management, workflow composition, and self-evaluation.

When omitted or `undefined`, self-improvement tools are not registered.

#### Default

```ts
undefined (disabled)
```
