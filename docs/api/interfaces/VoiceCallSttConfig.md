# Interface: VoiceCallSttConfig

Defined in: [packages/agentos/src/channels/telephony/types.ts:446](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L446)

STT configuration for voice calls.

## Properties

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:450](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L450)

Language hint for STT.

***

### options?

> `optional` **options**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/channels/telephony/types.ts:452](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L452)

Provider-specific options.

***

### provider?

> `optional` **provider**: `string` & `object` \| `"openai-realtime"` \| `"whisper"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:448](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/types.ts#L448)

STT provider (currently only 'openai-realtime' supported).
