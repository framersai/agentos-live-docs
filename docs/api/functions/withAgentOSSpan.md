# Function: withAgentOSSpan()

> **withAgentOSSpan**\<`T`\>(`name`, `fn`, `options?`): `Promise`\<`T`\>

Defined in: [packages/agentos/src/evaluation/observability/otel.ts:453](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/evaluation/observability/otel.ts#L453)

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
