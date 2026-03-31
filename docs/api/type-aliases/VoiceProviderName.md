# Type Alias: VoiceProviderName

> **VoiceProviderName** = `"twilio"` \| `"telnyx"` \| `"plivo"` \| `"mock"` \| `string` & `object`

Defined in: [packages/agentos/src/channels/telephony/types.ts:39](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/types.ts#L39)

Supported telephony providers.

The explicit literals enable autocomplete and exhaustiveness checking while
the `(string & {})` arm keeps the type open for future providers without
requiring a code change.
