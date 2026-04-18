# Interface: PromotionVerdict

Defined in: [packages/agentos/src/emergent/types.ts:300](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/types.ts#L300)

Verdict produced by the multi-reviewer panel before a tool is promoted
to a higher [ToolTier](../type-aliases/ToolTier.md).

Requires independent sign-off from a safety auditor and a correctness reviewer.
Both must approve for `approved` to be `true`.

## Properties

### approved

> **approved**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:305](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/types.ts#L305)

Whether both reviewers approved the promotion.
`false` means the tool remains at its current tier.

***

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:337](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/types.ts#L337)

Combined confidence score derived from both reviewer confidences.
Typically the minimum or harmonic mean of the two sub-scores.

***

### correctnessReviewer

> **correctnessReviewer**: `object`

Defined in: [packages/agentos/src/emergent/types.ts:324](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/types.ts#L324)

Correctness review sub-verdict from the correctness-focused reviewer model.
Mirrors the shape of a partial [CreationVerdict](CreationVerdict.md): `{ approved, confidence, reasoning }`.

#### approved

> **approved**: `boolean`

Whether the correctness reviewer approved.

#### confidence

> **confidence**: `number`

Correctness reviewer's confidence in [0, 1].

#### reasoning

> **reasoning**: `string`

Correctness reviewer's reasoning text.

***

### safetyAuditor

> **safetyAuditor**: `object`

Defined in: [packages/agentos/src/emergent/types.ts:311](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/emergent/types.ts#L311)

Safety audit sub-verdict from the safety-focused reviewer model.
Mirrors the shape of a partial [CreationVerdict](CreationVerdict.md): `{ approved, confidence, reasoning }`.

#### approved

> **approved**: `boolean`

Whether the safety auditor approved.

#### confidence

> **confidence**: `number`

Safety auditor's confidence in [0, 1].

#### reasoning

> **reasoning**: `string`

Safety auditor's reasoning text.
