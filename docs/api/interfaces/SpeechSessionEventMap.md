# Interface: SpeechSessionEventMap

Defined in: [packages/agentos/src/speech/types.ts:332](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L332)

## Properties

### error()

> **error**: (`event`) => `void`

Defined in: [packages/agentos/src/speech/types.ts:343](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L343)

#### Parameters

##### event

[`SpeechSessionErrorEvent`](SpeechSessionErrorEvent.md)

#### Returns

`void`

***

### significant\_pause()

> **significant\_pause**: (`pauseDurationMs`) => `void`

Defined in: [packages/agentos/src/speech/types.ts:337](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L337)

#### Parameters

##### pauseDurationMs

`number`

#### Returns

`void`

***

### speech\_ended()

> **speech\_ended**: (`event`) => `void`

Defined in: [packages/agentos/src/speech/types.ts:336](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L336)

#### Parameters

##### event

[`SpeechSessionSpeechEndedEvent`](SpeechSessionSpeechEndedEvent.md)

#### Returns

`void`

***

### speech\_started()

> **speech\_started**: (`event`) => `void`

Defined in: [packages/agentos/src/speech/types.ts:335](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L335)

#### Parameters

##### event

[`SpeechSessionSpeechStartedEvent`](SpeechSessionSpeechStartedEvent.md)

#### Returns

`void`

***

### state\_changed()

> **state\_changed**: (`event`) => `void`

Defined in: [packages/agentos/src/speech/types.ts:333](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L333)

#### Parameters

##### event

[`SpeechSessionStateChangedEvent`](SpeechSessionStateChangedEvent.md)

#### Returns

`void`

***

### synthesis\_completed()

> **synthesis\_completed**: (`event`) => `void`

Defined in: [packages/agentos/src/speech/types.ts:342](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L342)

#### Parameters

##### event

[`SpeechSessionSynthesisCompletedEvent`](SpeechSessionSynthesisCompletedEvent.md)

#### Returns

`void`

***

### synthesis\_started()

> **synthesis\_started**: (`event`) => `void`

Defined in: [packages/agentos/src/speech/types.ts:341](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L341)

#### Parameters

##### event

[`SpeechSessionSynthesisStartedEvent`](SpeechSessionSynthesisStartedEvent.md)

#### Returns

`void`

***

### transcript\_final()

> **transcript\_final**: (`event`) => `void`

Defined in: [packages/agentos/src/speech/types.ts:339](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L339)

#### Parameters

##### event

[`SpeechSessionTranscriptEvent`](SpeechSessionTranscriptEvent.md)

#### Returns

`void`

***

### utterance\_captured()

> **utterance\_captured**: (`event`) => `void`

Defined in: [packages/agentos/src/speech/types.ts:338](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L338)

#### Parameters

##### event

[`SpeechSessionUtteranceCapturedEvent`](SpeechSessionUtteranceCapturedEvent.md)

#### Returns

`void`

***

### vad\_result()

> **vad\_result**: (`result`) => `void`

Defined in: [packages/agentos/src/speech/types.ts:334](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L334)

#### Parameters

##### result

[`SpeechVadDecision`](SpeechVadDecision.md)

#### Returns

`void`

***

### wake\_word\_detected()

> **wake\_word\_detected**: (`event`) => `void`

Defined in: [packages/agentos/src/speech/types.ts:340](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/types.ts#L340)

#### Parameters

##### event

[`SpeechSessionWakeWordEvent`](SpeechSessionWakeWordEvent.md)

#### Returns

`void`
