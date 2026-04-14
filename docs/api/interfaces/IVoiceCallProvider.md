# Interface: IVoiceCallProvider

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:117](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/IVoiceCallProvider.ts#L117)

Core interface for telephony providers.

Implementations wrap provider-specific SDKs (Twilio REST API, Telnyx Call
Control v2, Plivo Voice API) and normalize all interactions to this contract.

## Example

```typescript
class TwilioProvider implements IVoiceCallProvider {
  readonly name = 'twilio';

  async initiateCall(input: InitiateCallInput): Promise<InitiateCallResult> {
    const call = await this.client.calls.create({
      to: input.toNumber,
      from: input.fromNumber,
      url: input.webhookUrl,
      statusCallback: input.statusCallbackUrl,
    });
    return { providerCallId: call.sid, success: true };
  }
  // ...
}
```

## Properties

### name

> `readonly` **name**: [`VoiceProviderName`](../type-aliases/VoiceProviderName.md)

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:119](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/IVoiceCallProvider.ts#L119)

Provider identifier.

## Methods

### hangupCall()

> **hangupCall**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:152](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/IVoiceCallProvider.ts#L152)

Hang up an active call.

#### Parameters

##### input

[`HangupCallInput`](HangupCallInput.md)

#### Returns

`Promise`\<`void`\>

***

### initiateCall()

> **initiateCall**(`input`): `Promise`\<[`InitiateCallResult`](InitiateCallResult.md)\>

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:147](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/IVoiceCallProvider.ts#L147)

Initiate an outbound phone call.
For 'notify' mode, the provider generates TwiML/SSML to speak the
message and hang up. For 'conversation' mode, the provider sets up
a bidirectional media stream.

#### Parameters

##### input

[`InitiateCallInput`](InitiateCallInput.md)

#### Returns

`Promise`\<[`InitiateCallResult`](InitiateCallResult.md)\>

***

### parseWebhookEvent()

> **parseWebhookEvent**(`ctx`): [`WebhookParseResult`](WebhookParseResult.md)

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:137](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/IVoiceCallProvider.ts#L137)

Parse a verified webhook payload into normalized call events.
Transforms provider-specific event formats into the common
[NormalizedCallEvent](../type-aliases/NormalizedCallEvent.md) discriminated union.

#### Parameters

##### ctx

[`WebhookContext`](WebhookContext.md)

#### Returns

[`WebhookParseResult`](WebhookParseResult.md)

***

### playTts()?

> `optional` **playTts**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:159](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/IVoiceCallProvider.ts#L159)

Play TTS audio into an active call (non-streaming).
Used by providers that support in-call TTS via their API
(e.g., Twilio's <Say> verb, Telnyx speak command).

#### Parameters

##### input

[`PlayTtsInput`](PlayTtsInput.md)

#### Returns

`Promise`\<`void`\>

***

### startListening()?

> `optional` **startListening**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:165](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/IVoiceCallProvider.ts#L165)

Start STT listening on an active call (non-streaming).
Used by providers that support in-call speech recognition.

#### Parameters

##### input

[`StartListeningInput`](StartListeningInput.md)

#### Returns

`Promise`\<`void`\>

***

### stopListening()?

> `optional` **stopListening**(`input`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:170](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/IVoiceCallProvider.ts#L170)

Stop STT listening on an active call.

#### Parameters

##### input

[`StopListeningInput`](StopListeningInput.md)

#### Returns

`Promise`\<`void`\>

***

### verifyWebhook()

> **verifyWebhook**(`ctx`): [`WebhookVerificationResult`](WebhookVerificationResult.md)

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:130](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/IVoiceCallProvider.ts#L130)

Verify the authenticity of an incoming webhook request.
Each provider has its own signature scheme:
- Twilio: HMAC-SHA1 signature header
- Telnyx: Ed25519 public key verification
- Plivo: HMAC-SHA256 verification

#### Parameters

##### ctx

[`WebhookContext`](WebhookContext.md)

#### Returns

[`WebhookVerificationResult`](WebhookVerificationResult.md)
