# Interface: EvalConfig

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:198](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L198)

Configuration for an evaluation run.

## Properties

### concurrency?

> `optional` **concurrency**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:200](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L200)

Maximum concurrent evaluations

***

### continueOnError?

> `optional` **continueOnError**: `boolean`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:206](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L206)

Whether to continue on error

***

### customScorers?

> `optional` **customScorers**: `Record`\<`string`, [`ScorerFunction`](../type-aliases/ScorerFunction.md)\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:213](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L213)

Custom scorers

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:204](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L204)

Number of retries on failure

***

### thresholds?

> `optional` **thresholds**: `object`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:208](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L208)

Scoring thresholds

#### pass?

> `optional` **pass**: `number`

#### warn?

> `optional` **warn**: `number`

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:202](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L202)

Timeout per test case (ms)
