# Function: humanNode()

> **humanNode**(`config`, `policies?`): [`GraphNode`](../interfaces/GraphNode.md)

Defined in: [packages/agentos/src/orchestration/builders/nodes.ts:93](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/builders/nodes.ts#L93)

Creates a human-in-the-loop node that suspends execution until a human
(or automated surrogate) provides a decision.

## Parameters

### config

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

Message displayed to the human operator.

#### timeout?

`number`

Maximum wall-clock milliseconds before the node is aborted or handled by `onTimeout`.

### policies?

[`NodePolicies`](../interfaces/NodePolicies.md)

Optional per-node policy overrides.

## Returns

[`GraphNode`](../interfaces/GraphNode.md)
