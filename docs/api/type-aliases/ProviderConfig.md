# Type Alias: ProviderConfig

> **ProviderConfig** = \{ `config`: [`TwilioProviderConfig`](../interfaces/TwilioProviderConfig.md); `provider`: `"twilio"`; \} \| \{ `config`: [`TelnyxProviderConfig`](../interfaces/TelnyxProviderConfig.md); `provider`: `"telnyx"`; \} \| \{ `config`: [`PlivoProviderConfig`](../interfaces/PlivoProviderConfig.md); `provider`: `"plivo"`; \} \| \{ `config?`: `Record`\<`string`, `unknown`\>; `provider`: `"mock"`; \}

Defined in: [packages/agentos/src/channels/telephony/types.ts:480](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L480)

Union of all provider configs.
