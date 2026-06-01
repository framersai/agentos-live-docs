# Function: computeRecencyBoost()

> **computeRecencyBoost**(`lastAccessedAt`, `now`, `halfLifeMs?`): `number`

Defined in: [packages/agentos/src/cognition/memory/core/decay/RetrievalPriorityScorer.ts:58](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/decay/RetrievalPriorityScorer.ts#L58)

Recency boost: exponential decay from recent events.
Recent memories (within the half-life window) get a small bonus.

boost = 1 + 0.2 · e^(-elapsed / halfLife)

## Parameters

### lastAccessedAt

`number`

### now

`number`

### halfLifeMs?

`number` = `DEFAULT_DECAY_CONFIG.recencyHalfLifeMs`

## Returns

`number`
