# Variable: TERMINAL\_CALL\_STATES

> `const` **TERMINAL\_CALL\_STATES**: `Set`\<[`CallState`](../type-aliases/CallState.md)\>

Defined in: [packages/agentos/src/channels/telephony/types.ts:105](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/types.ts#L105)

Set of terminal call states -- once reached, no further transitions are
allowed by the [CallManager](../classes/CallManager.md) state machine.

Used for guard checks: `if (TERMINAL_CALL_STATES.has(call.state)) return;`
