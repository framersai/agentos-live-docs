# Interface: GenerateObjectOptions\<T\>

Defined in: [packages/agentos/src/api/generateObject.ts:84](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L84)

Options for a [generateObject](../functions/generateObject.md) call.

At minimum, `schema` and either `prompt` or `messages` must be supplied.
Provider/model resolution follows the same rules as [generateText](../functions/generateText.md).

## Example

```ts
const opts: GenerateObjectOptions<typeof mySchema> = {
  schema: z.object({ name: z.string(), age: z.number() }),
  prompt: 'Extract: "John is 30 years old"',
};
```

## Type Parameters

### T

`T` *extends* `ZodType`

The Zod schema type that defines the expected output shape.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:154](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L154)

Override the API key instead of reading from environment variables.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:157](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L157)

Override the provider base URL (useful for local proxies or Ollama).

***

### fallbackProviders?

> `optional` **fallbackProviders**: [`FallbackProviderEntry`](FallbackProviderEntry.md)[]

Defined in: [packages/agentos/src/api/generateObject.ts:164](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L164)

Ordered fallback providers tried when the primary fails with a retryable
error. When undefined, auto-built from env keys. Pass `[]` to disable.

#### See

import('./generateText.js').GenerateTextOptions.fallbackProviders

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/agentos/src/api/generateObject.ts:151](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L151)

Number of times to retry when JSON parsing or Zod validation fails.
Each retry appends the error details to the conversation so the model
can self-correct.

#### Default

```ts
2
```

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/api/generateObject.ts:142](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L142)

Hard cap on output tokens.

***

### messages?

> `optional` **messages**: [`Message`](Message.md)[]

Defined in: [packages/agentos/src/api/generateObject.ts:136](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L136)

Full conversation history.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:98](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L98)

Model identifier. Accepts `"provider:model"` or plain model name with `provider`.

#### Example

```ts
`"openai:gpt-4o"`, `"gpt-4o-mini"`
```

***

### onFallback()?

> `optional` **onFallback**: (`error`, `fallbackProvider`) => `void`

Defined in: [packages/agentos/src/api/generateObject.ts:169](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L169)

Called when a fallback provider is about to be tried.

#### Parameters

##### error

`Error`

##### fallbackProvider

`string`

#### Returns

`void`

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:120](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L120)

User prompt. Convenience alternative to building a `messages` array.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:91](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L91)

Provider name. When supplied without `model`, the default text model for
the provider is resolved automatically.

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```

***

### schema

> **schema**: `T`

Defined in: [packages/agentos/src/api/generateObject.ts:101](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L101)

Zod schema defining the expected output shape.

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:117](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L117)

Description of the schema, injected into the system prompt alongside
the JSON Schema definition.

#### Example

```ts
`"Information about a person extracted from unstructured text."`
```

***

### schemaName?

> `optional` **schemaName**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:109](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L109)

Human-readable name for the schema, injected into the system prompt to
give the model context about what it is generating.

#### Example

```ts
`"PersonInfo"`
```

***

### system?

> `optional` **system**: `string` \| [`SystemContentBlock`](SystemContentBlock.md)[]

Defined in: [packages/agentos/src/api/generateObject.ts:133](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L133)

System prompt. The schema extraction instructions are appended to this,
so any custom system context is preserved.

Accepts a plain string (single system message) or an ordered array of
[SystemContentBlock](SystemContentBlock.md) entries. When an array is supplied, caller
`cacheBreakpoint` flags are preserved on each block and a final
non-cached block is appended with the JSON schema + formatting rules.
This enables Anthropic prompt caching on the stable prefix while letting
the per-call schema vary freely.

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/api/generateObject.ts:139](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L139)

Sampling temperature forwarded to the provider (0-2 for most providers).
