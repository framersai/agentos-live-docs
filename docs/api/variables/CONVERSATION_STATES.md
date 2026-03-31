# Variable: CONVERSATION\_STATES

> `const` **CONVERSATION\_STATES**: `Set`\<[`CallState`](../type-aliases/CallState.md)\>

Defined in: [packages/agentos/src/channels/telephony/types.ts:124](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/types.ts#L124)

States that can cycle during multi-turn conversations.

The state machine allows free transitions between these two states so that
the agent can alternate between speaking and listening without violating
monotonic ordering.
