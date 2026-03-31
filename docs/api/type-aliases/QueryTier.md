# Type Alias: QueryTier

> **QueryTier** = `0` \| `1` \| `2` \| `3`

Defined in: [packages/agentos/src/query-router/types.ts:43](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L43)

Complexity tier assigned to an incoming query.

- `0` — **Trivial**: Answered from conversation context or general knowledge
  (e.g., "What is TypeScript?"). No retrieval needed.
- `1` — **Simple lookup**: Single-source retrieval sufficient
  (e.g., "What port does the API run on?"). Vector search only.
- `2` — **Multi-source**: Requires combining information from multiple chunks
  or graph traversal (e.g., "How does auth flow from frontend to backend?").
- `3` — **Research**: Deep investigation across the entire corpus, possibly
  with iterative refinement (e.g., "Compare all caching strategies used in
  this codebase and recommend improvements.").
