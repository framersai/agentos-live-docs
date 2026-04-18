# Type Alias: ScorerFunction()

> **ScorerFunction** = (`actual`, `expected`, `references`, `metadata?`) => `Promise`\<`number`\> \| `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:219](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/IEvaluator.ts#L219)

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
