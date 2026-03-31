# Type Alias: VoiceProviderName

> **VoiceProviderName** = `"twilio"` \| `"telnyx"` \| `"plivo"` \| `"mock"` \| `string` & `object`

Defined in: [packages/agentos/src/channels/telephony/types.ts:39](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/types.ts#L39)

Supported telephony providers.

The explicit literals enable autocomplete and exhaustiveness checking while
the `(string & {})` arm keeps the type open for future providers without
requiring a code change.
