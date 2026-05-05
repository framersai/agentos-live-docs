# Interface: ScenarioPolicies

Defined in: [apps/paracosm/src/engine/types.ts:225](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L225)

Feature policies controlling what capabilities are enabled for a scenario.

## Properties

### bulletin

> **bulletin**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:228](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L228)

#### enabled

> **enabled**: `boolean`

***

### characterChat

> **characterChat**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:229](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L229)

#### enabled

> **enabled**: `boolean`

***

### liveSearch

> **liveSearch**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:227](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L227)

#### enabled

> **enabled**: `boolean`

#### mode

> **mode**: `"off"` \| `"manual"` \| `"auto"`

***

### sandbox

> **sandbox**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:230](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L230)

#### memoryMB

> **memoryMB**: `number`

#### timeoutMs

> **timeoutMs**: `number`

***

### toolForging

> **toolForging**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:226](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/engine/types.ts#L226)

#### enabled

> **enabled**: `boolean`

#### requiredPerDepartment?

> `optional` **requiredPerDepartment**: `boolean`
