# Interface: GenerateMusicOptions

Defined in: [packages/agentos/src/api/generateMusic.ts:209](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L209)

Options for a [generateMusic](../functions/generateMusic.md) call.

At minimum, a `prompt` is required. The provider is resolved from
`opts.provider`, `opts.apiKey`, or the first music-capable env var found
(`SUNO_API_KEY` -> `STABILITY_API_KEY` -> `REPLICATE_API_TOKEN` ->
`FAL_API_KEY` -> local MusicGen).

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/api/generateMusic.ts:254](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L254)

Override the provider API key instead of reading from env vars.

***

### durationSec?

> `optional` **durationSec**: `number`

Defined in: [packages/agentos/src/api/generateMusic.ts:227](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L227)

Desired output duration in seconds. Provider limits vary.

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/api/generateMusic.ts:224](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L224)

Model identifier within the provider (e.g. `"suno-v3.5"`,
`"stable-audio-open-1.0"`). When omitted, the provider's default
model is used.

***

### n?

> `optional` **n**: `number`

Defined in: [packages/agentos/src/api/generateMusic.ts:245](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L245)

Number of audio clips to generate. Defaults to 1.

***

### negativePrompt?

> `optional` **negativePrompt**: `string`

Defined in: [packages/agentos/src/api/generateMusic.ts:230](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L230)

Negative prompt describing musical elements to avoid.

***

### onProgress()?

> `optional` **onProgress**: (`event`) => `void`

Defined in: [packages/agentos/src/api/generateMusic.ts:251](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L251)

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

Defined in: [packages/agentos/src/api/generateMusic.ts:233](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L233)

Output audio format (e.g. `"mp3"`, `"wav"`). Defaults to provider default.

***

### prompt

> **prompt**: `string`

Defined in: [packages/agentos/src/api/generateMusic.ts:211](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L211)

Text prompt describing the desired musical composition.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/api/generateMusic.ts:217](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L217)

Explicit provider identifier (e.g. `"suno"`, `"stable-audio"`, `"musicgen-local"`).
When omitted, auto-detection from environment variables is used.

***

### providerOptions?

> `optional` **providerOptions**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/generateMusic.ts:260](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L260)

Arbitrary provider-specific options.

***

### providerPreferences?

> `optional` **providerPreferences**: [`MediaProviderPreference`](MediaProviderPreference.md)

Defined in: [packages/agentos/src/api/generateMusic.ts:267](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L267)

Provider preferences for reordering or filtering the fallback chain.
When supplied, the available providers are reordered according to
`preferred` and filtered by `blocked` before building the chain.

***

### seed?

> `optional` **seed**: `number`

Defined in: [packages/agentos/src/api/generateMusic.ts:236](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L236)

Random seed for reproducible generation (provider-dependent).

***

### timeoutMs?

> `optional` **timeoutMs**: `number`

Defined in: [packages/agentos/src/api/generateMusic.ts:242](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L242)

Maximum time in milliseconds to wait for generation to complete.
Provider-dependent — polling providers enforce this directly.

***

### usageLedger?

> `optional` **usageLedger**: [`AgentOSUsageLedgerOptions`](AgentOSUsageLedgerOptions.md)

Defined in: [packages/agentos/src/api/generateMusic.ts:270](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L270)

Optional durable usage ledger configuration for accounting.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/api/generateMusic.ts:257](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateMusic.ts#L257)

Optional user identifier forwarded to the provider for billing.
