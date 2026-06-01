# Interface: VoiceCallSttConfig

Defined in: [packages/agentos/src/io/channels/telephony/types.ts:446](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/types.ts#L446)

STT configuration for voice calls.

## Properties

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/io/channels/telephony/types.ts:450](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/types.ts#L450)

Language hint for STT.

***

### options?

> `optional` **options**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/io/channels/telephony/types.ts:452](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/types.ts#L452)

Provider-specific options.

***

### provider?

> `optional` **provider**: `string` & `object` \| `"openai-realtime"` \| `"whisper"`

Defined in: [packages/agentos/src/io/channels/telephony/types.ts:448](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/types.ts#L448)

STT provider (currently only 'openai-realtime' supported).
