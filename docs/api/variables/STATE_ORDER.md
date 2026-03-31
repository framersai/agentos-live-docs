# Variable: STATE\_ORDER

> `const` **STATE\_ORDER**: readonly [`CallState`](../type-aliases/CallState.md)[]

Defined in: [packages/agentos/src/channels/telephony/types.ts:133](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L133)

Non-terminal state order for monotonic transition enforcement.

The [CallManager](../classes/CallManager.md) only allows a forward transition when
`STATE_ORDER.indexOf(newState) > STATE_ORDER.indexOf(currentState)`.
This prevents impossible regressions like `answered` -> `ringing`.
