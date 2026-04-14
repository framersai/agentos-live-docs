# Class: EffectRegistry

Defined in: [effect-registry.ts:16](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/effect-registry.ts#L16)

## Constructors

### Constructor

> **new EffectRegistry**(`categoryEffects`, `fallback?`): `EffectRegistry`

Defined in: [effect-registry.ts:20](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/effect-registry.ts#L20)

#### Parameters

##### categoryEffects

`Record`\<`string`, `Record`\<`string`, `number`\>\>

##### fallback?

`Record`\<`string`, `number`\> = `...`

#### Returns

`EffectRegistry`

## Methods

### applyOutcome()

> **applyOutcome**(`category`, `outcome`, `modifiers`): `Record`\<`string`, `number`\>

Defined in: [effect-registry.ts:32](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/effect-registry.ts#L32)

#### Parameters

##### category

`string`

##### outcome

`TurnOutcome`

##### modifiers

[`OutcomeModifiers`](../interfaces/OutcomeModifiers.md)

#### Returns

`Record`\<`string`, `number`\>

***

### getBaseEffect()

> **getBaseEffect**(`category`): `Record`\<`string`, `number`\>

Defined in: [effect-registry.ts:28](https://github.com/framersai/paracosm/blob/ba2b881292b55c8a966fdea8cae3757f12921fdc/src/engine/effect-registry.ts#L28)

#### Parameters

##### category

`string`

#### Returns

`Record`\<`string`, `number`\>
