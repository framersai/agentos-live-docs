# Interface: ResolvedEconomicsProfile

Defined in: runtime/economics-profile.ts:10

## Properties

### batch

> **batch**: `object`

Defined in: runtime/economics-profile.ts:15

#### maxConcurrency

> **maxConcurrency**: `number`

***

### compileSignature

> **compileSignature**: `string`

Defined in: runtime/economics-profile.ts:16

***

### id

> **id**: [`SimulationEconomicsProfileId`](../type-aliases/SimulationEconomicsProfileId.md)

Defined in: runtime/economics-profile.ts:11

***

### models

> **models**: [`SimulationModelConfig`](../../engine/interfaces/SimulationModelConfig.md)

Defined in: runtime/economics-profile.ts:12

***

### search

> **search**: `object`

Defined in: runtime/economics-profile.ts:14

#### maxSearches

> **maxSearches**: `number`

#### mode

> **mode**: `"off"` \| `"gated"` \| `"adaptive"` \| `"aggressive"`

***

### verdict

> **verdict**: `object`

Defined in: runtime/economics-profile.ts:13

#### mode

> **mode**: `"balanced"` \| `"skip"` \| `"cheap"` \| `"flagship"`
