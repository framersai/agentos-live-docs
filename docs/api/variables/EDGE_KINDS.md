# Variable: EDGE\_KINDS

> `const` **EDGE\_KINDS**: readonly \[`"temporal"`, `"semantic"`, `"entity"`, `"causal"`\]

Defined in: [packages/agentos/src/memory/retrieval/typed-network/types.ts:53](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/types.ts#L53)

Edge kind in the typed-network graph. Each kind carries a different
spreading-activation multiplier μ(ℓ) per Hindsight Eq. 12 (§2.4.1).

- **temporal**: connects facts that share an occurrence-interval
  overlap. Weight derived from `exp(−Δt / σt)`.
- **semantic**: connects facts whose embeddings exceed a cosine
  threshold θs.
- **entity**: bidirectional link between facts mentioning the same
  named entity. Weight 1.0.
- **causal**: explicit reasoning marker linking premise → conclusion
  facts. LLM-extracted at observation time; weight 1.0.
