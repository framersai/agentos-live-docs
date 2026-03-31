# Interface: AgentOSCapabilityDiscoverySources

Defined in: [packages/agentos/src/api/AgentOS.ts:292](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/AgentOS.ts#L292)

## Properties

### channels?

> `optional` **channels**: `object`[]

Defined in: [packages/agentos/src/api/AgentOS.ts:295](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/AgentOS.ts#L295)

#### capabilities?

> `optional` **capabilities**: `string`[]

#### description

> **description**: `string`

#### displayName

> **displayName**: `string`

#### platform

> **platform**: `string`

#### tier?

> `optional` **tier**: `string`

***

### extensions?

> `optional` **extensions**: `object`[]

Defined in: [packages/agentos/src/api/AgentOS.ts:294](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/AgentOS.ts#L294)

#### available?

> `optional` **available**: `boolean`

#### category

> **category**: `string`

#### description

> **description**: `string`

#### displayName

> **displayName**: `string`

#### id

> **id**: `string`

#### name

> **name**: `string`

#### requiredSecrets?

> `optional` **requiredSecrets**: `string`[]

***

### manifests?

> `optional` **manifests**: `CapabilityDescriptor`[]

Defined in: [packages/agentos/src/api/AgentOS.ts:296](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/AgentOS.ts#L296)

***

### presetCoOccurrences?

> `optional` **presetCoOccurrences**: `PresetCoOccurrence`[]

Defined in: [packages/agentos/src/api/AgentOS.ts:297](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/AgentOS.ts#L297)

***

### skills?

> `optional` **skills**: `object`[]

Defined in: [packages/agentos/src/api/AgentOS.ts:293](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/AgentOS.ts#L293)

#### category?

> `optional` **category**: `string`

#### content

> **content**: `string`

#### description

> **description**: `string`

#### metadata?

> `optional` **metadata**: `object`

##### metadata.primaryEnv?

> `optional` **primaryEnv**: `string`

##### metadata.requires?

> `optional` **requires**: `object`

##### metadata.requires.bins?

> `optional` **bins**: `string`[]

#### name

> **name**: `string`

#### requiredSecrets?

> `optional` **requiredSecrets**: `string`[]

#### requiredTools?

> `optional` **requiredTools**: `string`[]

#### sourcePath?

> `optional` **sourcePath**: `string`

#### tags?

> `optional` **tags**: `string`[]
