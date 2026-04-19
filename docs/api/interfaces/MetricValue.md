# Interface: MetricValue

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:32](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/IEvaluator.ts#L32)

A single metric measurement.

## Properties

### confidence?

> `optional` **confidence**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:44](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/IEvaluator.ts#L44)

Confidence in the measurement (0-1)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:48](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/IEvaluator.ts#L48)

Additional context

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:34](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/IEvaluator.ts#L34)

Metric name

***

### normalized

> **normalized**: `boolean`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:40](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/IEvaluator.ts#L40)

Whether value is normalized (0-1)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:46](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/IEvaluator.ts#L46)

Timestamp

***

### type

> **type**: [`MetricType`](../type-aliases/MetricType.md)

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:36](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/IEvaluator.ts#L36)

Metric type

***

### unit?

> `optional` **unit**: `string`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:42](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/IEvaluator.ts#L42)

Unit of measurement

***

### value

> **value**: `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:38](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/IEvaluator.ts#L38)

Numeric value (0-1 for normalized, raw otherwise)
