# Type Alias: ProviderConfig

> **ProviderConfig** = \{ `config`: [`TwilioProviderConfig`](../interfaces/TwilioProviderConfig.md); `provider`: `"twilio"`; \} \| \{ `config`: [`TelnyxProviderConfig`](../interfaces/TelnyxProviderConfig.md); `provider`: `"telnyx"`; \} \| \{ `config`: [`PlivoProviderConfig`](../interfaces/PlivoProviderConfig.md); `provider`: `"plivo"`; \} \| \{ `config?`: `Record`\<`string`, `unknown`\>; `provider`: `"mock"`; \}

Defined in: [packages/agentos/src/channels/telephony/types.ts:480](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/telephony/types.ts#L480)

Union of all provider configs.
