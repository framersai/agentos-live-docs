# Function: classifyForgeRejection()

> **classifyForgeRejection**(`errorReason`): [`ForgeRejectionCategory`](../type-aliases/ForgeRejectionCategory.md)

Defined in: [packages/agentos/src/cognition/emergent/ForgeRejectionClassifier.ts:157](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/ForgeRejectionClassifier.ts#L157)

Classify a rejection reason string into a [ForgeRejectionCategory](../type-aliases/ForgeRejectionCategory.md).

Case-insensitive substring match against pattern lists, evaluated in
order: schema_extra_field first (most common and most actionable),
then shape_check (local pre-validator), then parse_error, then
judge_correctness, then `other`.

Order matters: "violates the declared output schema by returning an
additional field due to a logic error" matches BOTH schema_extra_field
and judge_correctness; the former wins because it is the more specific
and more actionable signal.

## Parameters

### errorReason

Raw rejection reason text, typically the judge's
  verdict reasoning or the local shape-validator's joined error list.
  May be `undefined` when no reason was captured.

`string` | `undefined`

## Returns

[`ForgeRejectionCategory`](../type-aliases/ForgeRejectionCategory.md)

One of the five category labels. Empty / `undefined` input
  returns `'other'`.
