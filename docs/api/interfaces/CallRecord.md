# Interface: CallRecord

Defined in: [packages/agentos/src/channels/telephony/types.ts:193](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L193)

Full record of a voice call -- used for tracking, persistence, and status queries.

## Properties

### callId

> **callId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:195](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L195)

Unique call identifier (UUID).

***

### createdAt

> **createdAt**: `number`

Defined in: [packages/agentos/src/channels/telephony/types.ts:219](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L219)

Unix timestamp (ms) when the call was created.

***

### direction

> **direction**: [`CallDirection`](../type-aliases/CallDirection.md)

Defined in: [packages/agentos/src/channels/telephony/types.ts:203](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L203)

Call direction.

***

### endedAt?

> `optional` **endedAt**: `number`

Defined in: [packages/agentos/src/channels/telephony/types.ts:221](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L221)

Unix timestamp (ms) when the call reached a terminal state.

***

### errorMessage?

> `optional` **errorMessage**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:223](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L223)

Error message if state is 'error' or 'failed'.

***

### fromNumber

> **fromNumber**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:207](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L207)

E.164 phone number of the caller.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/channels/telephony/types.ts:225](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L225)

Provider-specific metadata.

***

### mode

> **mode**: [`CallMode`](../type-aliases/CallMode.md)

Defined in: [packages/agentos/src/channels/telephony/types.ts:205](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L205)

Call interaction mode.

***

### processedEventIds

> **processedEventIds**: `string`[]

Defined in: [packages/agentos/src/channels/telephony/types.ts:215](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L215)

IDs of webhook events already processed (idempotency).

***

### provider

> **provider**: [`VoiceProviderName`](../type-aliases/VoiceProviderName.md)

Defined in: [packages/agentos/src/channels/telephony/types.ts:199](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L199)

Which provider is handling this call.

***

### providerCallId?

> `optional` **providerCallId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:197](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L197)

Provider-assigned call ID (e.g., Twilio CallSid).

***

### seedId?

> `optional` **seedId**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:211](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L211)

Agent seed ID (if bound to a specific agent).

***

### state

> **state**: [`CallState`](../type-aliases/CallState.md)

Defined in: [packages/agentos/src/channels/telephony/types.ts:201](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L201)

Current state in the call lifecycle.

***

### streamSid?

> `optional` **streamSid**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:217](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L217)

Stream SID for media streams (Twilio-specific).

***

### toNumber

> **toNumber**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:209](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L209)

E.164 phone number being called.

***

### transcript

> **transcript**: [`TranscriptEntry`](TranscriptEntry.md)[]

Defined in: [packages/agentos/src/channels/telephony/types.ts:213](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L213)

Conversation transcript.
