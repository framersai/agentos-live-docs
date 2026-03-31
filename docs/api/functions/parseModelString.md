# Function: parseModelString()

> **parseModelString**(`model`): `ParsedModel`

Defined in: [packages/agentos/src/api/model.ts:76](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/model.ts#L76)

Splits a `provider:model` string into its constituent parts.

The format is strict: the provider portion must be non-empty, separated from
the model portion by exactly one colon, and the model portion must also be
non-empty.

## Parameters

### model

`string`

A `provider:model` string such as `"openai:gpt-4o"`,
  `"ollama:llama3.2"`, or `"openrouter:anthropic/claude-sonnet-4-5-20250929"`.

## Returns

`ParsedModel`

A `ParsedModel` with `providerId` and `modelId` fields.

## Throws

When the string is missing, not a string, or does not match
  the expected `provider:model` format.
