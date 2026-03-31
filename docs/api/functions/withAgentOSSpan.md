# Function: withAgentOSSpan()

> **withAgentOSSpan**\<`T`\>(`name`, `fn`, `options?`): `Promise`\<`T`\>

Defined in: [packages/agentos/src/evaluation/observability/otel.ts:453](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/evaluation/observability/otel.ts#L453)

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
