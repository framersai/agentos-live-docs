# Interface: WorldPolitics

Defined in: [apps/paracosm/src/engine/core/state.ts:174](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L174)

Universal political/social state shared by every scenario.

The previous shape baked in Mars-specific fields (earthDependencyPct,
governanceStatus 'earth-governed'/'commonwealth'/'independent',
independencePressure). Those still ship as defaults so the Mars and
Lunar scenarios continue to work without changes, but a custom scenario
(e.g., medieval kingdom with `vassalLoyaltyPct`, corporate sim with
`boardConfidence`) can extend via the index signature without touching
engine core.

## Indexable

\[`key`: `string`\]: `string` \| `number` \| `boolean`

Scenario-defined political variables beyond the universal set.

## Properties

### earthDependencyPct

> **earthDependencyPct**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:179](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L179)

Mars/Lunar-specific: percentage of supplies still relying on the
parent body (Earth, planet, etc.). Custom scenarios may ignore.

***

### governanceStatus

> **governanceStatus**: `"earth-governed"` \| `"commonwealth"` \| `"independent"`

Defined in: [apps/paracosm/src/engine/core/state.ts:184](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L184)

Mars/Lunar-specific governance trajectory. Custom scenarios may ignore
or override with their own status string via the index signature.

***

### independencePressure

> **independencePressure**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:189](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L189)

Mars/Lunar-specific: 0..1 pressure toward independence. Custom
scenarios may ignore.
