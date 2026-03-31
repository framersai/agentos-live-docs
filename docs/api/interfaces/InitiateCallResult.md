# Interface: InitiateCallResult

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:50](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L50)

Result of initiating a call.

## Properties

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:56](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L56)

Error message if not successful.

***

### providerCallId

> **providerCallId**: `string`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:52](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L52)

Provider-assigned call ID.

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/channels/telephony/IVoiceCallProvider.ts:54](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/IVoiceCallProvider.ts#L54)

Whether the call was accepted by the provider.
