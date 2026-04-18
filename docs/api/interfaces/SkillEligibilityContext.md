# Interface: SkillEligibilityContext

Defined in: [packages/agentos/src/skills/types.ts:213](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L213)

Context for evaluating skill eligibility.

## Properties

### hasAnyBin()

> **hasAnyBin**: (`bins`) => `boolean`

Defined in: [packages/agentos/src/skills/types.ts:221](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L221)

Check if any of the binaries are available

#### Parameters

##### bins

`string`[]

#### Returns

`boolean`

***

### hasBin()

> **hasBin**: (`bin`) => `boolean`

Defined in: [packages/agentos/src/skills/types.ts:218](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L218)

Check if a binary is available

#### Parameters

##### bin

`string`

#### Returns

`boolean`

***

### hasEnv()?

> `optional` **hasEnv**: (`envVar`) => `boolean`

Defined in: [packages/agentos/src/skills/types.ts:224](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L224)

Check if an environment variable is set

#### Parameters

##### envVar

`string`

#### Returns

`boolean`

***

### note?

> `optional` **note**: `string`

Defined in: [packages/agentos/src/skills/types.ts:227](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L227)

Additional note for filtering

***

### platforms

> **platforms**: `string`[]

Defined in: [packages/agentos/src/skills/types.ts:215](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/skills/types.ts#L215)

Current platform(s)
