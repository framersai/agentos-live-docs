# Interface: SkillsConfig

Defined in: [packages/agentos/src/skills/types.ts:299](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/skills/types.ts#L299)

Top-level skills configuration.

## Properties

### allowBundled?

> `optional` **allowBundled**: `string`[]

Defined in: [packages/agentos/src/skills/types.ts:301](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/skills/types.ts#L301)

Allowlist for bundled skills

***

### entries?

> `optional` **entries**: `Record`\<`string`, [`SkillConfig`](SkillConfig.md)\>

Defined in: [packages/agentos/src/skills/types.ts:310](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/skills/types.ts#L310)

Per-skill configurations

***

### install?

> `optional` **install**: [`SkillsInstallPreferences`](SkillsInstallPreferences.md)

Defined in: [packages/agentos/src/skills/types.ts:307](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/skills/types.ts#L307)

Install preferences

***

### load?

> `optional` **load**: [`SkillsLoadConfig`](SkillsLoadConfig.md)

Defined in: [packages/agentos/src/skills/types.ts:304](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/skills/types.ts#L304)

Loading configuration
