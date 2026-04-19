# Variable: TERMINAL\_CALL\_STATES

> `const` **TERMINAL\_CALL\_STATES**: `Set`\<[`CallState`](../type-aliases/CallState.md)\>

Defined in: [packages/agentos/src/channels/telephony/types.ts:105](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/telephony/types.ts#L105)

Set of terminal call states -- once reached, no further transitions are
allowed by the [CallManager](../classes/CallManager.md) state machine.

Used for guard checks: `if (TERMINAL_CALL_STATES.has(call.state)) return;`
