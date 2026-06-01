# Interface: EvalComparison

Defined in: [packages/agentos/src/safety/evaluation/IEvaluator.ts:353](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/IEvaluator.ts#L353)

Comparison between two evaluation runs.

## Properties

### metrics

> **metrics**: `object`[]

Defined in: [packages/agentos/src/safety/evaluation/IEvaluator.ts:356](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/IEvaluator.ts#L356)

#### delta

> **delta**: `number`

#### improved

> **improved**: `boolean`

#### name

> **name**: `string`

#### percentChange

> **percentChange**: `number`

#### run1Value

> **run1Value**: `number`

#### run2Value

> **run2Value**: `number`

***

### run1Id

> **run1Id**: `string`

Defined in: [packages/agentos/src/safety/evaluation/IEvaluator.ts:354](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/IEvaluator.ts#L354)

***

### run2Id

> **run2Id**: `string`

Defined in: [packages/agentos/src/safety/evaluation/IEvaluator.ts:355](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/IEvaluator.ts#L355)

***

### summary

> **summary**: `object`

Defined in: [packages/agentos/src/safety/evaluation/IEvaluator.ts:364](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/IEvaluator.ts#L364)

#### improved

> **improved**: `number`

#### regressed

> **regressed**: `number`

#### unchanged

> **unchanged**: `number`
