# Interface: VoiceNodeConfig

Defined in: [packages/agentos/src/orchestration/ir/types.ts:118](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L118)

Configuration for a voice pipeline node.
All fields except `mode` are optional and default from agent.config.json voice section.

## Properties

### bargeIn?

> `optional` **bargeIn**: `"disabled"` \| `"hard-cut"` \| `"soft-fade"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:130](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L130)

Barge-in mode

***

### diarization?

> `optional` **diarization**: `boolean`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:132](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L132)

Enable diarization

***

### endpointing?

> `optional` **endpointing**: `"semantic"` \| `"acoustic"` \| `"heuristic"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:128](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L128)

Endpointing mode

***

### exitKeywords?

> `optional` **exitKeywords**: `string`[]

Defined in: [packages/agentos/src/orchestration/ir/types.ts:140](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L140)

Keywords that trigger completion (when exitOn: 'keyword')

***

### exitOn?

> `optional` **exitOn**: `"manual"` \| `"silence-timeout"` \| `"hangup"` \| `"keyword"` \| `"turns-exhausted"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:138](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L138)

Exit condition

***

### language?

> `optional` **language**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:134](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L134)

Language (BCP-47)

***

### maxTurns?

> `optional` **maxTurns**: `number`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:136](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L136)

Max turns before node completes (0 = unlimited)

***

### mode

> **mode**: `"conversation"` \| `"listen-only"` \| `"speak-only"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:120](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L120)

Voice session mode

***

### stt?

> `optional` **stt**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:122](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L122)

STT provider override

***

### tts?

> `optional` **tts**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:124](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L124)

TTS provider override

***

### voice?

> `optional` **voice**: `string`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:126](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L126)

TTS voice override
