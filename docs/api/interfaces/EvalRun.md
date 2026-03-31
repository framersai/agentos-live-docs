# Interface: EvalRun

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:133](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L133)

A complete evaluation run.

## Properties

### agentId?

> `optional` **agentId**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:139](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L139)

Agent or persona being evaluated

***

### aggregateMetrics

> **aggregateMetrics**: [`AggregateMetrics`](AggregateMetrics.md)

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:152](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L152)

Aggregate metrics

***

### completedAt?

> `optional` **completedAt**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:146](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L146)

Timestamp completed

***

### config?

> `optional` **config**: [`EvalConfig`](EvalConfig.md)

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:154](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L154)

Configuration used

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:156](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L156)

Metadata

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:142](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L142)

Model being used

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:137](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L137)

Run name/description

***

### personaId?

> `optional` **personaId**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:140](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L140)

***

### results

> **results**: [`EvalTestResult`](EvalTestResult.md)[]

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:150](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L150)

Individual test results

***

### runId

> **runId**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:135](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L135)

Run ID

***

### startedAt

> **startedAt**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:144](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L144)

Timestamp started

***

### status

> **status**: `"completed"` \| `"failed"` \| `"pending"` \| `"running"`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:148](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L148)

Status
