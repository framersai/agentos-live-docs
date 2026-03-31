# Interface: GenerateSFXOptions

Defined in: [packages/agentos/src/api/generateSFX.ts:208](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L208)

Options for a [generateSFX](../functions/generateSFX.md) call.

At minimum, a `prompt` is required. The provider is resolved from
`opts.provider`, `opts.apiKey`, or the first SFX-capable env var found
(`ELEVENLABS_API_KEY` -> `STABILITY_API_KEY` -> `REPLICATE_API_TOKEN` ->
`FAL_API_KEY` -> local AudioGen).

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/generateSFX.ts:250](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L250)

Override the provider API key instead of reading from env vars.

***

### durationSec?

> `optional` **durationSec**: `number`

Defined in: [packages/agentos/src/api/generateSFX.ts:226](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L226)

Desired output duration in seconds. SFX clips are typically 1-15s.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateSFX.ts:223](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L223)

Model identifier within the provider. When omitted, the provider's
default model is used.

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/api/generateSFX.ts:241](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L241)

Number of audio clips to generate. Defaults to 1.

***

### onProgress()?

> `optional` **onProgress**: (`event`) => `void`

Defined in: [packages/agentos/src/api/generateSFX.ts:247](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L247)

Optional progress callback invoked during long-running generation.
Called with an [AudioProgressEvent](AudioProgressEvent.md) at each status transition.

#### Parameters

##### event

[`AudioProgressEvent`](AudioProgressEvent.md)

#### Returns

`void`

***

### outputFormat?

> `optional` **outputFormat**: [`AudioOutputFormat`](../type-aliases/AudioOutputFormat.md)

Defined in: [packages/agentos/src/api/generateSFX.ts:229](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L229)

Output audio format (e.g. `"mp3"`, `"wav"`). Defaults to provider default.

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/api/generateSFX.ts:210](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L210)

Text prompt describing the desired sound effect.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/generateSFX.ts:217](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L217)

Explicit provider identifier (e.g. `"elevenlabs-sfx"`, `"stable-audio"`,
`"audiogen-local"`). When omitted, auto-detection from environment
variables is used.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/generateSFX.ts:256](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L256)

Arbitrary provider-specific options.

***

### providerPreferences?

> `optional` **providerPreferences**: [`MediaProviderPreference`](MediaProviderPreference.md)

Defined in: [packages/agentos/src/api/generateSFX.ts:263](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L263)

Provider preferences for reordering or filtering the fallback chain.
When supplied, the available providers are reordered according to
`preferred` and filtered by `blocked` before building the chain.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/api/generateSFX.ts:232](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L232)

Random seed for reproducible generation (provider-dependent).

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/api/generateSFX.ts:238](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L238)

Maximum time in milliseconds to wait for generation to complete.
Provider-dependent — polling providers enforce this directly.

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/generateSFX.ts:266](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L266)

Optional durable usage ledger configuration for accounting.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/api/generateSFX.ts:253](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateSFX.ts#L253)

Optional user identifier forwarded to the provider for billing.
