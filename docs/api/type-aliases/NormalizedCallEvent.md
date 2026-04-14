# Type Alias: NormalizedCallEvent

> **NormalizedCallEvent** = [`NormalizedCallRinging`](../interfaces/NormalizedCallRinging.md) \| [`NormalizedCallAnswered`](../interfaces/NormalizedCallAnswered.md) \| [`NormalizedCallCompleted`](../interfaces/NormalizedCallCompleted.md) \| [`NormalizedCallFailed`](../interfaces/NormalizedCallFailed.md) \| [`NormalizedCallBusy`](../interfaces/NormalizedCallBusy.md) \| [`NormalizedCallNoAnswer`](../interfaces/NormalizedCallNoAnswer.md) \| [`NormalizedCallVoicemail`](../interfaces/NormalizedCallVoicemail.md) \| [`NormalizedCallHangupUser`](../interfaces/NormalizedCallHangupUser.md) \| [`NormalizedCallError`](../interfaces/NormalizedCallError.md) \| [`NormalizedTranscript`](../interfaces/NormalizedTranscript.md) \| [`NormalizedSpeechStart`](../interfaces/NormalizedSpeechStart.md) \| [`NormalizedMediaStreamConnected`](../interfaces/NormalizedMediaStreamConnected.md) \| [`NormalizedDtmfReceived`](../interfaces/NormalizedDtmfReceived.md)

Defined in: [packages/agentos/src/channels/telephony/types.ts:243](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L243)

Normalized webhook event from any telephony provider.

Uses a discriminated union on the `kind` field so consumers can narrow
with a `switch (event.kind)` and get full type safety for each variant's
payload.

Provider-specific webhook formats (Twilio form-encoded, Telnyx JSON,
Plivo URL-encoded/JSON) are all mapped into these canonical shapes by
each provider's [IVoiceCallProvider.parseWebhookEvent](../interfaces/IVoiceCallProvider.md#parsewebhookevent) implementation.
