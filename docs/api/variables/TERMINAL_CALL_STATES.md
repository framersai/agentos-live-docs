# Variable: TERMINAL\_CALL\_STATES

> `const` **TERMINAL\_CALL\_STATES**: `Set`\<[`CallState`](../type-aliases/CallState.md)\>

Defined in: [packages/agentos/src/channels/telephony/types.ts:105](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L105)

Set of terminal call states -- once reached, no further transitions are
allowed by the [CallManager](../classes/CallManager.md) state machine.

Used for guard checks: `if (TERMINAL_CALL_STATES.has(call.state)) return;`
