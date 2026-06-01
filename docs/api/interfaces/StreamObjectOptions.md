# Interface: StreamObjectOptions\<T\>

Defined in: [packages/agentos/src/api/streamObject.ts:49](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L49)

Options for a [streamObject](../functions/streamObject.md) call.

Shares the same shape as [GenerateObjectOptions](GenerateObjectOptions.md) from [generateObject](../functions/generateObject.md).
At minimum, `schema` and either `prompt` or `messages` must be supplied.

## Example

```ts
const opts: StreamObjectOptions<typeof mySchema> = {
  schema: z.object({ name: z.string(), items: z.array(z.string()) }),
  prompt: 'List 3 fruits with a person name',
};
```

## Type Parameters

### T

`T` *extends* [`ZodType`](../@framers/namespaces/z/interfaces/ZodType-1.md)

The Zod schema type defining the expected output shape.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:109](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L109)

Override the API key.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:112](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L112)

Override the provider base URL.

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/agentos/src/api/streamObject.ts:106](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L106)

Number of retries on validation failure.
Unlike [generateObject](../functions/generateObject.md), streaming retries are not currently supported
(the stream is consumed once). This field is accepted for API symmetry but
is unused; validation errors on the final object throw immediately.

#### Default

```ts
0
```

***

### maxTokens?

> `optional` **maxTokens**: `number`

Defined in: [packages/agentos/src/api/streamObject.ts:96](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L96)

Hard cap on output tokens.

***

### messages?

> `optional` **messages**: [`Message`](Message.md)[]

Defined in: [packages/agentos/src/api/streamObject.ts:90](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L90)

Full conversation history.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:64](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L64)

Model identifier. Prefer the plain model name with `provider` set;
the combined `"provider:model"` string is also accepted.

#### Example

```ts
`"gpt-4o"` (with `provider: 'openai'`), `"gpt-4o-mini"`
```

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:84](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L84)

User prompt.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:56](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L56)

Provider name. When supplied without `model`, the default text model for
the provider is resolved automatically.

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```

***

### schema

> **schema**: `T`

Defined in: [packages/agentos/src/api/streamObject.ts:67](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L67)

Zod schema defining the expected output shape.

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:81](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L81)

Description of the schema, injected into the system prompt.

#### Example

```ts
`"A shopping list with a person's name and items."`
```

***

### schemaName?

> `optional` **schemaName**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:74](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L74)

Human-readable name for the schema, injected into the system prompt.

#### Example

```ts
`"ShoppingList"`
```

***

### system?

> `optional` **system**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:87](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L87)

System prompt. Schema instructions are appended automatically.

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/api/streamObject.ts:93](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/streamObject.ts#L93)

Sampling temperature forwarded to the provider.
