# Function: buildExtractionUserPrompt()

> **buildExtractionUserPrompt**(`sessionText`): `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/prompts/extraction-prompt.ts:46](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/prompts/extraction-prompt.ts#L46)

Build the user prompt for a single conversation block. Wraps the
source text in delimiters that resist accidental inline-injection
if the conversation contains JSON-looking content.

## Parameters

### sessionText

`string`

The conversation text to extract from. Whole
  session passed as one block; the model decomposes per turn
  internally.

## Returns

`string`
