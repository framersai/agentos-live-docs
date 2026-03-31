# Class: TwilioVoiceProvider

Defined in: [packages/agentos/src/channels/telephony/providers/twilio.ts:103](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/providers/twilio.ts#L103)

Twilio voice call provider.

Uses the Twilio REST API 2010-04-01 for outbound call control and
HMAC-SHA1 for inbound webhook signature verification.

## Example

```typescript
const provider = new TwilioVoiceProvider({
  accountSid: process.env.TWILIO_ACCOUNT_SID!,
  authToken:  process.env.TWILIO_AUTH_TOKEN!,
});
```

## Implements

- [`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md)

## Constructors

### Constructor

> **new TwilioVoiceProvider**(`config`): `TwilioVoiceProvider`

Defined in: [packages/agentos/src/channels/telephony/providers/twilio.ts:122](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/providers/twilio.ts#L122)

#### Parameters

##### config

`TwilioVoiceProviderConfig`

Twilio credentials and optional overrides.

#### Returns

`TwilioVoiceProvider`

## Properties

### name

> `readonly` **name**: `"twilio"`

Defined in: [packages/agentos/src/channels/telephony/providers/twilio.ts:105](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/providers/twilio.ts#L105)

Provider identifier, always `'twilio'`.

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`name`](../interfaces/IVoiceCallProvider.md#name)

## Methods

### hangupCall()

> **hangupCall**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/telephony/providers/twilio.ts:302](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/providers/twilio.ts#L302)

Hang up an active call by POSTing `Status=completed`.

Twilio uses the same Calls resource endpoint for both querying and
modifying a call. Setting `Status=completed` instructs Twilio to
immediately terminate the call.

#### Parameters

##### input

[`HangupCallInput`](../interfaces/HangupCallInput.md)

Contains the Twilio `CallSid` to hang up.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`hangupCall`](../interfaces/IVoiceCallProvider.md#hangupcall)

***

### initiateCall()

> **initiateCall**(`input`): `Promise`\<[`InitiateCallResult`](../interfaces/InitiateCallResult.md)\>

Defined in: [packages/agentos/src/channels/telephony/providers/twilio.ts:260](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/providers/twilio.ts#L260)

Initiate an outbound call via the Twilio Calls API.

Posts to `/Accounts/{accountSid}/Calls.json` with a **form-encoded** body
(not JSON -- this is Twilio's 2010-era API convention). All four status
callback events (`initiated`, `ringing`, `answered`, `completed`) are
requested so the [CallManager](CallManager.md) receives the full state progression.

#### Parameters

##### input

[`InitiateCallInput`](../interfaces/InitiateCallInput.md)

Call initiation parameters (from/to numbers, webhook URLs).

#### Returns

`Promise`\<[`InitiateCallResult`](../interfaces/InitiateCallResult.md)\>

Result containing the Twilio `CallSid` on success.

#### Throws

Never throws; returns `{ success: false, error: '...' }` on failure.

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`initiateCall`](../interfaces/IVoiceCallProvider.md#initiatecall)

***

### parseWebhookEvent()

> **parseWebhookEvent**(`ctx`): [`WebhookParseResult`](../interfaces/WebhookParseResult.md)

Defined in: [packages/agentos/src/channels/telephony/providers/twilio.ts:186](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/providers/twilio.ts#L186)

Parse a Twilio webhook body into normalized [NormalizedCallEvent](../type-aliases/NormalizedCallEvent.md)s.

Twilio sends webhooks with a form-encoded body containing `CallSid`,
`CallStatus`, and optionally `Digits` (for DTMF input from `<Gather>`).
Each webhook may produce one or two events (status + optional DTMF).

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

Defined in: [packages/agentos/src/channels/telephony/providers/twilio.ts:327](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/providers/twilio.ts#L327)

Inject TTS into a live call using a TwiML `<Say>` verb.

Sends a `Twiml` form parameter containing a minimal `<Response><Say>`
document. Twilio will parse the TwiML, synthesise the speech, and play
it to the caller in real-time.

The optional `voice` attribute maps to Twilio's built-in voice names
(e.g., `alice`, `Polly.Joanna`).

#### Parameters

##### input

[`PlayTtsInput`](../interfaces/PlayTtsInput.md)

TTS parameters (text, voice, call ID).

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`playTts`](../interfaces/IVoiceCallProvider.md#playtts)

***

### verifyWebhook()

> **verifyWebhook**(`ctx`): [`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)

Defined in: [packages/agentos/src/channels/telephony/providers/twilio.ts:150](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/providers/twilio.ts#L150)

Verify an incoming Twilio webhook request using HMAC-SHA1.

## Algorithm (step by step)

1. Extract the `X-Twilio-Signature` header from the request.
2. Parse the request body as URL-encoded form data.
3. Sort all key-value pairs alphabetically by key.
4. Build the signed string: start with the full URL, then append each
   key + value (no delimiters between pairs).
5. Compute `HMAC-SHA1` of the signed string using the auth token as the key.
6. Base64-encode the digest and compare it to the header value.

#### Parameters

##### ctx

[`WebhookContext`](../interfaces/WebhookContext.md)

Raw webhook request context.

#### Returns

[`WebhookVerificationResult`](../interfaces/WebhookVerificationResult.md)

Verification result with `valid: true` if the signature matches.

#### Implementation of

[`IVoiceCallProvider`](../interfaces/IVoiceCallProvider.md).[`verifyWebhook`](../interfaces/IVoiceCallProvider.md#verifywebhook)
