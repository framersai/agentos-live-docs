# Interface: WorldMetrics

Defined in: [apps/paracosm/src/engine/core/state.ts:140](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L140)

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

Defined in: [apps/paracosm/src/engine/core/state.ts:146](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L146)

Months of food reserve at current consumption.

***

### infrastructureModules

> **infrastructureModules**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:156](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L156)

Infrastructure modules / building units.

***

### lifeSupportCapacity

> **lifeSupportCapacity**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:154](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L154)

Life support headroom (max sustainable population).

***

### morale

> **morale**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:144](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L144)

Aggregate morale, 0..1.

***

### population

> **population**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:142](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L142)

Alive headcount.

***

### powerKw

> **powerKw**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:148](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L148)

Generated power capacity, kW.

***

### pressurizedVolumeM3

> **pressurizedVolumeM3**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:152](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L152)

Sealed habitable volume, m³ — Mars/Lunar/space-specific, optional in others.

***

### scienceOutput

> **scienceOutput**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:158](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L158)

Science / research output index.

***

### waterLitersPerDay

> **waterLitersPerDay**: `number`

Defined in: [apps/paracosm/src/engine/core/state.ts:150](https://github.com/framersai/paracosm/blob/902b79ee37e51444458d39152e6844a2c10a050e/src/engine/core/state.ts#L150)

Daily water budget, liters.
