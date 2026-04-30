# Interface: WorldSystems

Defined in: [apps/paracosm/src/engine/core/state.ts:132](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L132)

Universal settlement metrics shared by every scenario. Fields below the
`population` and `morale` core are common but optional — a non-Mars
scenario might not have `pressurizedVolumeM3` for example, and is free
to set its own values via the index signature.

Scenario-specific metrics (e.g., a submarine's hullPressureBars or a
corporation's quarterlyRevenue) live alongside via `[key: string]: number`.

## Indexable

\[`key`: `string`\]: `number`

Scenario-defined metrics beyond the universal set.

## Properties

### foodMonthsReserve

> **foodMonthsReserve**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:138](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L138)

Months of food reserve at current consumption.

***

### infrastructureModules

> **infrastructureModules**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:148](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L148)

Infrastructure modules / building units.

***

### lifeSupportCapacity

> **lifeSupportCapacity**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:146](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L146)

Life support headroom (max sustainable population).

***

### morale

> **morale**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:136](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L136)

Aggregate morale, 0..1.

***

### population

> **population**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:134](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L134)

Alive headcount.

***

### powerKw

> **powerKw**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:140](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L140)

Generated power capacity, kW.

***

### pressurizedVolumeM3

> **pressurizedVolumeM3**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:144](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L144)

Sealed habitable volume, m³ — Mars/Lunar/space-specific, optional in others.

***

### scienceOutput

> **scienceOutput**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:150](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L150)

Science / research output index.

***

### waterLitersPerDay

> **waterLitersPerDay**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:142](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/core/state.ts#L142)

Daily water budget, liters.
