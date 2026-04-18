# Interface: AggregateMetrics

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:162](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L162)

Aggregate metrics across a run.

## Properties

### avgLatencyMs

> **avgLatencyMs**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:176](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L176)

Average latency ms

***

### avgScore

> **avgScore**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:172](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L172)

Average score (0-1)

***

### byCategory?

> `optional` **byCategory**: `Record`\<`string`, \{ `avgScore`: `number`; `count`: `number`; `passRate`: `number`; \}\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:188](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L188)

Metrics by category

***

### failedTests

> **failedTests**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:168](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L168)

Failed tests

***

### p50LatencyMs

> **p50LatencyMs**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:178](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L178)

P50 latency

***

### p95LatencyMs

> **p95LatencyMs**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:180](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L180)

P95 latency

***

### p99LatencyMs

> **p99LatencyMs**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:182](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L182)

P99 latency

***

### passedTests

> **passedTests**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:166](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L166)

Passed tests

***

### passRate

> **passRate**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:170](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L170)

Pass rate (0-1)

***

### scoreStdDev

> **scoreStdDev**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:174](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L174)

Score standard deviation

***

### totalCostUsd

> **totalCostUsd**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:186](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L186)

Total estimated cost

***

### totalTests

> **totalTests**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:164](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L164)

Total test cases

***

### totalTokens

> **totalTokens**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:184](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L184)

Total tokens used
