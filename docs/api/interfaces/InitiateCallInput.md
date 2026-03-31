# Interface: InitiateCallInput

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:26](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L26)

Parameters for initiating an outbound call.

## Properties

### callId

> **callId**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:28](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L28)

Internal call ID assigned by CallManager.

***

### fromNumber

> **fromNumber**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:30](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L30)

E.164 phone number to call from.

***

### mediaStreamToken?

> `optional` **mediaStreamToken**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:46](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L46)

Auth token appended to media stream URL for validation.

***

### mediaStreamUrl?

> `optional` **mediaStreamUrl**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:44](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L44)

Media stream WebSocket URL (for 'conversation' mode).

***

### message?

> `optional` **message**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:36](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L36)

Pre-composed message (for 'notify' mode).

***

### mode

> **mode**: [`CallMode`](../type-aliases/CallMode.md)

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:34](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L34)

Call interaction mode.

***

### notifyVoice?

> `optional` **notifyVoice**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:38](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L38)

TTS voice to use for notify-mode messages.

***

### statusCallbackUrl?

> `optional` **statusCallbackUrl**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:42](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L42)

Status callback URL for call state changes.

***

### toNumber

> **toNumber**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:32](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L32)

E.164 phone number to call.

***

### webhookUrl

> **webhookUrl**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:40](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L40)

Webhook URL the provider should call back to.
