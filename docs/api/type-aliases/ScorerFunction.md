# Type Alias: ScorerFunction()

> **ScorerFunction** = (`actual`, `expected`, `references`, `metadata?`) => `Promise`\<`number`\> \| `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:219](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/IEvaluator.ts#L219)

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
