# Interface: ScenarioPackage

Defined in: [types.ts:366](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L366)

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

Defined in: [types.ts:379](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L379)

***

### effects

> **effects**: [`EffectDefinition`](EffectDefinition.md)[]

Defined in: [types.ts:382](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L382)

***

### engineArchetype

> **engineArchetype**: `"closed_turn_based_settlement"`

Defined in: [types.ts:372](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L372)

Engine archetype this scenario targets

***

### events

> **events**: [`EventDefinition`](EventDefinition.md)[]

Defined in: [types.ts:381](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L381)

***

### hooks

> **hooks**: [`ScenarioHooks`](ScenarioHooks.md)

Defined in: [types.ts:387](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L387)

***

### id

> **id**: `string`

Defined in: [types.ts:368](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L368)

Unique scenario identifier (e.g., "mars-genesis", "lunar-outpost")

***

### knowledge

> **knowledge**: [`KnowledgeBundle`](KnowledgeBundle.md)

Defined in: [types.ts:384](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L384)

***

### labels

> **labels**: [`ScenarioLabels`](ScenarioLabels.md)

Defined in: [types.ts:374](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L374)

***

### metrics

> **metrics**: [`MetricDefinition`](MetricDefinition.md)[]

Defined in: [types.ts:380](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L380)

***

### policies

> **policies**: [`ScenarioPolicies`](ScenarioPolicies.md)

Defined in: [types.ts:385](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L385)

***

### presets

> **presets**: [`ScenarioPreset`](ScenarioPreset.md)[]

Defined in: [types.ts:386](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L386)

***

### setup

> **setup**: [`ScenarioSetupSchema`](ScenarioSetupSchema.md)

Defined in: [types.ts:376](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L376)

***

### theme

> **theme**: [`ScenarioTheme`](ScenarioTheme.md)

Defined in: [types.ts:375](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L375)

***

### ui

> **ui**: [`ScenarioUiDefinition`](ScenarioUiDefinition.md)

Defined in: [types.ts:383](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L383)

***

### version

> **version**: `string`

Defined in: [types.ts:370](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L370)

Semantic version of this scenario definition

***

### world

> **world**: [`ScenarioWorldSchema`](ScenarioWorldSchema.md)

Defined in: [types.ts:377](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L377)
