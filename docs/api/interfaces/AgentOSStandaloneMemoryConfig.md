# Interface: AgentOSStandaloneMemoryConfig

Defined in: [packages/agentos/src/api/AgentOS.ts:362](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L362)

## Properties

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/api/AgentOS.ts:367](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L367)

Enable or disable standalone-memory integration.
Default: true when this block is provided.

***

### longTermRetriever?

> `optional` **longTermRetriever**: `boolean` \| [`StandaloneMemoryLongTermRetrieverOptions`](StandaloneMemoryLongTermRetrieverOptions.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:392](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L392)

When provided, AgentOS derives `longTermMemoryRetriever` from this
standalone memory backend unless one was already supplied explicitly.

***

### manageLifecycle?

> `optional` **manageLifecycle**: `boolean`

Defined in: [packages/agentos/src/api/AgentOS.ts:380](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L380)

If true, AgentOS closes the standalone memory backend during shutdown
unless `memoryTools.manageLifecycle` already owns that lifecycle.
Default: false.

***

### memory

> **memory**: `Pick`\<[`Memory`](../classes/Memory.md), `"remember"` \| `"recall"` \| `"forget"`\> & `Partial`\<`Pick`\<[`Memory`](../classes/Memory.md), `"createTools"` \| `"close"` \| `"health"`\>\>

Defined in: [packages/agentos/src/api/AgentOS.ts:372](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L372)

Standalone memory backend used to derive one or more AgentOS integrations.

***

### rollingSummarySink?

> `optional` **rollingSummarySink**: `boolean` \| [`StandaloneMemoryRollingSummarySinkOptions`](StandaloneMemoryRollingSummarySinkOptions.md)

Defined in: [packages/agentos/src/api/AgentOS.ts:398](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L398)

When provided, AgentOS derives `rollingSummaryMemorySink` from this
standalone memory backend unless one was already supplied explicitly.

***

### tools?

> `optional` **tools**: `boolean` \| `Omit`\<[`AgentOSMemoryToolsConfig`](AgentOSMemoryToolsConfig.md), `"memory"` \| `"enabled"` \| `"manageLifecycle"`\>

Defined in: [packages/agentos/src/api/AgentOS.ts:386](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/AgentOS.ts#L386)

When provided, AgentOS derives `memoryTools` from this standalone memory
backend unless `memoryTools` was already supplied explicitly.
