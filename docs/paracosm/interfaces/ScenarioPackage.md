# Interface: ScenarioPackage

Defined in: [types.ts:357](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L357)

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

Defined in: [types.ts:370](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L370)

***

### effects

> **effects**: [`EffectDefinition`](EffectDefinition.md)[]

Defined in: [types.ts:373](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L373)

***

### engineArchetype

> **engineArchetype**: `"closed_turn_based_settlement"`

Defined in: [types.ts:363](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L363)

Engine archetype this scenario targets

***

### events

> **events**: [`EventDefinition`](EventDefinition.md)[]

Defined in: [types.ts:372](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L372)

***

### hooks

> **hooks**: [`ScenarioHooks`](ScenarioHooks.md)

Defined in: [types.ts:378](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L378)

***

### id

> **id**: `string`

Defined in: [types.ts:359](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L359)

Unique scenario identifier (e.g., "mars-genesis", "lunar-outpost")

***

### knowledge

> **knowledge**: [`KnowledgeBundle`](KnowledgeBundle.md)

Defined in: [types.ts:375](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L375)

***

### labels

> **labels**: [`ScenarioLabels`](ScenarioLabels.md)

Defined in: [types.ts:365](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L365)

***

### metrics

> **metrics**: [`MetricDefinition`](MetricDefinition.md)[]

Defined in: [types.ts:371](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L371)

***

### policies

> **policies**: [`ScenarioPolicies`](ScenarioPolicies.md)

Defined in: [types.ts:376](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L376)

***

### presets

> **presets**: [`ScenarioPreset`](ScenarioPreset.md)[]

Defined in: [types.ts:377](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L377)

***

### setup

> **setup**: [`ScenarioSetupSchema`](ScenarioSetupSchema.md)

Defined in: [types.ts:367](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L367)

***

### theme

> **theme**: [`ScenarioTheme`](ScenarioTheme.md)

Defined in: [types.ts:366](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L366)

***

### ui

> **ui**: [`ScenarioUiDefinition`](ScenarioUiDefinition.md)

Defined in: [types.ts:374](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L374)

***

### version

> **version**: `string`

Defined in: [types.ts:361](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L361)

Semantic version of this scenario definition

***

### world

> **world**: [`ScenarioWorldSchema`](ScenarioWorldSchema.md)

Defined in: [types.ts:368](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L368)
