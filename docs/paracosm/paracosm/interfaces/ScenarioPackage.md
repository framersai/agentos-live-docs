# Interface: ScenarioPackage

Defined in: [apps/paracosm/src/engine/types.ts:423](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L423)

The top-level contract for a Paracosm scenario.
Defines everything the engine needs to run a closed-state, turn-based
settlement simulation: world schema, departments, effects, UI metadata,
research knowledge, policies, presets, and lifecycle hooks.

## Example

```typescript
import type { ScenarioPackage } from 'paracosm';
import { marsScenario } from 'paracosm';

const myScenario: ScenarioPackage = { ... };
```

## Properties

### departments

> **departments**: `DepartmentDefinition`[]

Defined in: [apps/paracosm/src/engine/types.ts:443](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L443)

***

### effects

> **effects**: `EffectDefinition`[]

Defined in: [apps/paracosm/src/engine/types.ts:446](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L446)

***

### engineArchetype

> **engineArchetype**: `"closed_turn_based_settlement"`

Defined in: [apps/paracosm/src/engine/types.ts:436](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L436)

Engine archetype this scenario targets

***

### events

> **events**: `EventDefinition`[]

Defined in: [apps/paracosm/src/engine/types.ts:445](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L445)

***

### hooks

> **hooks**: `ScenarioHooks`

Defined in: [apps/paracosm/src/engine/types.ts:451](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L451)

***

### id

> **id**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:425](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L425)

Unique scenario identifier (e.g., "mars-genesis", "lunar-outpost")

***

### knowledge

> **knowledge**: `KnowledgeBundle`

Defined in: [apps/paracosm/src/engine/types.ts:448](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L448)

***

### labels

> **labels**: `ScenarioLabels`

Defined in: [apps/paracosm/src/engine/types.ts:438](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L438)

***

### metrics

> **metrics**: `MetricDefinition`[]

Defined in: [apps/paracosm/src/engine/types.ts:444](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L444)

***

### policies

> **policies**: `ScenarioPolicies`

Defined in: [apps/paracosm/src/engine/types.ts:449](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L449)

***

### presets

> **presets**: `ScenarioPreset`[]

Defined in: [apps/paracosm/src/engine/types.ts:450](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L450)

***

### setup

> **setup**: `ScenarioSetupSchema`

Defined in: [apps/paracosm/src/engine/types.ts:440](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L440)

***

### sourceUrl?

> `optional` **sourceUrl**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:432](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L432)

Optional permalink to the scenario JSON in the public repo (e.g.
https://github.com/framerslab/paracosm/blob/master/scenarios/mars.json).
Surfaced in the dashboard so users can read or fork the scenario
source from the settings panel without leaving the app.

***

### theme

> **theme**: `ScenarioTheme`

Defined in: [apps/paracosm/src/engine/types.ts:439](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L439)

***

### ui

> **ui**: `ScenarioUiDefinition`

Defined in: [apps/paracosm/src/engine/types.ts:447](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L447)

***

### version

> **version**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:434](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L434)

Semantic version of this scenario definition

***

### world

> **world**: `ScenarioWorldSchema`

Defined in: [apps/paracosm/src/engine/types.ts:441](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/types.ts#L441)
