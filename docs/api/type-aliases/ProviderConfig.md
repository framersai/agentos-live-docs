# Type Alias: ProviderConfig

> **ProviderConfig** = \{ `config`: [`TwilioProviderConfig`](../interfaces/TwilioProviderConfig.md); `provider`: `"twilio"`; \} \| \{ `config`: [`TelnyxProviderConfig`](../interfaces/TelnyxProviderConfig.md); `provider`: `"telnyx"`; \} \| \{ `config`: [`PlivoProviderConfig`](../interfaces/PlivoProviderConfig.md); `provider`: `"plivo"`; \} \| \{ `config?`: `Record`\<`string`, `unknown`\>; `provider`: `"mock"`; \}

Defined in: [packages/agentos/src/io/channels/telephony/types.ts:480](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/types.ts#L480)

Union of all provider configs.
