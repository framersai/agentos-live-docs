# Interface: AgentMemoryProvider

Defined in: [packages/agentos/src/api/agent.ts:57](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L57)

Provider hook interface consumed by `agent()` for memory integration.

When provided on the agent config, `getContext` is called before each
LLM generation to inject retrieved memory into the system prompt, and
`observe` is called after each turn to encode the exchange for future
recall. Both hooks are optional — implementations may choose to provide
read-only or write-only memory behavior.

Auto-wires on every agent call path as of AgentOS 0.2.0: direct
`agent.stream()` / `.generate()` and `agent.session().send()` / `.stream()`
all invoke the hooks when the provider is present.

## Properties

### getContext()?

> `optional` **getContext**: (`text`, `opts?`) => `Promise`\<\{ `contextText?`: `string`; \} \| `null`\>

Defined in: [packages/agentos/src/api/agent.ts:67](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L67)

Retrieve a memory context block to prepend to the system prompt.

#### Parameters

##### text

`string`

The user input for the current turn.

##### opts?

Retrieval options. `tokenBudget` caps the memory block size.

###### tokenBudget?

`number`

#### Returns

`Promise`\<\{ `contextText?`: `string`; \} \| `null`\>

An object whose `contextText` (when present) is injected as a
  system message before the LLM call. Returning `null` or an object
  without `contextText` skips injection.

***

### observe()?

> `optional` **observe**: (`role`, `text`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/api/agent.ts:82](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L82)

Record an observation of a turn exchange.

Invoked twice per turn (`role: 'user'` with the input, then
`role: 'assistant'` with the reply) as fire-and-forget. Rejections
are swallowed so memory-backend errors do not break generation.

#### Parameters

##### role

Whether the content came from the user or assistant.

`"user"` | `"assistant"`

##### text

`string`

Plain text content of the turn.

#### Returns

`Promise`\<`void`\>
