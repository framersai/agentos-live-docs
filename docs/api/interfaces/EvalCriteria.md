# Interface: EvalCriteria

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:83](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L83)

Evaluation criteria for a test case.

## Properties

### description

> **description**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:87](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L87)

Description

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:85](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L85)

Criteria name

***

### scorer

> **scorer**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:91](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L91)

Scoring function name

***

### threshold?

> `optional` **threshold**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:93](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L93)

Minimum passing score

***

### weight

> **weight**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:89](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/IEvaluator.ts#L89)

Weight in final score (0-1)
