# Interface: GenerateObjectOptions\<T\>

Defined in: [packages/agentos/src/api/generateObject.ts:117](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L117)

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

Defined in: [packages/agentos/src/api/generateObject.ts:188](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L188)

Override the API key instead of reading from environment variables.

***

### baseUrl?

> `optional` **baseUrl**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:191](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L191)

Override the provider base URL (useful for local proxies or Ollama).

***

### fallbackProviders?

> `optional` **fallbackProviders**: [`FallbackProviderEntry`](FallbackProviderEntry.md)[]

Defined in: [packages/agentos/src/api/generateObject.ts:198](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L198)

Ordered fallback providers tried when the primary fails with a retryable
error. When undefined, auto-built from env keys. Pass `[]` to disable.

#### See

import('./generateText.js').GenerateTextOptions.fallbackProviders

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/agentos/src/api/generateObject.ts:185](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L185)

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

Defined in: [packages/agentos/src/api/generateObject.ts:176](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L176)

Hard cap on output tokens.

***

### messages?

> `optional` **messages**: [`Message`](Message.md)[]

Defined in: [packages/agentos/src/api/generateObject.ts:170](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L170)

Full conversation history.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:132](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L132)

Model identifier. Prefer the plain model name with `provider` set;
the combined `"provider:model"` string is also accepted.

#### Example

```ts
`"gpt-4o"` (with `provider: 'openai'`), `"gpt-4o-mini"`
```

***

### onFallback()?

> `optional` **onFallback**: (`error`, `fallbackProvider`) => `void`

Defined in: [packages/agentos/src/api/generateObject.ts:203](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L203)

Called when a fallback provider is about to be tried.

#### Parameters

##### error

`Error`

##### fallbackProvider

`string`

#### Returns

`void`

***

### policyTier?

> `optional` **policyTier**: `"safe"` \| `"standard"` \| `"mature"` \| `"private-adult"`

Defined in: [packages/agentos/src/api/generateObject.ts:221](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L221)

Caller's intended content policy tier. Forwarded to
import('./generateText.js').GenerateTextOptions.policyTier
so structured-output callers get the same policy-aware fallback
behavior as plain text callers — mature/private-adult requests
auto-route refusals to an uncensored OpenRouter model instead of
hard-failing on a content_policy_violation.

Particularly relevant here because OpenAI's strict structured-
output mode (`response_format: json_schema`) is the most
aggressively-moderated path on the platform; a NSFW story
extraction tagged with `policyTier: 'mature'` will pre-empt the
422 by routing to Hermes 3 (which honors the looser
`json_object` mode that [generateObject](../functions/generateObject.md) falls back to for
non-OpenAI providers).

***

### prompt?

> `optional` **prompt**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:154](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L154)

User prompt. Convenience alternative to building a `messages` array.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:124](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L124)

Provider name. When supplied without `model`, the default text model for
the provider is resolved automatically.

#### Example

```ts
`"openai"`, `"anthropic"`, `"ollama"`
```

***

### schema

> **schema**: `T`

Defined in: [packages/agentos/src/api/generateObject.ts:135](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L135)

Zod schema defining the expected output shape.

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:151](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L151)

Description of the schema, injected into the system prompt alongside
the JSON Schema definition.

#### Example

```ts
`"Information about a person extracted from unstructured text."`
```

***

### schemaName?

> `optional` **schemaName**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:143](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L143)

Human-readable name for the schema, injected into the system prompt to
give the model context about what it is generating.

#### Example

```ts
`"PersonInfo"`
```

***

### system?

> `optional` **system**: `string` \| [`SystemContentBlock`](SystemContentBlock.md)[]

Defined in: [packages/agentos/src/api/generateObject.ts:167](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L167)

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

Defined in: [packages/agentos/src/api/generateObject.ts:173](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L173)

Sampling temperature forwarded to the provider (0-2 for most providers).
