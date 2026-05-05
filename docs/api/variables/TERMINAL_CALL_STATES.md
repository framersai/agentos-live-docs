# Variable: TERMINAL\_CALL\_STATES

> `const` **TERMINAL\_CALL\_STATES**: `Set`\<[`CallState`](../type-aliases/CallState.md)\>

Defined in: [packages/agentos/src/channels/telephony/types.ts:105](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/channels/telephony/types.ts#L105)

Set of terminal call states -- once reached, no further transitions are
allowed by the [CallManager](../classes/CallManager.md) state machine.

Used for guard checks: `if (TERMINAL_CALL_STATES.has(call.state)) return;`
