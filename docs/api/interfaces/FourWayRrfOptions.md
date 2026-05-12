# Interface: FourWayRrfOptions

Defined in: [packages/agentos/src/memory/retrieval/typed-network/FourWayRrf.ts:35](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/FourWayRrf.ts#L35)

Fusion options.

## Properties

### k?

> `optional` **k**: `number`

Defined in: [packages/agentos/src/memory/retrieval/typed-network/FourWayRrf.ts:37](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/FourWayRrf.ts#L37)

RRF constant. Default 60 per the standard literature.

***

### weights?

> `optional` **weights**: `Partial`\<`Record`\<keyof [`FourWayRrfInput`](FourWayRrfInput.md), `number`\>\>

Defined in: [packages/agentos/src/memory/retrieval/typed-network/FourWayRrf.ts:43](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/FourWayRrf.ts#L43)

Optional per-signal weight multiplier. Defaults to {1, 1, 1, 1}
(uniform RRF). Use to emphasize one signal over others — e.g.
downweighting graph activation when the typed network is sparse.
