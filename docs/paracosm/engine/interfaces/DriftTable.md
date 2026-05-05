# Interface: DriftTable

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:62](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L62)

Drift parameters for a trait model. The kernel applies these to
agents and to the leader after each turn outcome.

## Properties

### leaderPull

> **leaderPull**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:73](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L73)

axis-id -> per-turn pull strength (0..1) toward the leader's value.
Agents drift toward leader's traits; leader does not pull-self.

***

### outcomes

> **outcomes**: `Record`\<`string`, `Partial`\<`Record`\<[`Outcome`](../type-aliases/Outcome.md), `number`\>\>\>

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:67](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L67)

axis-id -> outcome -> delta. Typical range -0.05 to +0.05.
Missing entries treated as zero.

***

### roleActivation

> **roleActivation**: `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/engine/trait-models/index.ts:80](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/trait-models/index.ts#L80)

axis-id -> per-turn amplification when the agent is promoted to a
department whose role activates that axis. Sign-aware: positive
pushes the trait up, negative pushes it down.
