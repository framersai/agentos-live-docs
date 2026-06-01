# Function: moodHistogram()

> **moodHistogram**(`swarm`): `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/runtime/swarm/index.ts:92](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/swarm/index.ts#L92)

Histogram of mood labels across alive agents — `{ focused: 12,
anxious: 5, ... }`. Excludes dead agents (they don't have a current
mood). Returns `{}` when no agents have a `mood` field set.

## Parameters

### swarm

#### agents

`object`[] = `...`

Every agent in the swarm at snapshot time, alive or dead.

#### births?

`number` = `...`

Number of births this turn.

#### deaths?

`number` = `...`

Number of deaths this turn.

#### morale?

`number` = `...`

Aggregate morale 0..1 (population-weighted).

#### population

`number` = `...`

Aggregate counts derived from `agents`.

#### scenarioExtensions?

`Record`\<`string`, `unknown`\> = `ScenarioExtensionsSchema`

#### time

`number` = `...`

Scenario time at snapshot (years/quarters/ticks per scenario).

#### turn

`number` = `...`

Turn number this snapshot was taken at (0-indexed).

## Returns

`Record`\<`string`, `number`\>
