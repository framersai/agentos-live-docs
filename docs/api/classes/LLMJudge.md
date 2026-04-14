# Class: LLMJudge

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:127](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L127)

LLM-based judge for semantic evaluation

## Constructors

### Constructor

> **new LLMJudge**(`config`): `LLMJudge`

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:134](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L134)

#### Parameters

##### config

[`LLMJudgeConfig`](../interfaces/LLMJudgeConfig.md)

#### Returns

`LLMJudge`

## Methods

### batchJudge()

> **batchJudge**(`evaluations`, `criteria?`, `concurrency?`): `Promise`\<[`JudgmentResult`](../interfaces/JudgmentResult.md)[]\>

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:263](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L263)

Batch evaluate multiple outputs

#### Parameters

##### evaluations

`object`[]

##### criteria?

[`JudgeCriteria`](../interfaces/JudgeCriteria.md)[]

##### concurrency?

`number` = `3`

#### Returns

`Promise`\<[`JudgmentResult`](../interfaces/JudgmentResult.md)[]\>

***

### compare()

> **compare**(`input`, `outputA`, `outputB`, `criteria?`): `Promise`\<\{ `reasoning`: `string`; `scoreA`: `number`; `scoreB`: `number`; `winner`: `"A"` \| `"B"` \| `"tie"`; \}\>

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:229](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L229)

Compare two outputs and determine which is better

#### Parameters

##### input

`string`

##### outputA

`string`

##### outputB

`string`

##### criteria?

[`JudgeCriteria`](../interfaces/JudgeCriteria.md)[]

#### Returns

`Promise`\<\{ `reasoning`: `string`; `scoreA`: `number`; `scoreB`: `number`; `winner`: `"A"` \| `"B"` \| `"tie"`; \}\>

***

### createScorer()

> **createScorer**(`criteria?`): [`ScorerFunction`](../type-aliases/ScorerFunction.md)

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:218](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L218)

Create a scorer function for use with Evaluator

#### Parameters

##### criteria?

[`JudgeCriteria`](../interfaces/JudgeCriteria.md)[]

#### Returns

[`ScorerFunction`](../type-aliases/ScorerFunction.md)

***

### judge()

> **judge**(`input`, `actualOutput`, `expectedOutput?`, `criteria?`): `Promise`\<[`JudgmentResult`](../interfaces/JudgmentResult.md)\>

Defined in: [packages/agentos/src/evaluation/LLMJudge.ts:145](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/LLMJudge.ts#L145)

Judge an AI output against criteria

#### Parameters

##### input

`string`

##### actualOutput

`string`

##### expectedOutput?

`string`

##### criteria?

[`JudgeCriteria`](../interfaces/JudgeCriteria.md)[]

#### Returns

`Promise`\<[`JudgmentResult`](../interfaces/JudgmentResult.md)\>
