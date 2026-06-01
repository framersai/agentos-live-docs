# Variable: DEFAULT\_EDGE\_MULTIPLIERS

> `const` **DEFAULT\_EDGE\_MULTIPLIERS**: `Record`\<[`EdgeKind`](../type-aliases/EdgeKind.md), `number`\>

Defined in: [packages/agentos/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts:39](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/retrieval/typed-network/TypedSpreadingActivation.ts#L39)

Per-edge-kind activation multipliers `μ(ℓ)` from Hindsight §2.4.1.
- **entity**: 1.0 (the strongest link, bidirectional shared-entity)
- **causal**: 1.0 (LLM-extracted reasoning chain — high signal)
- **temporal**: 0.7 (loose proximity in time)
- **semantic**: 0.6 (cosine ≥ θs threshold; treat as supporting,
  not primary, since the embedding path also runs separately at
  the four-way RRF fusion)

These default values are tunable per-deployment; pass an override
map via [TypedSpreadingActivationOptions.edgeMultipliers](../interfaces/TypedSpreadingActivationOptions.md#edgemultipliers).
