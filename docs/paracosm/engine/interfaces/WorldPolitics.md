# Interface: WorldPolitics

Defined in: [engine/core/state.ts:166](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L166)

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

Defined in: [engine/core/state.ts:171](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L171)

Mars/Lunar-specific: percentage of supplies still relying on the
parent body (Earth, planet, etc.). Custom scenarios may ignore.

***

### governanceStatus

> **governanceStatus**: `"earth-governed"` \| `"commonwealth"` \| `"independent"`

Defined in: [engine/core/state.ts:176](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L176)

Mars/Lunar-specific governance trajectory. Custom scenarios may ignore
or override with their own status string via the index signature.

***

### independencePressure

> **independencePressure**: `number`

Defined in: [engine/core/state.ts:181](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/engine/core/state.ts#L181)

Mars/Lunar-specific: 0..1 pressure toward independence. Custom
scenarios may ignore.
