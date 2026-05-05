# Type Alias: ScorerFunction()

> **ScorerFunction** = (`actual`, `expected`, `references`, `metadata?`) => `Promise`\<`number`\> \| `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:219](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/evaluation/IEvaluator.ts#L219)

Scorer function type.

## Parameters

### actual

`string`

### expected

`string` | `undefined`

### references

`string`[] | `undefined`

### metadata?

`Record`\<`string`, `unknown`\>

## Returns

`Promise`\<`number`\> \| `number`
