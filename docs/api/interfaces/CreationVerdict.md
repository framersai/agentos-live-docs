# Interface: CreationVerdict

Defined in: [packages/agentos/src/emergent/types.ts:247](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L247)

Evaluation verdict produced by the LLM-as-judge after a tool is forged.

The judge runs the tool against its declared test cases and scores it across
five evaluation dimensions. A tool is only registered when `approved` is `true`.

## Properties

### approved

> **approved**: `boolean`

Defined in: [packages/agentos/src/emergent/types.ts:252](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L252)

Whether the judge approves the tool for registration at its initial tier.
`false` means the forge request is rejected and no tool is registered.

***

### bounded

> **bounded**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:286](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L286)

Bounded execution score in the range [0, 1].
Indicates whether the tool reliably completes within its declared
resource limits (memory, time). Scores derived from sandbox telemetry.

***

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:258](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L258)

Overall confidence the judge has in its verdict, in the range [0, 1].
Low confidence may trigger a second judge pass or human review.

***

### correctness

> **correctness**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:272](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L272)

Correctness score in the range [0, 1].
Measures how well the tool's outputs match the expected outputs in the
declared test cases.

***

### determinism

> **determinism**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:279](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L279)

Determinism score in the range [0, 1].
Gauges whether repeated invocations with identical inputs produce
consistent outputs. Lower scores flag non-deterministic behaviour.

***

### reasoning

> **reasoning**: `string`

Defined in: [packages/agentos/src/emergent/types.ts:292](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L292)

Free-text explanation of the verdict, including any failure reasons,
flagged patterns, or suggestions for improvement.

***

### safety

> **safety**: `number`

Defined in: [packages/agentos/src/emergent/types.ts:265](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/types.ts#L265)

Safety score in the range [0, 1].
Assesses whether the tool's implementation could cause unintended harm,
data exfiltration, or resource exhaustion.
