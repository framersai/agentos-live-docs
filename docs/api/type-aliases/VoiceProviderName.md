# Type Alias: VoiceProviderName

> **VoiceProviderName** = `"twilio"` \| `"telnyx"` \| `"plivo"` \| `"mock"` \| `string` & `object`

Defined in: [packages/agentos/src/channels/telephony/types.ts:39](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/types.ts#L39)

Supported telephony providers.

The explicit literals enable autocomplete and exhaustiveness checking while
the `(string & {})` arm keeps the type open for future providers without
requiring a code change.
