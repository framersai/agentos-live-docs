# Interface: SimulationInitOverrides

Defined in: [apps/paracosm/src/engine/core/kernel.ts:77](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/kernel.ts#L77)

## Properties

### initialPopulation?

> `optional` **initialPopulation**: `number`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:79](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/kernel.ts#L79)

***

### scenario?

> `optional` **scenario**: [`ScenarioPackage`](ScenarioPackage.md)

Defined in: [apps/paracosm/src/engine/core/kernel.ts:86](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/kernel.ts#L86)

Source for scenario-declared world bag initials. When present, the
kernel seeds each runtime bag from `scenario.world.*` before
applying the explicit overlay fields below. Absent → Mars-heritage
hardcoded defaults only.

***

### startingEnvironment?

> `optional` **startingEnvironment**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [apps/paracosm/src/engine/core/kernel.ts:90](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/kernel.ts#L90)

***

### startingPolitics?

> `optional` **startingPolitics**: `Partial`\<[`WorldPolitics`](WorldPolitics.md)\>

Defined in: [apps/paracosm/src/engine/core/kernel.ts:88](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/kernel.ts#L88)

***

### startingResources?

> `optional` **startingResources**: `Partial`\<[`WorldMetrics`](WorldMetrics.md)\>

Defined in: [apps/paracosm/src/engine/core/kernel.ts:87](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/kernel.ts#L87)

***

### startingStatuses?

> `optional` **startingStatuses**: `Record`\<`string`, `string` \| `boolean`\>

Defined in: [apps/paracosm/src/engine/core/kernel.ts:89](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/kernel.ts#L89)

***

### startTime?

> `optional` **startTime**: `number`

Defined in: [apps/paracosm/src/engine/core/kernel.ts:78](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/core/kernel.ts#L78)
