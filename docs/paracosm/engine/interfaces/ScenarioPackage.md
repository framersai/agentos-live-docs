# Interface: ScenarioPackage

Defined in: [apps/paracosm/src/engine/types.ts:420](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L420)

The top-level contract for a Paracosm scenario.
Defines everything the engine needs to run a closed-state, turn-based
settlement simulation: world schema, departments, effects, UI metadata,
research knowledge, policies, presets, and lifecycle hooks.

## Example

```typescript
import type { ScenarioPackage } from 'paracosm';
import { marsScenario } from 'paracosm/mars';

const myScenario: ScenarioPackage = { ... };
```

## Properties

### departments

> **departments**: [`DepartmentDefinition`](DepartmentDefinition.md)[]

Defined in: [apps/paracosm/src/engine/types.ts:433](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L433)

***

### effects

> **effects**: [`EffectDefinition`](EffectDefinition.md)[]

Defined in: [apps/paracosm/src/engine/types.ts:436](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L436)

***

### engineArchetype

> **engineArchetype**: `"closed_turn_based_settlement"`

Defined in: [apps/paracosm/src/engine/types.ts:426](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L426)

Engine archetype this scenario targets

***

### events

> **events**: [`EventDefinition`](EventDefinition.md)[]

Defined in: [apps/paracosm/src/engine/types.ts:435](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L435)

***

### hooks

> **hooks**: [`ScenarioHooks`](ScenarioHooks.md)

Defined in: [apps/paracosm/src/engine/types.ts:441](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L441)

***

### id

> **id**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:422](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L422)

Unique scenario identifier (e.g., "mars-genesis", "lunar-outpost")

***

### knowledge

> **knowledge**: [`KnowledgeBundle`](KnowledgeBundle.md)

Defined in: [apps/paracosm/src/engine/types.ts:438](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L438)

***

### labels

> **labels**: [`ScenarioLabels`](ScenarioLabels.md)

Defined in: [apps/paracosm/src/engine/types.ts:428](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L428)

***

### metrics

> **metrics**: [`MetricDefinition`](MetricDefinition.md)[]

Defined in: [apps/paracosm/src/engine/types.ts:434](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L434)

***

### policies

> **policies**: [`ScenarioPolicies`](ScenarioPolicies.md)

Defined in: [apps/paracosm/src/engine/types.ts:439](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L439)

***

### presets

> **presets**: [`ScenarioPreset`](ScenarioPreset.md)[]

Defined in: [apps/paracosm/src/engine/types.ts:440](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L440)

***

### setup

> **setup**: [`ScenarioSetupSchema`](ScenarioSetupSchema.md)

Defined in: [apps/paracosm/src/engine/types.ts:430](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L430)

***

### theme

> **theme**: [`ScenarioTheme`](ScenarioTheme.md)

Defined in: [apps/paracosm/src/engine/types.ts:429](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L429)

***

### ui

> **ui**: [`ScenarioUiDefinition`](ScenarioUiDefinition.md)

Defined in: [apps/paracosm/src/engine/types.ts:437](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L437)

***

### version

> **version**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:424](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L424)

Semantic version of this scenario definition

***

### world

> **world**: [`ScenarioWorldSchema`](ScenarioWorldSchema.md)

Defined in: [apps/paracosm/src/engine/types.ts:431](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L431)
