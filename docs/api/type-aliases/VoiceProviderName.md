# Type Alias: VoiceProviderName

> **VoiceProviderName** = `"twilio"` \| `"telnyx"` \| `"plivo"` \| `"mock"` \| `string` & `object`

Defined in: [packages/agentos/src/channels/telephony/types.ts:39](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L39)

Supported telephony providers.

The explicit literals enable autocomplete and exhaustiveness checking while
the `(string & {})` arm keeps the type open for future providers without
requiring a code change.
