# Interface: EvalTestCase

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:54](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L54)

A test case for evaluation.

## Properties

### category?

> `optional` **category**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:60](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L60)

Category or tag

***

### context?

> `optional` **context**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:68](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L68)

Context or system prompt

***

### criteria?

> `optional` **criteria**: [`EvalCriteria`](EvalCriteria.md)[]

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:75](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L75)

Evaluation criteria

***

### expectedOutput?

> `optional` **expectedOutput**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:64](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L64)

Expected output (for comparison)

***

### expectedToolCalls?

> `optional` **expectedToolCalls**: `object`[]

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:70](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L70)

Expected tool calls

#### args?

> `optional` **args**: `Record`\<`string`, `unknown`\>

#### toolName

> **toolName**: `string`

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:56](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L56)

Unique test case ID

***

### input

> **input**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:62](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L62)

Input to the agent

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:77](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L77)

Metadata

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:58](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L58)

Test case name

***

### referenceOutputs?

> `optional` **referenceOutputs**: `string`[]

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:66](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L66)

Reference outputs for similarity comparison
