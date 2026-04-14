# Interface: ScenarioPolicies

Defined in: [types.ts:201](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L201)

Feature policies controlling what capabilities are enabled for a scenario.

## Properties

### bulletin

> **bulletin**: `object`

Defined in: [types.ts:204](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L204)

#### enabled

> **enabled**: `boolean`

***

### characterChat

> **characterChat**: `object`

Defined in: [types.ts:205](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L205)

#### enabled

> **enabled**: `boolean`

***

### liveSearch

> **liveSearch**: `object`

Defined in: [types.ts:203](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L203)

#### enabled

> **enabled**: `boolean`

#### mode

> **mode**: `"off"` \| `"manual"` \| `"auto"`

***

### sandbox

> **sandbox**: `object`

Defined in: [types.ts:206](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L206)

#### memoryMB

> **memoryMB**: `number`

#### timeoutMs

> **timeoutMs**: `number`

***

### toolForging

> **toolForging**: `object`

Defined in: [types.ts:202](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/types.ts#L202)

#### enabled

> **enabled**: `boolean`

#### requiredPerDepartment?

> `optional` **requiredPerDepartment**: `boolean`
