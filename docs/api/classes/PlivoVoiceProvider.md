# Class: PlivoVoiceProvider

Defined in: [packages/agentos/src/channels/telephony/providers/plivo.ts:120](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/plivo.ts#L120)

Plivo voice call provider.

Uses the Plivo REST API v1 for outbound call control and HMAC-SHA256
for inbound webhook signature verification (v3 signature scheme).

## Example

```typescript
const provider = new PlivoVoiceProvider({
  authId:    process.env.PLIVO_AUTH_ID!,
  authToken: process.env.PLIVO_AUTH_TOKEN!,
});
```

## Implements

- [`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md)

## Constructors

### Constructor

> **new PlivoVoiceProvider**(`config`): `PlivoVoiceProvider`

Defined in: [packages/agentos/src/channels/telephony/providers/plivo.ts:139](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/plivo.ts#L139)

#### Parameters

##### config

`PlivoVoiceProviderConfig`

Plivo credentials and optional overrides.

#### Returns

`PlivoVoiceProvider`

## Properties

### name

> `readonly` **name**: `"plivo"`

Defined in: [packages/agentos/src/channels/telephony/providers/plivo.ts:122](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/plivo.ts#L122)

Provider identifier, always `'plivo'`.

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`name`](../interfaces/IVoiceCallProvider.md#name)

## Methods

### hangupCall()

> **hangupCall**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/telephony/providers/plivo.ts:311](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/plivo.ts#L311)

Hang up an active call using the Plivo Call DELETE endpoint.

Plivo uses HTTP `DELETE` to terminate a call (unlike Twilio's POST with
`Status=completed` or Telnyx's POST to `/actions/hangup`). This is a
RESTful convention where deleting the call resource ends the call.

#### Parameters

##### input

[`HangupCallInput`](../interfaces/HangupCallInput.md)

Contains the Plivo `call_uuid` to hang up.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`hangupCall`](../interfaces/IVoiceCallProvider.md#hangupcall)

***

### initiateCall()

> **initiateCall**(`input`): `Promise`\<[`InitiateCallResult`](../interfaces/InitiateCallResult.md)\>

Defined in: [packages/agentos/src/channels/telephony/providers/plivo.ts:276](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/plivo.ts#L276)

Initiate an outbound call via the Plivo Call API.

POSTs a JSON body to `/v1/Account/{authId}/Call/` with the caller, callee,
and answer URL. Returns the `request_uuid` as the provider call ID.

#### Parameters

##### input

[`InitiateCallInput`](../interfaces/InitiateCallInput.md)

Call initiation parameters (from/to numbers, webhook URL).

#### Returns

`Promise`\<[`InitiateCallResult`](../interfaces/InitiateCallResult.md)\>

Result containing the Plivo `request_uuid` on success.

#### Throws

Never throws; returns `{ success: false, error: '...' }` on failure.

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`initiateCall`](../interfaces/IVoiceCallProvider.md#initiatecall)

***

### parseWebhookEvent()

> **parseWebhookEvent**(`ctx`): [`WebhookParseResult`](../interfaces/WebhookParseResult.md)

Defined in: [packages/agentos/src/channels/telephony/providers/plivo.ts:200](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/plivo.ts#L200)

Parse a Plivo webhook body into normalized [NormalizedCallEvent](../type-aliases/NormalizedCallEvent.md)s.

Plivo sends most webhooks with URL-encoded bodies, but some callbacks
may arrive as JSON. This parser handles both formats by inspecting
whether the body starts with `{` (JSON) or not (form-encoded).

Plivo uses two naming conventions for the same fields:
- PascalCase (`CallUUID`, `CallStatus`, `Digits`) in URL callbacks.
- snake_case (`call_uuid`, `call_status`) in some API responses.
Both are checked for maximum compatibility.

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

Defined in: [packages/agentos/src/channels/telephony/providers/plivo.ts:330](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/plivo.ts#L330)

Speak text into a live call using the Plivo Speak API.

POSTs a JSON body to `/v1/Account/{authId}/Call/{callUuid}/Speak/`
with the text, voice (default `'WOMAN'`), and language (default `'en-US'`).

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

Defined in: [packages/agentos/src/channels/telephony/providers/plivo.ts:165](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/providers/plivo.ts#L165)

Verify an incoming Plivo webhook request using HMAC-SHA256 (v3 scheme).

## Algorithm (step by step)

1. Extract the `X-Plivo-Signature-V3-Nonce` and `X-Plivo-Signature-V3` headers.
2. Build the signed data string: `{fullRequestURL}{nonce}`.
   Note: the POST body is NOT included in the signed data (unlike Twilio).
3. Compute `HMAC-SHA256(authToken, signedData)`.
4. Base64-encode the digest.
5. Compare with the `X-Plivo-Signature-V3` header.

#### Parameters

##### ctx

[`WebhookContext`](../interfaces/WebhookContext.md)

Raw webhook request context.

#### Returns

[`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)

Verification result with `valid: true` if the signature matches.

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`verifyWebhook`](../interfaces/IVoiceCallProvider.md#verifywebhook)
