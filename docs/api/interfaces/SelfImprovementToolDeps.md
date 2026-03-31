# Interface: SelfImprovementToolDeps

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:45](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L45)

Dependencies required to construct the four self-improvement tools.

Callers provide runtime hooks for personality access, skill management,
tool execution, and optional memory storage. The engine uses these to
wire each tool without hard-coupling to specific service implementations.

## Properties

### executeTool()

> **executeTool**: (`name`, `args`, `context?`) => `Promise`\<`unknown`\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:79](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L79)

Executes a registered tool by name with the given arguments.

#### Parameters

##### name

`string`

##### args

`unknown`

##### context?

[`ToolExecutionContext`](ToolExecutionContext.md)

#### Returns

`Promise`\<`unknown`\>

***

### getActiveSkills()

> **getActiveSkills**: (`context?`) => `object`[]

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:56](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L56)

Returns the agent's currently active skills.

#### Parameters

##### context?

[`ToolExecutionContext`](ToolExecutionContext.md)

#### Returns

`object`[]

***

### getLockedSkills()

> **getLockedSkills**: () => `string`[]

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:61](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L61)

Returns skill IDs that may not be disabled (core skills).

#### Returns

`string`[]

***

### getPersonality()

> **getPersonality**: () => `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:47](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L47)

Returns the current HEXACO personality trait values as a trait→value map.

#### Returns

`Record`\<`string`, `number`\>

***

### getSessionParam()?

> `optional` **getSessionParam**: (`param`, `context`) => `unknown`

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:92](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L92)

Optional host-level getter for session-scoped runtime params such as temperature.

#### Parameters

##### param

`string`

##### context

[`ToolExecutionContext`](ToolExecutionContext.md)

#### Returns

`unknown`

***

### listTools()

> **listTools**: () => `string`[]

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:86](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L86)

Returns the names of all currently registered tools.

#### Returns

`string`[]

***

### loadSkill()

> **loadSkill**: (`id`, `context?`) => `Promise`\<\{ `category`: `string`; `name`: `string`; `skillId`: `string`; \}\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:64](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L64)

Dynamically loads a skill by ID and returns its metadata.

#### Parameters

##### id

`string`

##### context?

[`ToolExecutionContext`](ToolExecutionContext.md)

#### Returns

`Promise`\<\{ `category`: `string`; `name`: `string`; `skillId`: `string`; \}\>

***

### mutationStore?

> `optional` **mutationStore**: [`PersonalityMutationStore`](../classes/PersonalityMutationStore.md)

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:53](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L53)

Durable store for personality mutations (used by AdaptPersonalityTool for persistence).

***

### searchSkills()

> **searchSkills**: (`query`, `context?`) => `object`[]

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:73](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L73)

Searches the skill registry by query string, returning matching skill metadata.

#### Parameters

##### query

`string`

##### context?

[`ToolExecutionContext`](ToolExecutionContext.md)

#### Returns

`object`[]

***

### setPersonality()

> **setPersonality**: (`trait`, `value`) => `void`

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:50](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L50)

Sets a single HEXACO personality trait to the given value (already clamped).

#### Parameters

##### trait

`string`

##### value

`number`

#### Returns

`void`

***

### setSessionParam()?

> `optional` **setSessionParam**: (`param`, `value`, `context`) => `void`

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:98](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L98)

Optional host-level setter for session-scoped runtime params such as temperature.

#### Parameters

##### param

`string`

##### value

`unknown`

##### context

[`ToolExecutionContext`](ToolExecutionContext.md)

#### Returns

`void`

***

### storeMemory()?

> `optional` **storeMemory**: (`trace`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:89](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L89)

Optional callback for persisting self-improvement trace memories.

#### Parameters

##### trace

###### content

`string`

###### scope

`string`

###### tags

`string`[]

###### type

`string`

#### Returns

`Promise`\<`void`\>

***

### unloadSkill()

> **unloadSkill**: (`id`, `context?`) => `void`

Defined in: [packages/agentos/src/emergent/EmergentCapabilityEngine.ts:70](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/emergent/EmergentCapabilityEngine.ts#L70)

Unloads (disables) a previously loaded skill.

#### Parameters

##### id

`string`

##### context?

[`ToolExecutionContext`](ToolExecutionContext.md)

#### Returns

`void`
