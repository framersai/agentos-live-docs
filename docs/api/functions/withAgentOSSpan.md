# Function: withAgentOSSpan()

> **withAgentOSSpan**\<`T`\>(`name`, `fn`, `options?`): `Promise`\<`T`\>

Defined in: [packages/agentos/src/evaluation/observability/otel.ts:453](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/evaluation/observability/otel.ts#L453)

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
