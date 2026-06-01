# Interface: EmergentTool

Defined in: [packages/agentos/src/cognition/emergent/types.ts:432](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L432)

A tool created at runtime by the Emergent Capability Engine.

`EmergentTool` is the persisted record that backs a forged tool. It carries
the tool's identity, schemas, implementation spec, current tier, audit trail,
and accumulated usage statistics.

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:484](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L484)

ISO-8601 timestamp of when the tool was first forged and registered.

***

### createdBy

> **createdBy**: `string`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:479](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L479)

Identifier of the entity (agent ID or `'system'`) that created this tool.

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:450](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L450)

Natural language description of what the tool does and when to use it.
Injected into the LLM prompt as the tool's description field.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:437](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L437)

Globally unique identifier assigned at forge time.
Convention: `emergent:<uuid-v4>` (e.g., `"emergent:a1b2c3d4-..."`).

***

### implementation

> **implementation**: [`ToolImplementation`](../type-aliases/ToolImplementation.md)

Defined in: [packages/agentos/src/cognition/emergent/types.ts:468](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L468)

The implementation specification — either a composable pipeline or
sandboxed code. Determines how the executor runs the tool.

***

### inputSchema

> **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/cognition/emergent/types.ts:456](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L456)

JSON Schema defining the structure of arguments the tool accepts.
Validated by the executor before each invocation.

***

### judgeVerdicts

> **judgeVerdicts**: ([`CreationVerdict`](CreationVerdict.md) \| [`PromotionVerdict`](PromotionVerdict.md))[]

Defined in: [packages/agentos/src/cognition/emergent/types.ts:491](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L491)

Ordered log of all judge verdicts issued for this tool, from initial
creation through any subsequent promotion reviews.
The most recent verdict is the last element.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:444](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L444)

Machine-readable tool name exposed to the LLM in tool call requests.
Must be unique among tools currently registered for the agent.

#### Example

```ts
"fetch_github_pr_summary"
```

***

### outputSchema

> **outputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/cognition/emergent/types.ts:462](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L462)

JSON Schema defining the structure of the tool's output on success.
Used by downstream tools and the judge for output validation.

***

### source

> **source**: `string`

Defined in: [packages/agentos/src/cognition/emergent/types.ts:503](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L503)

Human-readable label describing the origin of this tool for audit purposes.

#### Example

```ts
"forged by agent gmi-42 during session sess-99"
```

***

### tier

> **tier**: [`ToolTier`](../type-aliases/ToolTier.md)

Defined in: [packages/agentos/src/cognition/emergent/types.ts:474](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L474)

Current lifecycle tier. Tools start at `'session'` and may be promoted
to `'agent'` and then `'shared'` as they accumulate usage and pass audits.

***

### usageStats

> **usageStats**: [`ToolUsageStats`](ToolUsageStats.md)

Defined in: [packages/agentos/src/cognition/emergent/types.ts:497](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/types.ts#L497)

Accumulated runtime usage statistics.
Updated after every invocation by the usage tracking subsystem.
