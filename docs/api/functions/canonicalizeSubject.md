# Function: canonicalizeSubject()

> **canonicalizeSubject**(`subject`): `string`

Defined in: [packages/agentos/src/memory/retrieval/fact-graph/canonicalization.ts:64](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/fact-graph/canonicalization.ts#L64)

Return the canonical form of a subject string.
- First-person pronouns (I, my, me, mine, myself) → "user"
- Anything else → lowercased + trimmed

## Parameters

### subject

`string`

## Returns

`string`
