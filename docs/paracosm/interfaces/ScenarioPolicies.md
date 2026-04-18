# Interface: ScenarioPolicies

Defined in: [types.ts:208](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L208)

Feature policies controlling what capabilities are enabled for a scenario.

## Properties

### bulletin

> **bulletin**: `object`

Defined in: [types.ts:211](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L211)

#### enabled

> **enabled**: `boolean`

***

### characterChat

> **characterChat**: `object`

Defined in: [types.ts:212](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L212)

#### enabled

> **enabled**: `boolean`

***

### liveSearch

> **liveSearch**: `object`

Defined in: [types.ts:210](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L210)

#### enabled

> **enabled**: `boolean`

#### mode

> **mode**: `"off"` \| `"manual"` \| `"auto"`

***

### sandbox

> **sandbox**: `object`

Defined in: [types.ts:213](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L213)

#### memoryMB

> **memoryMB**: `number`

#### timeoutMs

> **timeoutMs**: `number`

***

### toolForging

> **toolForging**: `object`

Defined in: [types.ts:209](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/types.ts#L209)

#### enabled

> **enabled**: `boolean`

#### requiredPerDepartment?

> `optional` **requiredPerDepartment**: `boolean`
