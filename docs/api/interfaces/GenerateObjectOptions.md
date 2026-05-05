# Interface: GenerateObjectOptions\<T\>

Defined in: [packages/agentos/src/api/generateObject.ts:86](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L86)

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

`T` *extends* [`ZodType`](../@framers/namespaces/z/interfaces/ZodType-1.md)

The Zod schema type that defines the expected output shape.

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:156](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L156)

Override the API key instead of reading from environment variables.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:159](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L159)

Override the provider base URL (useful for local proxies or Ollama).

***

### fallbackProviders?

> `optional` **fallbackProviders**: [`FallbackProviderEntry`](FallbackProviderEntry.md)[]

Defined in: [packages/agentos/src/api/generateObject.ts:166](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L166)

Ordered fallback providers tried when the primary fails with a retryable
error. When undefined, auto-built from env keys. Pass `[]` to disable.

#### See

import('./generateText.js').GenerateTextOptions.fallbackProviders

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/agentos/src/api/generateObject.ts:153](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L153)

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

Defined in: [packages/agentos/src/api/generateObject.ts:144](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L144)

Hard cap on output tokens.

***

### messages?

> `optional` **messages**: [`Message`](Message.md)[]

Defined in: [packages/agentos/src/api/generateObject.ts:138](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L138)

Full conversation history.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:100](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L100)

Model identifier. Accepts `"provider:model"` or plain model name with `provider`.

#### Example

```ts
`"openai:gpt-4o"`, `"gpt-4o-mini"`
```

***

### onFallback()?

> `optional` **onFallback**: (`error`, `fallbackProvider`) => `void`

Defined in: [packages/agentos/src/api/generateObject.ts:171](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L171)

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

Defined in: [packages/agentos/src/api/generateObject.ts:122](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L122)

User prompt. Convenience alternative to building a `messages` array.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:93](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L93)

Provider name. When supplied without `model`, the default text model for
the provider is resolved automatically.

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```

***

### schema

> **schema**: `T`

Defined in: [packages/agentos/src/api/generateObject.ts:103](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L103)

Zod schema defining the expected output shape.

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:119](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L119)

Description of the schema, injected into the system prompt alongside
the JSON Schema definition.

#### Example

```ts
`"Information about a person extracted from unstructured text."`
```

***

### schemaName?

> `optional` **schemaName**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:111](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L111)

Human-readable name for the schema, injected into the system prompt to
give the model context about what it is generating.

#### Example

```ts
`"PersonInfo"`
```

***

### system?

> `optional` **system**: `string` \| [`SystemContentBlock`](SystemContentBlock.md)[]

Defined in: [packages/agentos/src/api/generateObject.ts:135](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L135)

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

Defined in: [packages/agentos/src/api/generateObject.ts:141](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L141)

Sampling temperature forwarded to the provider (0-2 for most providers).
