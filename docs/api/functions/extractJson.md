# Function: extractJson()

> **extractJson**(`rawText`): `string` \| `null`

Defined in: [packages/agentos/src/core/validation/extractJson.ts:35](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/core/validation/extractJson.ts#L35)

Extract JSON from raw LLM output text.

Tries multiple extraction strategies in priority order:
1. Raw JSON (entire string is valid JSON)
2. Markdown fenced blocks (```json ... ``` or ``` ... ```)
3. Strip `<thinking>` blocks, then retry
4. First `{...}` or `[...]` via greedy brace/bracket matching
5. JSONL (multiple JSON objects on separate lines → array)

## Parameters

### rawText

`string`

Raw LLM output that may contain JSON

## Returns

`string` \| `null`

Extracted JSON string, or null if no valid JSON found

## Example

```ts
extractJson('```json\n{"key": "value"}\n```') // '{"key": "value"}'
extractJson('<thinking>hmm</thinking>\n{"a":1}') // '{"a":1}'
extractJson('no json here') // null
```
