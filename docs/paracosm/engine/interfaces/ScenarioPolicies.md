# Interface: ScenarioPolicies

Defined in: [apps/paracosm/src/engine/types.ts:208](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L208)

Feature policies controlling what capabilities are enabled for a scenario.

## Properties

### bulletin

> **bulletin**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:211](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L211)

#### enabled

> **enabled**: `boolean`

***

### characterChat

> **characterChat**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:212](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L212)

#### enabled

> **enabled**: `boolean`

***

### liveSearch

> **liveSearch**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:210](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L210)

#### enabled

> **enabled**: `boolean`

#### mode

> **mode**: `"off"` \| `"manual"` \| `"auto"`

***

### sandbox

> **sandbox**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:213](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L213)

#### memoryMB

> **memoryMB**: `number`

#### timeoutMs

> **timeoutMs**: `number`

***

### toolForging

> **toolForging**: `object`

Defined in: [apps/paracosm/src/engine/types.ts:209](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/engine/types.ts#L209)

#### enabled

> **enabled**: `boolean`

#### requiredPerDepartment?

> `optional` **requiredPerDepartment**: `boolean`
