# Interface: TranscriptEntry

Defined in: [packages/agentos/src/channels/telephony/types.ts:172](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L172)

A single entry in a call transcript.

## Properties

### isFinal

> **isFinal**: `boolean`

Defined in: [packages/agentos/src/channels/telephony/types.ts:180](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L180)

Whether this is a finalized transcript (vs. partial/streaming).

***

### speaker

> **speaker**: `"user"` \| `"bot"`

Defined in: [packages/agentos/src/channels/telephony/types.ts:176](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L176)

Who spoke.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:178](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L178)

The spoken text.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/channels/telephony/types.ts:174](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L174)

Unix timestamp (ms) when this was recorded.
