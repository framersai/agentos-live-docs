# Class: CallManager

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:67](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L67)

## Constructors

### Constructor

> **new CallManager**(`config`): `CallManager`

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:75](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L75)

#### Parameters

##### config

[`VoiceCallConfig`](../interfaces/VoiceCallConfig.md)

#### Returns

`CallManager`

## Methods

### dispose()

> **dispose**(): `void`

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:552](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L552)

Clean up all state (for shutdown).

#### Returns

`void`

***

### findCallByProviderCallId()

> **findCallByProviderCallId**(`providerCallId`): [`CallRecord`](../interfaces/CallRecord.md) \| `undefined`

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:422](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L422)

Find a call by provider-assigned call ID.

#### Parameters

##### providerCallId

`string`

#### Returns

[`CallRecord`](../interfaces/CallRecord.md) \| `undefined`

***

### getActiveCalls()

> **getActiveCalls**(): [`CallRecord`](../interfaces/CallRecord.md)[]

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:434](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L434)

Get all active (non-terminal) calls.

#### Returns

[`CallRecord`](../interfaces/CallRecord.md)[]

***

### getCall()

> **getCall**(`callId`): [`CallRecord`](../interfaces/CallRecord.md) \| `undefined`

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:417](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L417)

Get a call by internal ID.

#### Parameters

##### callId

`string`

#### Returns

[`CallRecord`](../interfaces/CallRecord.md) \| `undefined`

***

### getProvider()

> **getProvider**(`name?`): [`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md) \| `undefined`

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:91](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L91)

Get a registered provider by name.

#### Parameters

##### name?

[`VoiceProviderName`](../type-aliases/VoiceProviderName.md)

#### Returns

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md) \| `undefined`

***

### handleInboundCall()

> **handleInboundCall**(`params`): [`CallRecord`](../interfaces/CallRecord.md) \| `null`

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:444](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L444)

Handle an inbound call based on the configured policy.
Creates a CallRecord if the call is accepted.

#### Parameters

##### params

###### fromNumber

`string`

###### provider

[`VoiceProviderName`](../type-aliases/VoiceProviderName.md)

###### providerCallId

`string`

###### seedId?

`string`

###### toNumber

`string`

#### Returns

[`CallRecord`](../interfaces/CallRecord.md) \| `null`

***

### hangupCall()

> **hangupCall**(`callId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:216](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L216)

Hang up a call. Transitions to 'hangup-bot' terminal state.

#### Parameters

##### callId

`string`

#### Returns

`Promise`\<`void`\>

***

### initiateCall()

> **initiateCall**(`params`): `Promise`\<[`CallRecord`](../interfaces/CallRecord.md)\>

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:133](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L133)

Initiate an outbound phone call.

Creates a CallRecord in 'initiated' state, delegates to the provider
to place the call, and returns the internal call ID.

#### Parameters

##### params

###### fromNumber?

`string`

###### message?

`string`

###### mode?

[`CallMode`](../type-aliases/CallMode.md)

###### providerName?

[`VoiceProviderName`](../type-aliases/VoiceProviderName.md)

###### seedId?

`string`

###### toNumber

`string`

#### Returns

`Promise`\<[`CallRecord`](../interfaces/CallRecord.md)\>

***

### on()

> **on**(`handler`): () => `void`

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:102](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L102)

Register a handler for call events.

#### Parameters

##### handler

[`CallManagerEventHandler`](../type-aliases/CallManagerEventHandler.md)

#### Returns

Unsubscribe function.

> (): `void`

##### Returns

`void`

***

### processNormalizedEvent()

> **processNormalizedEvent**(`event`): `void`

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:281](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L281)

Process a single normalized call event.

#### Parameters

##### event

[`NormalizedCallEvent`](../type-aliases/NormalizedCallEvent.md)

#### Returns

`void`

***

### processWebhook()

> **processWebhook**(`providerName`, `ctx`): `void`

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:256](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L256)

Process an incoming webhook from a telephony provider.

Verifies the signature, parses events, and applies state transitions.
Idempotent — duplicate event IDs are silently skipped.

#### Parameters

##### providerName

[`VoiceProviderName`](../type-aliases/VoiceProviderName.md)

##### ctx

[`WebhookContext`](../interfaces/WebhookContext.md)

#### Returns

`void`

***

### registerProvider()

> **registerProvider**(`provider`): `void`

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:84](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L84)

Register a telephony provider.

#### Parameters

##### provider

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md)

#### Returns

`void`

***

### speakText()

> **speakText**(`callId`, `text`): `void`

Defined in: [packages/agentos/src/channels/telephony/CallManager.ts:239](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/CallManager.ts#L239)

Add a bot speech entry to the transcript and transition to speaking.

#### Parameters

##### callId

`string`

##### text

`string`

#### Returns

`void`
