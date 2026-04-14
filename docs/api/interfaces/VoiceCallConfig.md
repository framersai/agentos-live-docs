# Interface: VoiceCallConfig

Defined in: [packages/agentos/src/channels/telephony/types.ts:487](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L487)

Full voice call system configuration.

## Properties

### allowedNumbers?

> `optional` **allowedNumbers**: `string`[]

Defined in: [packages/agentos/src/channels/telephony/types.ts:497](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L497)

Allowlist of E.164 numbers (for 'allowlist' policy).

***

### defaultMode?

> `optional` **defaultMode**: [`CallMode`](../type-aliases/CallMode.md)

Defined in: [packages/agentos/src/channels/telephony/types.ts:499](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L499)

Default call mode for outbound calls.

***

### inboundPolicy?

> `optional` **inboundPolicy**: [`InboundPolicy`](../type-aliases/InboundPolicy.md)

Defined in: [packages/agentos/src/channels/telephony/types.ts:495](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L495)

Inbound call policy.

***

### maxDurationSeconds?

> `optional` **maxDurationSeconds**: `number`

Defined in: [packages/agentos/src/channels/telephony/types.ts:501](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L501)

Maximum call duration in seconds (default: 300 = 5 min).

***

### provider

> **provider**: [`ProviderConfig`](../type-aliases/ProviderConfig.md)

Defined in: [packages/agentos/src/channels/telephony/types.ts:489](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L489)

Active telephony provider.

***

### streaming?

> `optional` **streaming**: `object`

Defined in: [packages/agentos/src/channels/telephony/types.ts:505](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L505)

Media stream configuration.

#### enabled

> **enabled**: `boolean`

Whether to use bidirectional media streams.

#### wsPath?

> `optional` **wsPath**: `string`

WebSocket path for media streams (default: /voice/media-stream).

***

### stt?

> `optional` **stt**: [`VoiceCallSttConfig`](VoiceCallSttConfig.md)

Defined in: [packages/agentos/src/channels/telephony/types.ts:493](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L493)

STT settings for phone audio.

***

### tts?

> `optional` **tts**: [`VoiceCallTtsConfig`](VoiceCallTtsConfig.md)

Defined in: [packages/agentos/src/channels/telephony/types.ts:491](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L491)

TTS settings for phone audio.

***

### webhookBaseUrl?

> `optional` **webhookBaseUrl**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:503](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L503)

Webhook base URL for receiving provider callbacks.
