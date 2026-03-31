# Function: withAgentOSSpan()

> **withAgentOSSpan**\<`T`\>(`name`, `fn`, `options?`): `Promise`\<`T`\>

Defined in: [packages/agentos/src/evaluation/observability/otel.ts:453](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/evaluation/observability/otel.ts#L453)

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
