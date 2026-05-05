# Type Alias: VoiceProviderName

> **VoiceProviderName** = `"twilio"` \| `"telnyx"` \| `"plivo"` \| `"mock"` \| `string` & `object`

Defined in: [packages/agentos/src/channels/telephony/types.ts:39](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/channels/telephony/types.ts#L39)

Supported telephony providers.

The explicit literals enable autocomplete and exhaustiveness checking while
the `(string & {})` arm keeps the type open for future providers without
requiring a code change.
