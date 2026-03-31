# Class: Evaluator

Defined in: [packages/agentos/src/evaluation/Evaluator.ts:206](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/Evaluator.ts#L206)

Agent evaluation framework implementation.

## Implements

- [`IEvaluator`](../interfaces/IEvaluator.md)

## Constructors

### Constructor

> **new Evaluator**(): `Evaluator`

Defined in: [packages/agentos/src/evaluation/Evaluator.ts:210](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/Evaluator.ts#L210)

#### Returns

`Evaluator`

## Methods

### compareRuns()

> **compareRuns**(`runId1`, `runId2`): `Promise`\<[`EvalComparison`](../interfaces/EvalComparison.md)\>

Defined in: [packages/agentos/src/evaluation/Evaluator.ts:392](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/Evaluator.ts#L392)

Compares two evaluation runs.

#### Parameters

##### runId1

`string`

First run ID

##### runId2

`string`

Second run ID

#### Returns

`Promise`\<[`EvalComparison`](../interfaces/EvalComparison.md)\>

Comparison results

#### Implementation of

[`IEvaluator`](../interfaces/IEvaluator.md).[`compareRuns`](../interfaces/IEvaluator.md#compareruns)

***

### evaluateTestCase()

> **evaluateTestCase**(`testCase`, `actualOutput`, `config?`): `Promise`\<[`EvalTestResult`](../interfaces/EvalTestResult.md)\>

Defined in: [packages/agentos/src/evaluation/Evaluator.ts:306](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/Evaluator.ts#L306)

Evaluates a single test case.

#### Parameters

##### testCase

[`EvalTestCase`](../interfaces/EvalTestCase.md)

The test case

##### actualOutput

`string`

The agent's actual output

##### config?

[`EvalConfig`](../interfaces/EvalConfig.md)

Evaluation configuration

#### Returns

`Promise`\<[`EvalTestResult`](../interfaces/EvalTestResult.md)\>

Test result

#### Implementation of

[`IEvaluator`](../interfaces/IEvaluator.md).[`evaluateTestCase`](../interfaces/IEvaluator.md#evaluatetestcase)

***

### generateReport()

> **generateReport**(`runId`, `format`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/evaluation/Evaluator.ts:433](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/Evaluator.ts#L433)

Generates a report for a run.

#### Parameters

##### runId

`string`

Run ID

##### format

Report format

`"json"` | `"markdown"` | `"html"`

#### Returns

`Promise`\<`string`\>

Report content

#### Implementation of

[`IEvaluator`](../interfaces/IEvaluator.md).[`generateReport`](../interfaces/IEvaluator.md#generatereport)

***

### getRun()

> **getRun**(`runId`): `Promise`\<[`EvalRun`](../interfaces/EvalRun.md) \| `undefined`\>

Defined in: [packages/agentos/src/evaluation/Evaluator.ts:382](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/Evaluator.ts#L382)

Gets an evaluation run by ID.

#### Parameters

##### runId

`string`

Run ID

#### Returns

`Promise`\<[`EvalRun`](../interfaces/EvalRun.md) \| `undefined`\>

The evaluation run or undefined

#### Implementation of

[`IEvaluator`](../interfaces/IEvaluator.md).[`getRun`](../interfaces/IEvaluator.md#getrun)

***

### listRuns()

> **listRuns**(`limit?`): `Promise`\<[`EvalRun`](../interfaces/EvalRun.md)[]\>

Defined in: [packages/agentos/src/evaluation/Evaluator.ts:386](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/Evaluator.ts#L386)

Lists recent evaluation runs.

#### Parameters

##### limit?

`number` = `50`

Maximum runs to return

#### Returns

`Promise`\<[`EvalRun`](../interfaces/EvalRun.md)[]\>

Array of runs

#### Implementation of

[`IEvaluator`](../interfaces/IEvaluator.md).[`listRuns`](../interfaces/IEvaluator.md#listruns)

***

### registerScorer()

> **registerScorer**(`name`, `fn`): `void`

Defined in: [packages/agentos/src/evaluation/Evaluator.ts:378](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/Evaluator.ts#L378)

Registers a custom scorer.

#### Parameters

##### name

`string`

Scorer name

##### fn

[`ScorerFunction`](../type-aliases/ScorerFunction.md)

Scoring function

#### Returns

`void`

#### Implementation of

[`IEvaluator`](../interfaces/IEvaluator.md).[`registerScorer`](../interfaces/IEvaluator.md#registerscorer)

***

### runEvaluation()

> **runEvaluation**(`name`, `testCases`, `agentFn`, `config?`): `Promise`\<[`EvalRun`](../interfaces/EvalRun.md)\>

Defined in: [packages/agentos/src/evaluation/Evaluator.ts:220](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/Evaluator.ts#L220)

Runs an evaluation suite against an agent.

#### Parameters

##### name

`string`

Name for this evaluation run

##### testCases

[`EvalTestCase`](../interfaces/EvalTestCase.md)[]

Test cases to evaluate

##### agentFn

(`input`, `context?`) => `Promise`\<`string`\>

Function that takes input and returns agent output

##### config?

[`EvalConfig`](../interfaces/EvalConfig.md)

Evaluation configuration

#### Returns

`Promise`\<[`EvalRun`](../interfaces/EvalRun.md)\>

The completed evaluation run

#### Implementation of

[`IEvaluator`](../interfaces/IEvaluator.md).[`runEvaluation`](../interfaces/IEvaluator.md#runevaluation)

***

### score()

> **score**(`scorer`, `actual`, `expected?`, `references?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/evaluation/Evaluator.ts:365](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/Evaluator.ts#L365)

Scores output using a specific scorer.

#### Parameters

##### scorer

`string`

Scorer name

##### actual

`string`

Actual output

##### expected?

`string`

Expected output

##### references?

`string`[]

Reference outputs

#### Returns

`Promise`\<`number`\>

Score (0-1)

#### Implementation of

[`IEvaluator`](../interfaces/IEvaluator.md).[`score`](../interfaces/IEvaluator.md#score)
