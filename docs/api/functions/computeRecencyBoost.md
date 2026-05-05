# Function: computeRecencyBoost()

> **computeRecencyBoost**(`lastAccessedAt`, `now`, `halfLifeMs?`): `number`

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:58](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/decay/RetrievalPriorityScorer.ts#L58)

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
