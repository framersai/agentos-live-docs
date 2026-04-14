# Type Alias: ScorerFunction()

> **ScorerFunction** = (`actual`, `expected`, `references`, `metadata?`) => `Promise`\<`number`\> \| `number`

Defined in: [packages/agentos/src/evaluation/IEvaluator.ts:219](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/evaluation/IEvaluator.ts#L219)

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
