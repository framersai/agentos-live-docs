# Class: TelnyxVoiceProvider

Defined in: [packages/agentos/src/channels/telephony/providers/telnyx.ts:150](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/telnyx.ts#L150)

Telnyx voice call provider.

Uses the Telnyx Call Control v2 API for outbound call initiation and
in-call actions (hangup, speak). Webhook verification uses Ed25519 public
key signing.

## Example

```typescript
const provider = new TelnyxVoiceProvider({
  apiKey:       process.env.TELNYX_API_KEY!,
  connectionId: process.env.TELNYX_CONNECTION_ID!,
  publicKey:    process.env.TELNYX_PUBLIC_KEY,   // optional
});
```

## Implements

- [`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md)

## Constructors

### Constructor

> **new TelnyxVoiceProvider**(`config`): `TelnyxVoiceProvider`

Defined in: [packages/agentos/src/channels/telephony/providers/telnyx.ts:169](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/telnyx.ts#L169)

#### Parameters

##### config

`TelnyxVoiceProviderConfig`

Telnyx credentials and optional overrides.

#### Returns

`TelnyxVoiceProvider`

## Properties

### name

> `readonly` **name**: `"telnyx"`

Defined in: [packages/agentos/src/channels/telephony/providers/telnyx.ts:152](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/telnyx.ts#L152)

Provider identifier, always `'telnyx'`.

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`name`](../interfaces/IVoiceCallProvider.md#name)

## Methods

### hangupCall()

> **hangupCall**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/telephony/providers/telnyx.ts:358](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/telnyx.ts#L358)

Hang up an active call via the Telnyx Call Control hangup action.

POSTs an empty JSON body to `/v2/calls/{call_control_id}/actions/hangup`.
Telnyx will terminate the call and fire a `call.hangup` webhook.

#### Parameters

##### input

[`HangupCallInput`](../interfaces/HangupCallInput.md)

Contains the Telnyx `call_control_id` to hang up.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`hangupCall`](../interfaces/IVoiceCallProvider.md#hangupcall)

***

### initiateCall()

> **initiateCall**(`input`): `Promise`\<[`InitiateCallResult`](../interfaces/InitiateCallResult.md)\>

Defined in: [packages/agentos/src/channels/telephony/providers/telnyx.ts:324](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/telnyx.ts#L324)

Initiate an outbound call via the Telnyx Call Control v2 API.

POSTs to `/v2/calls` with a JSON body containing the `connection_id`,
phone numbers, and webhook URL. The `mediaStreamUrl` (if provided) is
stored internally for use after the call is answered -- it is NOT sent
in the initial call creation request because Telnyx requires
`streaming_start` to be issued as a separate action after `call.answered`.

#### Parameters

##### input

[`InitiateCallInput`](../interfaces/InitiateCallInput.md)

Call initiation parameters (from/to numbers, webhook URL).

#### Returns

`Promise`\<[`InitiateCallResult`](../interfaces/InitiateCallResult.md)\>

Result containing the Telnyx `call_control_id` on success.

#### Throws

Never throws; returns `{ success: false, error: '...' }` on failure.

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`initiateCall`](../interfaces/IVoiceCallProvider.md#initiatecall)

***

### parseWebhookEvent()

> **parseWebhookEvent**(`ctx`): [`WebhookParseResult`](../interfaces/WebhookParseResult.md)

Defined in: [packages/agentos/src/channels/telephony/providers/telnyx.ts:250](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/telnyx.ts#L250)

Parse a Telnyx webhook JSON body into normalized [NormalizedCallEvent](../type-aliases/NormalizedCallEvent.md)s.

Telnyx sends all webhook payloads as JSON with a `data.event_type`
discriminant field. The `data.payload` object contains call-specific
fields like `call_control_id`, `hangup_cause`, `digit`, and `result`.

## Hangup cause mapping

Telnyx's `call.hangup` event includes a `hangup_cause` field that must
be inspected to determine whether the user or the system terminated
the call:
- `normal_clearing` / `user_busy` / `originator_cancel` -> `call-hangup-user`
- All other causes (e.g., `call_rejected`, `unallocated_number`) -> `call-completed`

#### Parameters

##### ctx

[`WebhookContext`](../interfaces/WebhookContext.md)

Raw webhook request context.

#### Returns

[`WebhookParseResult`](../interfaces/WebhookParseResult.md)

Parsed result containing zero or more normalized events.

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`parseWebhookEvent`](../interfaces/IVoiceCallProvider.md#parsewebhookevent)

***

### playTts()

> **playTts**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/telephony/providers/telnyx.ts:379](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/telnyx.ts#L379)

Speak text into a live call using Telnyx's text-to-speech speak action.

POSTs a JSON body to `/v2/calls/{id}/actions/speak` with the text
`payload`, `voice` (default `'female'`), and `language` (default `'en-US'`).

#### Parameters

##### input

[`PlayTtsInput`](../interfaces/PlayTtsInput.md)

TTS parameters (text, optional voice, call ID).

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`playTts`](../interfaces/IVoiceCallProvider.md#playtts)

***

### verifyWebhook()

> **verifyWebhook**(`ctx`): [`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)

Defined in: [packages/agentos/src/channels/telephony/providers/telnyx.ts:196](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/telnyx.ts#L196)

Verify an incoming Telnyx webhook using Ed25519 signature verification.

## Algorithm (step by step)

1. If no public key is configured, skip verification (return `valid: true`).
   This supports development environments without cryptographic setup.
2. Extract `X-Telnyx-Timestamp` and `X-Telnyx-Signature-Ed25519` headers.
3. Decode the signature from base64 into a raw byte Buffer.
4. Construct the signed payload: `"{timestamp}|{rawBody}"`.
5. Decode the SPKI public key from base64.
6. Call `crypto.verify(null, payload, { key, format: 'der', type: 'spki' }, signature)`.
7. Return the verification result.

#### Parameters

##### ctx

[`WebhookContext`](../interfaces/WebhookContext.md)

Raw webhook request context.

#### Returns

[`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)

Verification result. Returns `{ valid: true }` when no public key
  is configured (development mode).

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`verifyWebhook`](../interfaces/IVoiceCallProvider.md#verifywebhook)
