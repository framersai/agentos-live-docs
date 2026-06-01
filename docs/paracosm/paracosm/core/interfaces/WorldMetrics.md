# Interface: WorldMetrics

Defined in: [apps/paracosm/src/engine/core/state.ts:145](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L145)

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

Defined in: [apps/paracosm/src/engine/core/state.ts:151](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L151)

Months of food reserve at current consumption.

***

### infrastructureModules

> **infrastructureModules**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:161](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L161)

Infrastructure modules / building units.

***

### lifeSupportCapacity

> **lifeSupportCapacity**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:159](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L159)

Life support headroom (max sustainable population).

***

### morale

> **morale**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:149](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L149)

Aggregate morale, 0..1.

***

### population

> **population**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:147](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L147)

Alive headcount.

***

### powerKw

> **powerKw**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:153](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L153)

Generated power capacity, kW.

***

### pressurizedVolumeM3

> **pressurizedVolumeM3**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:157](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L157)

Sealed habitable volume, m³ — Mars/Lunar/space-specific, optional in others.

***

### scienceOutput

> **scienceOutput**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:163](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L163)

Science / research output index.

***

### waterLitersPerDay

> **waterLitersPerDay**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:155](https://github.com/framerslab/paracosm/blob/8887b389ebb1029adcd45226dfa95c344c2100ba/src/engine/core/state.ts#L155)

Daily water budget, liters.
