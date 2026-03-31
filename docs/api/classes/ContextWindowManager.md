# Class: ContextWindowManager

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:49](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L49)

## Constructors

### Constructor

> **new ContextWindowManager**(`managerConfig`): `ContextWindowManager`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:66](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L66)

#### Parameters

##### managerConfig

[`ContextWindowManagerConfig`](../interfaces/ContextWindowManagerConfig.md)

#### Returns

`ContextWindowManager`

## Accessors

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:316](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L316)

Whether infinite context is enabled.

##### Returns

`boolean`

## Methods

### addMessage()

> **addMessage**(`role`, `content`): `void`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:98](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L98)

Add a message to the tracked conversation.
Call this for every message (user, assistant, system, tool).

#### Parameters

##### role

`"user"` | `"tool"` | `"system"` | `"assistant"`

##### content

`string`

#### Returns

`void`

***

### beforeTurn()

> **beforeTurn**(`systemPromptTokens`, `memoryBudgetTokens`, `emotionalContext?`): `Promise`\<[`ContextMessage`](../interfaces/ContextMessage.md)[]\>

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:123](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L123)

Check whether compaction is needed and perform it if so.
Call this BEFORE assembling the prompt for the LLM.

Returns the current message list (potentially compacted).

#### Parameters

##### systemPromptTokens

`number`

##### memoryBudgetTokens

`number`

##### emotionalContext?

[`EmotionalContext`](../interfaces/EmotionalContext.md)

#### Returns

`Promise`\<[`ContextMessage`](../interfaces/ContextMessage.md)[]\>

***

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:302](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L302)

Reset all state.

#### Returns

`void`

***

### findTurnHistory()

> **findTurnHistory**(`turnIndex`): [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:260](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L260)

Find what happened to a specific turn.

#### Parameters

##### turnIndex

`number`

#### Returns

[`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### formatTransparencyReport()

> **formatTransparencyReport**(): `string`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:268](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L268)

Format a transparency report for the agent's context.
Includes: current state, recent compactions, summary chain.

#### Returns

`string`

***

### getCompactionHistory()

> **getCompactionHistory**(): readonly [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:227](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L227)

Get all compaction entries.

#### Returns

readonly [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### getConfig()

> **getConfig**(): `Readonly`\<[`InfiniteContextConfig`](../interfaces/InfiniteContextConfig.md)\>

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:321](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L321)

Current config (read-only).

#### Returns

`Readonly`\<[`InfiniteContextConfig`](../interfaces/InfiniteContextConfig.md)\>

***

### getCurrentTokens()

> **getCurrentTokens**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:205](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L205)

Current total token estimate across all messages.

#### Returns

`number`

***

### getCurrentTurn()

> **getCurrentTurn**(): `number`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:210](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L210)

Current turn index.

#### Returns

`number`

***

### getEngine()

> **getEngine**(): [`CompactionEngine`](CompactionEngine.md)

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:311](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L311)

Get the compaction engine (for strategy inspection/testing).

#### Returns

[`CompactionEngine`](CompactionEngine.md)

***

### getLog()

> **getLog**(): [`CompactionLog`](CompactionLog.md)

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:222](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L222)

Get the compaction log.

#### Returns

[`CompactionLog`](CompactionLog.md)

***

### getMessages()

> **getMessages**(): readonly [`ContextMessage`](../interfaces/ContextMessage.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:195](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L195)

Get all current messages (including any summary blocks).

#### Returns

readonly [`ContextMessage`](../interfaces/ContextMessage.md)[]

***

### getRawMessages()

> **getRawMessages**(): [`ContextMessage`](../interfaces/ContextMessage.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:200](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L200)

Get only the raw (non-compacted) messages.

#### Returns

[`ContextMessage`](../interfaces/ContextMessage.md)[]

***

### getStats()

> **getStats**(): [`ContextWindowStats`](../interfaces/ContextWindowStats.md)

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:232](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L232)

Get aggregate stats.

#### Returns

[`ContextWindowStats`](../interfaces/ContextWindowStats.md)

***

### getSummaryChain()

> **getSummaryChain**(): [`SummaryChainNode`](../interfaces/SummaryChainNode.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:250](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L250)

Get the summary chain for UI display.

#### Returns

[`SummaryChainNode`](../interfaces/SummaryChainNode.md)[]

***

### getSummaryContext()

> **getSummaryContext**(): `string`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:188](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L188)

Get the formatted summary chain for injection into the system prompt
or as a conversation-history block.

#### Returns

`string`

***

### searchHistory()

> **searchHistory**(`keyword`): [`CompactionEntry`](../interfaces/CompactionEntry.md)[]

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:255](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L255)

Search the compaction log for a keyword.

#### Parameters

##### keyword

`string`

#### Returns

[`CompactionEntry`](../interfaces/CompactionEntry.md)[]

***

### setMessages()

> **setMessages**(`messages`): `void`

Defined in: [packages/agentos/src/memory/pipeline/context/ContextWindowManager.ts:215](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/pipeline/context/ContextWindowManager.ts#L215)

Replace the message list (e.g. after external manipulation).

#### Parameters

##### messages

[`ContextMessage`](../interfaces/ContextMessage.md)[]

#### Returns

`void`
