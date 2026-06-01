# Variable: STATE\_ORDER

> `const` **STATE\_ORDER**: readonly [`CallState`](../type-aliases/CallState.md)[]

Defined in: [packages/agentos/src/io/channels/telephony/types.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/types.ts#L133)

Non-terminal state order for monotonic transition enforcement.

The [CallManager](../classes/CallManager.md) only allows a forward transition when
`STATE_ORDER.indexOf(newState) > STATE_ORDER.indexOf(currentState)`.
This prevents impossible regressions like `answered` -> `ringing`.
