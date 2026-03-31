# Interface: IEvaluator

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:268](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L268)

Interface for the agent evaluator.

## Example

```typescript
const evaluator = new Evaluator();

// Create test suite
const testCases: EvalTestCase[] = [
  {
    id: 'greet-1',
    name: 'Basic greeting',
    input: 'Hello!',
    expectedOutput: 'Hello! How can I help you today?',
    criteria: [
      { name: 'relevance', description: 'Is greeting appropriate', weight: 0.5, scorer: 'llm_judge' },
      { name: 'politeness', description: 'Is response polite', weight: 0.5, scorer: 'contains' },
    ],
  },
];

// Run evaluation
const run = await evaluator.runEvaluation('greeting-test', testCases, agentFn);
console.log(`Pass rate: ${run.aggregateMetrics.passRate * 100}%`);
```

## Methods

### compareRuns()

> **compareRuns**(`runId1`, `runId2`): `Promise`\<[`EvalComparison`](EvalComparison.md)\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:339](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L339)

Compares two evaluation runs.

#### Parameters

##### runId1

`string`

First run ID

##### runId2

`string`

Second run ID

#### Returns

`Promise`\<[`EvalComparison`](EvalComparison.md)\>

Comparison results

***

### evaluateTestCase()

> **evaluateTestCase**(`testCase`, `actualOutput`, `config?`): `Promise`\<[`EvalTestResult`](EvalTestResult.md)\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:291](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L291)

Evaluates a single test case.

#### Parameters

##### testCase

[`EvalTestCase`](EvalTestCase.md)

The test case

##### actualOutput

`string`

The agent's actual output

##### config?

[`EvalConfig`](EvalConfig.md)

Evaluation configuration

#### Returns

`Promise`\<[`EvalTestResult`](EvalTestResult.md)\>

Test result

***

### generateReport()

> **generateReport**(`runId`, `format`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:347](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L347)

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

***

### getRun()

> **getRun**(`runId`): `Promise`\<[`EvalRun`](EvalRun.md) \| `undefined`\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:324](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L324)

Gets an evaluation run by ID.

#### Parameters

##### runId

`string`

Run ID

#### Returns

`Promise`\<[`EvalRun`](EvalRun.md) \| `undefined`\>

The evaluation run or undefined

***

### listRuns()

> **listRuns**(`limit?`): `Promise`\<[`EvalRun`](EvalRun.md)[]\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:331](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L331)

Lists recent evaluation runs.

#### Parameters

##### limit?

`number`

Maximum runs to return

#### Returns

`Promise`\<[`EvalRun`](EvalRun.md)[]\>

Array of runs

***

### registerScorer()

> **registerScorer**(`name`, `fn`): `void`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:317](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L317)

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

***

### runEvaluation()

> **runEvaluation**(`name`, `testCases`, `agentFn`, `config?`): `Promise`\<[`EvalRun`](EvalRun.md)\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:277](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L277)

Runs an evaluation suite against an agent.

#### Parameters

##### name

`string`

Name for this evaluation run

##### testCases

[`EvalTestCase`](EvalTestCase.md)[]

Test cases to evaluate

##### agentFn

(`input`, `context?`) => `Promise`\<`string`\>

Function that takes input and returns agent output

##### config?

[`EvalConfig`](EvalConfig.md)

Evaluation configuration

#### Returns

`Promise`\<[`EvalRun`](EvalRun.md)\>

The completed evaluation run

***

### score()

> **score**(`scorer`, `actual`, `expected?`, `references?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:305](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L305)

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
