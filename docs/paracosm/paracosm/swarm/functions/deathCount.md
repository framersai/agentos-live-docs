# Function: deathCount()

> **deathCount**(`swarm`): `number`

Defined in: [apps/paracosm/src/runtime/swarm/index.ts:83](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/runtime/swarm/index.ts#L83)

Number of dead agents at snapshot time. Counts every agent ever
present in the run, not just deaths-this-turn (use `swarm.deaths`
for the per-turn delta).

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

`number`
