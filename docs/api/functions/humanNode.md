# Function: humanNode()

> **humanNode**(`config`, `policies?`): [`GraphNode`](../interfaces/GraphNode.md)

Defined in: [packages/agentos/src/orchestration/builders/nodes.ts:88](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/builders/nodes.ts#L88)

Creates a human-in-the-loop node that suspends execution until a human
(or automated surrogate) provides a decision.

## Parameters

### config

Human-node configuration. Includes the human-facing `prompt`,
  optional timeout/auto-resolution behavior, and optional LLM-judge settings.

#### autoAccept?

`boolean`

Auto-accept without human input. Useful for testing/dev.

#### autoReject?

`string` \| `boolean`

Auto-reject without human input.

#### guardrailOverride?

`boolean`

Run guardrails AFTER approval to catch destructive actions.

Even when the node auto-accepts or is approved by an LLM judge,
guardrails can still veto the decision as a safety net. When a
guardrail blocks, the node returns `approved: false` with the
guardrail's reason.

Set to `false` to disable the guardrail safety net for this node.

**Default**

```ts
true
```

#### judge?

\{ `confidenceThreshold?`: `number`; `criteria?`: `string`; `model?`: `string`; `provider?`: `string`; \}

Delegate to LLM judge instead of human.

#### judge.confidenceThreshold?

`number`

#### judge.criteria?

`string`

#### judge.model?

`string`

#### judge.provider?

`string`

#### onTimeout?

`"error"` \| `"accept"` \| `"reject"`

What to do when timeout expires.

**Default**

```ts
'error'
```

#### prompt

`string`

#### timeout?

`number`

### policies?

[`NodePolicies`](../interfaces/NodePolicies.md)

Optional per-node policy overrides.

## Returns

[`GraphNode`](../interfaces/GraphNode.md)
