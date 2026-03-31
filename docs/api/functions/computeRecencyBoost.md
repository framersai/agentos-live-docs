# Function: computeRecencyBoost()

> **computeRecencyBoost**(`lastAccessedAt`, `now`, `halfLifeMs?`): `number`

Defined in: [packages/agentos/src/memory/core/decay/RetrievalPriorityScorer.ts:52](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/core/decay/RetrievalPriorityScorer.ts#L52)

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
