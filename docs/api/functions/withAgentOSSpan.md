# Function: withAgentOSSpan()

> **withAgentOSSpan**\<`T`\>(`name`, `fn`, `options?`): `Promise`\<`T`\>

Defined in: [packages/agentos/src/safety/evaluation/observability/otel.ts:453](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/evaluation/observability/otel.ts#L453)

## Type Parameters

### T

`T`

## Parameters

### name

`string`

### fn

(`span`) => `Promise`\<`T`\>

### options?

#### attributes?

`Attributes`

#### kind?

`SpanKind`

## Returns

`Promise`\<`T`\>
