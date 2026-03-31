# Interface: PlayTtsInput

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:66](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L66)

Parameters for playing TTS into a call.

## Properties

### providerCallId

> **providerCallId**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:68](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L68)

Provider-assigned call ID.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:70](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L70)

Text to speak.

***

### voice?

> `optional` **voice**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:72](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L72)

TTS voice name/ID.
