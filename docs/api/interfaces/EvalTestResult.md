# Interface: EvalTestResult

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:99](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L99)

Result of a single test case evaluation.

## Properties

### actualOutput

> **actualOutput**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:111](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L111)

Actual agent output

***

### costUsd?

> `optional` **costUsd**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:123](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L123)

Estimated cost

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:125](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L125)

Error if any

***

### expectedOutput?

> `optional` **expectedOutput**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:113](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L113)

Expected output

***

### latencyMs

> **latencyMs**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:115](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L115)

Latency in ms

***

### metrics

> **metrics**: [`MetricValue`](MetricValue.md)[]

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:109](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L109)

Individual metric scores

***

### passed

> **passed**: `boolean`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:105](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L105)

Whether the test passed

***

### score

> **score**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:107](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L107)

Overall score (0-1)

***

### testCaseId

> **testCaseId**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:101](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L101)

Test case ID

***

### testCaseName

> **testCaseName**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:103](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L103)

Test case name

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:127](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L127)

Timestamp

***

### tokenUsage?

> `optional` **tokenUsage**: `object`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:117](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/evaluation/IEvaluator.ts#L117)

Token usage

#### completionTokens

> **completionTokens**: `number`

#### promptTokens

> **promptTokens**: `number`

#### totalTokens

> **totalTokens**: `number`
