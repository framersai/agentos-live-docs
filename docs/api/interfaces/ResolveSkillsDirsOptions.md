# Interface: ResolveSkillsDirsOptions

Defined in: [packages/agentos/src/skills/paths.ts:13](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/skills/paths.ts#L13)

## Properties

### cwd?

> `optional` **cwd**: `string`

Defined in: [packages/agentos/src/skills/paths.ts:15](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/skills/paths.ts#L15)

Base directory used to resolve relative --skills-dir entries. Default: process.cwd()

***

### env?

> `optional` **env**: `ProcessEnv`

Defined in: [packages/agentos/src/skills/paths.ts:19](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/skills/paths.ts#L19)

Environment variables to consult. Default: process.env

***

### includeAgentosSkillsDir?

> `optional` **includeAgentosSkillsDir**: `boolean`

Defined in: [packages/agentos/src/skills/paths.ts:22](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/skills/paths.ts#L22)

Include `AGENTOS_SKILLS_DIR` if set. Default: true

***

### includeCodexHomeSkillsDir?

> `optional` **includeCodexHomeSkillsDir**: `boolean`

Defined in: [packages/agentos/src/skills/paths.ts:24](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/skills/paths.ts#L24)

Include `$CODEX_HOME/skills` if CODEX_HOME is set. Default: true

***

### includeCwdSkillsDir?

> `optional` **includeCwdSkillsDir**: `boolean`

Defined in: [packages/agentos/src/skills/paths.ts:28](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/skills/paths.ts#L28)

Include `<cwd>/skills`. Default: true

***

### includeHomeCodexSkillsDir?

> `optional` **includeHomeCodexSkillsDir**: `boolean`

Defined in: [packages/agentos/src/skills/paths.ts:26](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/skills/paths.ts#L26)

Include `~/.codex/skills`. Default: true

***

### skillsDirFlag?

> `optional` **skillsDirFlag**: `string`

Defined in: [packages/agentos/src/skills/paths.ts:17](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/skills/paths.ts#L17)

Comma-separated list of additional skills directories (e.g. CLI flag).
