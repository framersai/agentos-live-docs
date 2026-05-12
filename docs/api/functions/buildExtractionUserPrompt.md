# Function: buildExtractionUserPrompt()

> **buildExtractionUserPrompt**(`sessionText`): `string`

Defined in: [packages/agentos/src/memory/retrieval/typed-network/prompts/extraction-prompt.ts:46](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/prompts/extraction-prompt.ts#L46)

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
