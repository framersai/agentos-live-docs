# Interface: GenerateObjectOptions\<T\>

Defined in: [packages/agentos/src/api/generateObject.ts:84](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L84)

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

Defined in: [packages/agentos/src/api/generateObject.ts:147](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L147)

Override the API key instead of reading from environment variables.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:150](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L150)

Override the provider base URL (useful for local proxies or Ollama).

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/agentos/src/api/generateObject.ts:144](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L144)

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

Defined in: [packages/agentos/src/api/generateObject.ts:135](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L135)

Hard cap on output tokens.

***

### messages?

> `optional` **messages**: [`Message`](Message.md)[]

Defined in: [packages/agentos/src/api/generateObject.ts:129](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L129)

Full conversation history.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:98](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L98)

Model identifier. Accepts `"provider:model"` or plain model name with `provider`.

#### Example

```ts
`"openai:gpt-4o"`, `"gpt-4o-mini"`
```

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:120](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L120)

User prompt. Convenience alternative to building a `messages` array.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:91](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L91)

Provider name. When supplied without `model`, the default text model for
the provider is resolved automatically.

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```

***

### schema

> **schema**: `T`

Defined in: [packages/agentos/src/api/generateObject.ts:101](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L101)

Zod schema defining the expected output shape.

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:117](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L117)

Description of the schema, injected into the system prompt alongside
the JSON Schema definition.

#### Example

```ts
`"Information about a person extracted from unstructured text."`
```

***

### schemaName?

> `optional` **schemaName**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:109](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L109)

Human-readable name for the schema, injected into the system prompt to
give the model context about what it is generating.

#### Example

```ts
`"PersonInfo"`
```

***

### system?

> `optional` **system**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:126](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L126)

System prompt. The schema extraction instructions are appended to this,
so any custom system context is preserved.

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/api/generateObject.ts:132](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L132)

Sampling temperature forwarded to the provider (0-2 for most providers).
