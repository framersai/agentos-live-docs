# Function: canonicalizeSubject()

> **canonicalizeSubject**(`subject`): `string`

Defined in: [packages/agentos/src/cognition/memory/retrieval/fact-graph/canonicalization.ts:64](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/fact-graph/canonicalization.ts#L64)

Return the canonical form of a subject string.
- First-person pronouns (I, my, me, mine, myself) → "user"
- Anything else → lowercased + trimmed

## Parameters

### subject

`string`

## Returns

`string`
