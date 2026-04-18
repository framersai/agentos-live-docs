# Interface: StreamObjectOptions\<T\>

Defined in: [packages/agentos/src/api/streamObject.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L49)

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

`T` *extends* `ZodType`

The Zod schema type defining the expected output shape.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:108](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L108)

Override the API key.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:111](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L111)

Override the provider base URL.

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/agentos/src/api/streamObject.ts:105](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L105)

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

Defined in: [packages/agentos/src/api/streamObject.ts:95](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L95)

Hard cap on output tokens.

***

### messages?

> `optional` **messages**: [`Message`](Message.md)[]

Defined in: [packages/agentos/src/api/streamObject.ts:89](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L89)

Full conversation history.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:63](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L63)

Model identifier. Accepts `"provider:model"` or plain model name with `provider`.

#### Example

```ts
`"openai:gpt-4o"`, `"gpt-4o-mini"`
```

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:83](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L83)

User prompt.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:56](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L56)

Provider name. When supplied without `model`, the default text model for
the provider is resolved automatically.

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```

***

### schema

> **schema**: `T`

Defined in: [packages/agentos/src/api/streamObject.ts:66](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L66)

Zod schema defining the expected output shape.

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:80](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L80)

Description of the schema, injected into the system prompt.

#### Example

```ts
`"A shopping list with a person's name and items."`
```

***

### schemaName?

> `optional` **schemaName**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:73](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L73)

Human-readable name for the schema, injected into the system prompt.

#### Example

```ts
`"ShoppingList"`
```

***

### system?

> `optional` **system**: `string`

Defined in: [packages/agentos/src/api/streamObject.ts:86](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L86)

System prompt. Schema instructions are appended automatically.

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [packages/agentos/src/api/streamObject.ts:92](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/streamObject.ts#L92)

Sampling temperature forwarded to the provider.
