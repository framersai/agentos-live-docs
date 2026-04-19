# Class: EmergentJudge

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:212](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentJudge.ts#L212)

Evaluates forged tools for safety, correctness, and quality using LLM-as-judge.

Three evaluation modes, each scaled to the risk level of the operation:

| Mode | LLM calls | When used |
|---|---|---|
| `reviewCreation` | 1 | Newly forged tool — full code audit + test validation |
| `validateReuse` | 0 | Every invocation — pure programmatic schema check |
| `reviewPromotion` | 2 | Tier promotion — dual-judge safety + correctness panel |

## Example

```ts
const judge = new EmergentJudge({
  judgeModel: 'gpt-4o-mini',
  promotionModel: 'gpt-4o',
  generateText: async (model, prompt) => callLlm(model, prompt),
});

// Creation review
const verdict = await judge.reviewCreation(candidate);
if (verdict.approved) { registry.register(tool, 'session'); }

// Reuse validation (no LLM call)
const reuse = judge.validateReuse('tool-1', output, outputSchema);
if (!reuse.valid) { throw new Error(reuse.schemaErrors.join(', ')); }

// Promotion panel
const promotion = await judge.reviewPromotion(tool);
if (promotion.approved) { registry.promote(tool.id, 'agent'); }
```

## Constructors

### Constructor

> **new EmergentJudge**(`config`): `EmergentJudge`

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:223](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentJudge.ts#L223)

Create a new EmergentJudge instance.

#### Parameters

##### config

[`EmergentJudgeConfig`](../interfaces/EmergentJudgeConfig.md)

Judge configuration specifying models and the LLM callback.
  The `generateText` function is called for creation reviews and promotion
  panels but never for reuse validation (which is purely programmatic).

#### Returns

`EmergentJudge`

## Methods

### reviewCreation()

> **reviewCreation**(`candidate`): `Promise`\<[`CreationVerdict`](../interfaces/CreationVerdict.md)\>

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:250](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentJudge.ts#L250)

Full code + test review for a newly forged tool.

Builds a structured prompt from the candidate's details (name, description,
schemas, source code, sandbox allowlist, test results) and asks the LLM to
evaluate four dimensions: SAFETY, CORRECTNESS, DETERMINISM, BOUNDED.

The tool is approved only if both `safety.passed` AND `correctness.passed`
are `true` in the LLM response.

If the LLM returns malformed JSON that cannot be parsed, a rejected verdict
is returned with confidence 0 and a reasoning string explaining the parse
failure. This prevents bad LLM output from accidentally approving a tool.

#### Parameters

##### candidate

[`ToolCandidate`](../interfaces/ToolCandidate.md)

The tool candidate to evaluate. Must include source code
  and at least one test result.

#### Returns

`Promise`\<[`CreationVerdict`](../interfaces/CreationVerdict.md)\>

A [CreationVerdict](../interfaces/CreationVerdict.md) indicating approval or rejection with
  per-dimension scores and reasoning.

***

### reviewPromotion()

> **reviewPromotion**(`tool`): `Promise`\<[`PromotionVerdict`](../interfaces/PromotionVerdict.md)\>

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:357](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentJudge.ts#L357)

Two-judge panel for tier promotion. Both must approve.

Sends two independent LLM calls in parallel using the promotion model:
1. **Safety auditor**: Reviews the tool's source code and usage history for
   security concerns (data exfiltration, resource exhaustion, API abuse).
2. **Correctness reviewer**: Reviews the tool's source code and all historical
   outputs for correctness issues (schema violations, edge case failures).

Both reviewers must return `approved: true` for the promotion to pass. If
either reviewer's response fails to parse as JSON, the promotion is rejected.

#### Parameters

##### tool

[`EmergentTool`](../interfaces/EmergentTool.md)

The emergent tool to evaluate for promotion. Must have usage
  stats and judge verdicts from prior reviews.

#### Returns

`Promise`\<[`PromotionVerdict`](../interfaces/PromotionVerdict.md)\>

A [PromotionVerdict](../interfaces/PromotionVerdict.md) containing both sub-verdicts and the
  combined approval decision.

***

### validateReuse()

> **validateReuse**(`_toolId`, `output`, `schema`): [`ReuseVerdict`](../interfaces/ReuseVerdict.md)

Defined in: [packages/agentos/src/emergent/EmergentJudge.ts:323](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentJudge.ts#L323)

Pure schema validation on each reuse — no LLM call.

Validates that `output` conforms to the declared `schema` using basic type
checking. This runs on every tool invocation so it must be fast — no LLM
calls, no network I/O, no async operations.

Checks performed:
- If schema declares `type: 'object'`, verify output is a non-null object.
- If schema declares `properties`, verify each declared property key exists
  on the output object.
- If schema declares `required`, verify each required property key exists.
- If schema declares `type: 'string'`, verify output is a string.
- If schema declares `type: 'number'` or `type: 'integer'`, verify output
  is a number.
- If schema declares `type: 'boolean'`, verify output is a boolean.
- If schema declares `type: 'array'`, verify output is an array.

#### Parameters

##### \_toolId

`string`

The ID of the tool being reused (reserved for future
  anomaly detection; currently unused).

##### output

`unknown`

The actual output value produced by the tool invocation.

##### schema

[`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

The tool's declared output JSON Schema.

#### Returns

[`ReuseVerdict`](../interfaces/ReuseVerdict.md)

A [ReuseVerdict](../interfaces/ReuseVerdict.md) with `valid: true` if the output conforms,
  or `valid: false` with a `schemaErrors` array describing each mismatch.
