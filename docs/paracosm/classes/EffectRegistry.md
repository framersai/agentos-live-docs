# Class: EffectRegistry

Defined in: [effect-registry.ts:33](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/effect-registry.ts#L33)

## Constructors

### Constructor

> **new EffectRegistry**(`categoryEffects`, `fallback?`): `EffectRegistry`

Defined in: [effect-registry.ts:37](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/effect-registry.ts#L37)

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

Defined in: [effect-registry.ts:49](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/effect-registry.ts#L49)

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

Defined in: [effect-registry.ts:45](https://github.com/framersai/paracosm/blob/eeeeb9a6203f1c9ce9727b1467c133273b1cca3f/src/engine/effect-registry.ts#L45)

#### Parameters

##### category

`string`

#### Returns

`Record`\<`string`, `number`\>
