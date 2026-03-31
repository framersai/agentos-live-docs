# Interface: EvalConfig

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:198](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L198)

Configuration for an evaluation run.

## Properties

### concurrency?

> `optional` **concurrency**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:200](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L200)

Maximum concurrent evaluations

***

### continueOnError?

> `optional` **continueOnError**: `boolean`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:206](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L206)

Whether to continue on error

***

### customScorers?

> `optional` **customScorers**: `Record`\<`string`, [`ScorerFunction`](../type-aliases/ScorerFunction.md)\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:213](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L213)

Custom scorers

***

### retries?

> `optional` **retries**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:204](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L204)

Number of retries on failure

***

### thresholds?

> `optional` **thresholds**: `object`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:208](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L208)

Scoring thresholds

#### pass?

> `optional` **pass**: `number`

#### warn?

> `optional` **warn**: `number`

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:202](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L202)

Timeout per test case (ms)
