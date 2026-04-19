# Interface: AgentOSRuntimeSnapshot

Defined in: [packages/agentos/src/api/AgentOS.ts:722](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L722)

## Properties

### conversations

> **conversations**: `object`

Defined in: [packages/agentos/src/api/AgentOS.ts:742](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L742)

#### activeCount

> **activeCount**: `number`

#### items

> **items**: [`AgentOSActiveConversationSnapshot`](AgentOSActiveConversationSnapshot.md)[]

***

### extensions

> **extensions**: `object`

Defined in: [packages/agentos/src/api/AgentOS.ts:736](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L736)

#### guardrailCount

> **guardrailCount**: `number`

#### loadedPacks

> **loadedPacks**: `string`[]

#### toolCount

> **toolCount**: `number`

#### workflowCount

> **workflowCount**: `number`

***

### gmis

> **gmis**: `object`

Defined in: [packages/agentos/src/api/AgentOS.ts:746](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L746)

#### activeCount

> **activeCount**: `number`

#### items

> **items**: [`AgentOSActiveGMISnapshot`](AgentOSActiveGMISnapshot.md)[]

***

### initialized

> **initialized**: `boolean`

Defined in: [packages/agentos/src/api/AgentOS.ts:723](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L723)

***

### providers

> **providers**: `object`

Defined in: [packages/agentos/src/api/AgentOS.ts:732](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L732)

#### configured

> **configured**: `string`[]

#### defaultProvider?

> `optional` **defaultProvider**: `string` \| `null`

***

### services

> **services**: `object`

Defined in: [packages/agentos/src/api/AgentOS.ts:724](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/AgentOS.ts#L724)

#### conversationManager

> **conversationManager**: `boolean`

#### extensionManager

> **extensionManager**: `boolean`

#### modelProviderManager

> **modelProviderManager**: `boolean`

#### retrievalAugmentor

> **retrievalAugmentor**: `boolean`

#### toolOrchestrator

> **toolOrchestrator**: `boolean`

#### workflowEngine

> **workflowEngine**: `boolean`
