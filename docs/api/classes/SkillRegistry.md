# Class: SkillRegistry

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:54](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L54)

Skill Registry for managing loaded skills at runtime.

## Constructors

### Constructor

> **new SkillRegistry**(`config?`): `SkillRegistry`

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:59](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L59)

#### Parameters

##### config?

[`SkillsConfig`](../interfaces/SkillsConfig.md)

#### Returns

`SkillRegistry`

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:142](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L142)

Get the count of registered skills.

##### Returns

`number`

## Methods

### buildCommandSpecs()

> **buildCommandSpecs**(`options?`): [`SkillCommandSpec`](../interfaces/SkillCommandSpec.md)[]

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:346](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L346)

Build command specifications for all skills.

#### Parameters

##### options?

###### eligibility?

[`SkillEligibilityContext`](../interfaces/SkillEligibilityContext.md)

###### platform?

`string`

###### reservedNames?

`Set`\<`string`\>

#### Returns

[`SkillCommandSpec`](../interfaces/SkillCommandSpec.md)[]

***

### buildPrompt()

> **buildPrompt**(`entries`): `string`

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:321](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L321)

Format skills into a prompt for LLM context.

#### Parameters

##### entries

[`SkillEntry`](../interfaces/SkillEntry.md)[]

#### Returns

`string`

***

### buildSnapshot()

> **buildSnapshot**(`options?`): [`SkillSnapshot`](../interfaces/SkillSnapshot.md)

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:261](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L261)

Build a skill snapshot for agent context.

#### Parameters

##### options?

###### eligibility?

[`SkillEligibilityContext`](../interfaces/SkillEligibilityContext.md)

###### filter?

`string`[]

###### platform?

`string`

###### runtimeConfig?

`Record`\<`string`, `unknown`\>

Optional config object used to evaluate `requires.config` paths.

###### strict?

`boolean`

If true, apply OpenClaw-style eligibility gating (OS/bins/anyBins/env/config).
This is useful for "only show runnable skills" behavior.

#### Returns

[`SkillSnapshot`](../interfaces/SkillSnapshot.md)

***

### checkAllRequirements()

> **checkAllRequirements**(`hasBin`): `Map`\<`string`, \{ `met`: `boolean`; `missing`: `string`[]; \}\>

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:387](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L387)

Check requirements for all registered skills.

#### Parameters

##### hasBin

(`bin`) => `boolean`

#### Returns

`Map`\<`string`, \{ `met`: `boolean`; `missing`: `string`[]; \}\>

***

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:116](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L116)

Clear all registered skills.

#### Returns

`void`

***

### filterByEligibility()

> **filterByEligibility**(`context`): [`SkillEntry`](../interfaces/SkillEntry.md)[]

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:236](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L236)

Get skills filtered by eligibility context.

#### Parameters

##### context

[`SkillEligibilityContext`](../interfaces/SkillEligibilityContext.md)

#### Returns

[`SkillEntry`](../interfaces/SkillEntry.md)[]

***

### filterByPlatform()

> **filterByPlatform**(`platform`): [`SkillEntry`](../interfaces/SkillEntry.md)[]

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:229](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L229)

Get skills filtered by platform.

#### Parameters

##### platform

`string`

#### Returns

[`SkillEntry`](../interfaces/SkillEntry.md)[]

***

### getByName()

> **getByName**(`name`): [`SkillEntry`](../interfaces/SkillEntry.md) \| `undefined`

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:128](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L128)

Get a skill by name.

#### Parameters

##### name

`string`

#### Returns

[`SkillEntry`](../interfaces/SkillEntry.md) \| `undefined`

***

### getModelInvocableSkills()

> **getModelInvocableSkills**(): [`SkillEntry`](../interfaces/SkillEntry.md)[]

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:250](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L250)

Get skills that can be invoked by the model.

#### Returns

[`SkillEntry`](../interfaces/SkillEntry.md)[]

***

### getSkillsWithMissingRequirements()

> **getSkillsWithMissingRequirements**(`hasBin`): `object`[]

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:400](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L400)

Get skills with unmet requirements.

#### Parameters

##### hasBin

(`bin`) => `boolean`

#### Returns

`object`[]

***

### getUserInvocableSkills()

> **getUserInvocableSkills**(): [`SkillEntry`](../interfaces/SkillEntry.md)[]

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:243](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L243)

Get skills that can be invoked by users.

#### Returns

[`SkillEntry`](../interfaces/SkillEntry.md)[]

***

### has()

> **has**(`name`): `boolean`

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:149](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L149)

Check if a skill is registered.

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### listAll()

> **listAll**(): [`SkillEntry`](../interfaces/SkillEntry.md)[]

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:135](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L135)

List all registered skills.

#### Returns

[`SkillEntry`](../interfaces/SkillEntry.md)[]

***

### loadFromDir()

> **loadFromDir**(`dir`, `options?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:173](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L173)

Load skills from a single directory, optionally tagging the source.

#### Parameters

##### dir

`string`

##### options?

###### source?

`string`

#### Returns

`Promise`\<`number`\>

***

### loadFromDirs()

> **loadFromDirs**(`dirs`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:160](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L160)

Load skills from one or more directories.

#### Parameters

##### dirs

`string`[]

#### Returns

`Promise`\<`number`\>

***

### register()

> **register**(`entry`): `boolean`

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:72](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L72)

Register a skill entry.

#### Parameters

##### entry

[`SkillEntry`](../interfaces/SkillEntry.md)

#### Returns

`boolean`

Whether the skill was registered (false if already exists)

***

### reload()

> **reload**(`options`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:190](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L190)

Reload all skills from configured directories.

#### Parameters

##### options

[`SkillRegistryOptions`](../interfaces/SkillRegistryOptions.md)

#### Returns

`Promise`\<`number`\>

***

### unregister()

> **unregister**(`name`): `boolean`

Defined in: [packages/agentos/src/skills/SkillRegistry.ts:105](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/skills/SkillRegistry.ts#L105)

Unregister a skill by name.

#### Parameters

##### name

`string`

#### Returns

`boolean`
