# Type Alias: ScorerFunction()

> **ScorerFunction** = (`actual`, `expected`, `references`, `metadata?`) => `Promise`\<`number`\> \| `number`

Defined in: [packages/agentos/src/safety/evaluation/IEvaluator.ts:219](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/IEvaluator.ts#L219)

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
