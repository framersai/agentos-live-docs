# Interface: ScenarioPackage

Defined in: [apps/paracosm/src/engine/types.ts:415](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L415)

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

Defined in: [apps/paracosm/src/engine/types.ts:428](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L428)

***

### effects

> **effects**: `EffectDefinition`[]

Defined in: [apps/paracosm/src/engine/types.ts:431](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L431)

***

### engineArchetype

> **engineArchetype**: `"closed_turn_based_settlement"`

Defined in: [apps/paracosm/src/engine/types.ts:421](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L421)

Engine archetype this scenario targets

***

### events

> **events**: `EventDefinition`[]

Defined in: [apps/paracosm/src/engine/types.ts:430](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L430)

***

### hooks

> **hooks**: `ScenarioHooks`

Defined in: [apps/paracosm/src/engine/types.ts:436](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L436)

***

### id

> **id**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:417](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L417)

Unique scenario identifier (e.g., "mars-genesis", "lunar-outpost")

***

### knowledge

> **knowledge**: `KnowledgeBundle`

Defined in: [apps/paracosm/src/engine/types.ts:433](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L433)

***

### labels

> **labels**: `ScenarioLabels`

Defined in: [apps/paracosm/src/engine/types.ts:423](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L423)

***

### metrics

> **metrics**: `MetricDefinition`[]

Defined in: [apps/paracosm/src/engine/types.ts:429](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L429)

***

### policies

> **policies**: `ScenarioPolicies`

Defined in: [apps/paracosm/src/engine/types.ts:434](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L434)

***

### presets

> **presets**: `ScenarioPreset`[]

Defined in: [apps/paracosm/src/engine/types.ts:435](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L435)

***

### setup

> **setup**: `ScenarioSetupSchema`

Defined in: [apps/paracosm/src/engine/types.ts:425](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L425)

***

### theme

> **theme**: `ScenarioTheme`

Defined in: [apps/paracosm/src/engine/types.ts:424](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L424)

***

### ui

> **ui**: `ScenarioUiDefinition`

Defined in: [apps/paracosm/src/engine/types.ts:432](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L432)

***

### version

> **version**: `string`

Defined in: [apps/paracosm/src/engine/types.ts:419](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L419)

Semantic version of this scenario definition

***

### world

> **world**: `ScenarioWorldSchema`

Defined in: [apps/paracosm/src/engine/types.ts:426](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/types.ts#L426)
