# Type Alias: ProviderConfig

> **ProviderConfig** = \{ `config`: [`TwilioProviderConfig`](../interfaces/TwilioProviderConfig.md); `provider`: `"twilio"`; \} \| \{ `config`: [`TelnyxProviderConfig`](../interfaces/TelnyxProviderConfig.md); `provider`: `"telnyx"`; \} \| \{ `config`: [`PlivoProviderConfig`](../interfaces/PlivoProviderConfig.md); `provider`: `"plivo"`; \} \| \{ `config?`: `Record`\<`string`, `unknown`\>; `provider`: `"mock"`; \}

Defined in: [packages/agentos/src/channels/telephony/types.ts:480](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/telephony/types.ts#L480)

Union of all provider configs.
