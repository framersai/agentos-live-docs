# Function: departmentHeadcount()

> **departmentHeadcount**(`swarm`): `Record`\<`string`, `number`\>

Defined in: [apps/paracosm/src/runtime/swarm/index.ts:107](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/runtime/swarm/index.ts#L107)

Histogram of agents per department for the alive population. Useful
for org-chart staffing snapshots and capacity planning.

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
