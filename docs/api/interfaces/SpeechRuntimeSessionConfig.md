# Interface: SpeechRuntimeSessionConfig

Defined in: [packages/agentos/src/speech/types.ts:346](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L346)

## Extends

- [`SpeechSessionConfig`](SpeechSessionConfig.md)

## Properties

### audioFileName?

> `optional` **audioFileName**: `string`

Defined in: [packages/agentos/src/speech/types.ts:271](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L271)

#### Inherited from

[`SpeechSessionConfig`](SpeechSessionConfig.md).[`audioFileName`](SpeechSessionConfig.md#audiofilename)

***

### autoTranscribeOnSpeechEnd?

> `optional` **autoTranscribeOnSpeechEnd**: `boolean`

Defined in: [packages/agentos/src/speech/types.ts:272](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L272)

#### Inherited from

[`SpeechSessionConfig`](SpeechSessionConfig.md).[`autoTranscribeOnSpeechEnd`](SpeechSessionConfig.md#autotranscribeonspeechend)

***

### frameDurationMs?

> `optional` **frameDurationMs**: `number`

Defined in: [packages/agentos/src/speech/types.ts:270](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L270)

#### Inherited from

[`SpeechSessionConfig`](SpeechSessionConfig.md).[`frameDurationMs`](SpeechSessionConfig.md#framedurationms)

***

### mode?

> `optional` **mode**: [`SpeechSessionMode`](../type-aliases/SpeechSessionMode.md)

Defined in: [packages/agentos/src/speech/types.ts:268](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L268)

#### Inherited from

[`SpeechSessionConfig`](SpeechSessionConfig.md).[`mode`](SpeechSessionConfig.md#mode)

***

### sampleRate?

> `optional` **sampleRate**: `number`

Defined in: [packages/agentos/src/speech/types.ts:269](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L269)

#### Inherited from

[`SpeechSessionConfig`](SpeechSessionConfig.md).[`sampleRate`](SpeechSessionConfig.md#samplerate)

***

### silence?

> `optional` **silence**: [`SilenceDetectorConfig`](SilenceDetectorConfig.md)

Defined in: [packages/agentos/src/speech/types.ts:276](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L276)

#### Inherited from

[`SpeechSessionConfig`](SpeechSessionConfig.md).[`silence`](SpeechSessionConfig.md#silence)

***

### sttOptions?

> `optional` **sttOptions**: [`SpeechTranscriptionOptions`](SpeechTranscriptionOptions.md)

Defined in: [packages/agentos/src/speech/types.ts:273](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L273)

#### Inherited from

[`SpeechSessionConfig`](SpeechSessionConfig.md).[`sttOptions`](SpeechSessionConfig.md#sttoptions)

***

### sttProviderId?

> `optional` **sttProviderId**: `string`

Defined in: [packages/agentos/src/speech/types.ts:347](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L347)

***

### ttsOptions?

> `optional` **ttsOptions**: [`SpeechSynthesisOptions`](SpeechSynthesisOptions.md)

Defined in: [packages/agentos/src/speech/types.ts:274](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L274)

#### Inherited from

[`SpeechSessionConfig`](SpeechSessionConfig.md).[`ttsOptions`](SpeechSessionConfig.md#ttsoptions)

***

### ttsProviderId?

> `optional` **ttsProviderId**: `string`

Defined in: [packages/agentos/src/speech/types.ts:348](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L348)

***

### vad?

> `optional` **vad**: [`AdaptiveVADConfig`](AdaptiveVADConfig.md)

Defined in: [packages/agentos/src/speech/types.ts:275](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L275)

#### Inherited from

[`SpeechSessionConfig`](SpeechSessionConfig.md).[`vad`](SpeechSessionConfig.md#vad)

***

### vadProviderId?

> `optional` **vadProviderId**: `string`

Defined in: [packages/agentos/src/speech/types.ts:349](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L349)

***

### wakeWord?

> `optional` **wakeWord**: `object`

Defined in: [packages/agentos/src/speech/types.ts:277](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L277)

#### keyword?

> `optional` **keyword**: `string`

#### Inherited from

[`SpeechSessionConfig`](SpeechSessionConfig.md).[`wakeWord`](SpeechSessionConfig.md#wakeword)

***

### wakeWordProviderId?

> `optional` **wakeWordProviderId**: `string`

Defined in: [packages/agentos/src/speech/types.ts:350](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/speech/types.ts#L350)
