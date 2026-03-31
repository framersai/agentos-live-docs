# Class: AzureSpeechTTSProvider

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:211](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L211)

Text-to-speech provider that uses the Azure Cognitive Services Speech REST API.

## SSML Generation

Azure's TTS REST endpoint requires SSML (Speech Synthesis Markup Language) as
the request body — it does not accept plain text. This provider generates
minimal SSML via `buildSsml()` that wraps the input text in `<speak>`
and `<voice>` elements. Special XML characters in the text are escaped via
`escapeXml()` to prevent malformed XML.

## `X-Microsoft-OutputFormat` Options

The `X-Microsoft-OutputFormat` header controls the audio encoding. This
provider uses `'audio-24khz-96kbitrate-mono-mp3'` which provides:
- 24 kHz sample rate (high quality for speech)
- 96 kbps bitrate (good balance of quality and file size)
- Mono channel (sufficient for speech synthesis)
- MP3 format (universally supported)

Other available formats include:
- `'audio-16khz-128kbitrate-mono-mp3'` — Lower sample rate, higher bitrate
- `'audio-24khz-160kbitrate-mono-mp3'` — Higher bitrate for better quality
- `'riff-24khz-16bit-mono-pcm'` — Uncompressed WAV
- `'ogg-24khz-16bit-mono-opus'` — Opus codec in OGG container

## See

 - https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech#audio-outputs

## Voice Listing

The [listAvailableVoices](#listavailablevoices) method fetches the full list of neural voices
available in the configured Azure region via
`GET /cognitiveservices/voices/list`. Results are mapped to the normalized
[SpeechVoice](../interfaces/SpeechVoice.md) shape.
 - [AzureSpeechTTSProviderConfig](../interfaces/AzureSpeechTTSProviderConfig.md) for configuration options
 - [AzureSpeechSTTProvider](AzureSpeechSTTProvider.md) for the corresponding STT provider

## Example

```ts
const provider = new AzureSpeechTTSProvider({
  key: process.env.AZURE_SPEECH_KEY!,
  region: 'eastus',
  defaultVoice: 'en-US-GuyNeural',
});
const result = await provider.synthesize('Hello world');
// result.audioBuffer contains MP3 bytes
// result.mimeType === 'audio/mpeg'
```

## Implements

- [`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md)

## Constructors

### Constructor

> **new AzureSpeechTTSProvider**(`config`): `AzureSpeechTTSProvider`

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:246](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L246)

Creates a new AzureSpeechTTSProvider.

#### Parameters

##### config

[`AzureSpeechTTSProviderConfig`](../interfaces/AzureSpeechTTSProviderConfig.md)

Provider configuration including the subscription key,
  region, and optional default voice.

#### Returns

`AzureSpeechTTSProvider`

#### Example

```ts
const provider = new AzureSpeechTTSProvider({
  key: 'your-azure-subscription-key',
  region: 'westeurope',
  defaultVoice: 'de-DE-ConradNeural',
});
```

## Properties

### displayName

> `readonly` **displayName**: `"Azure Speech (TTS)"` = `'Azure Speech (TTS)'`

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:216](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L216)

Human-readable display name for UI and logging.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`displayName`](../interfaces/TextToSpeechProvider.md#displayname)

***

### id

> `readonly` **id**: `"azure-speech-tts"` = `'azure-speech-tts'`

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:213](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L213)

Unique provider identifier used for registration and resolution.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`id`](../interfaces/TextToSpeechProvider.md#id)

***

### supportsStreaming

> `readonly` **supportsStreaming**: `true` = `true`

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:223](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L223)

Marked as streaming-capable because the provider can be used within a
streaming pipeline — though the actual HTTP request is a single
synchronous call that returns the complete audio buffer.

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`supportsStreaming`](../interfaces/TextToSpeechProvider.md#supportsstreaming)

## Methods

### getProviderName()

> **getProviderName**(): `string`

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:261](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L261)

Returns the human-readable provider name.

#### Returns

`string`

The display name string `'Azure Speech (TTS)'`.

#### Example

```ts
provider.getProviderName(); // 'Azure Speech (TTS)'
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`getProviderName`](../interfaces/TextToSpeechProvider.md#getprovidername)

***

### listAvailableVoices()

> **listAvailableVoices**(): `Promise`\<[`SpeechVoice`](../interfaces/SpeechVoice.md)[]\>

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:353](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L353)

Retrieves the list of available neural voices from the Azure region.

Fetches from `GET /cognitiveservices/voices/list` and maps each entry
to the normalized [SpeechVoice](../interfaces/SpeechVoice.md) shape. The list includes all
neural and standard voices available in the configured region.

#### Returns

`Promise`\<[`SpeechVoice`](../interfaces/SpeechVoice.md)[]\>

A promise resolving to an array of normalized voice entries.

#### Throws

When the Azure API returns a non-2xx status code
  (e.g. invalid key, network error).

#### Example

```ts
const voices = await provider.listAvailableVoices();
const englishVoices = voices.filter(v => v.lang.startsWith('en-'));
console.log(`Found ${englishVoices.length} English voices`);
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`listAvailableVoices`](../interfaces/TextToSpeechProvider.md#listavailablevoices)

***

### synthesize()

> **synthesize**(`text`, `options?`): `Promise`\<[`SpeechSynthesisResult`](../interfaces/SpeechSynthesisResult.md)\>

Defined in: [packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts:288](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/speech/providers/AzureSpeechTTSProvider.ts#L288)

Synthesizes speech from plain text using the Azure TTS REST endpoint.

The text is wrapped in SSML, sent to Azure, and the response audio buffer
(MP3 format) is returned along with metadata.

#### Parameters

##### text

`string`

The plain-text utterance to convert to audio. XML special
  characters are automatically escaped.

##### options?

[`SpeechSynthesisOptions`](../interfaces/SpeechSynthesisOptions.md) = `{}`

Optional synthesis settings. Use `options.voice` to
  override the default voice with any valid Azure voice short-name.

#### Returns

`Promise`\<[`SpeechSynthesisResult`](../interfaces/SpeechSynthesisResult.md)\>

A promise resolving to the MP3 audio buffer and metadata.

#### Throws

When the Azure API returns a non-2xx status code.
  Common causes: invalid subscription key (401), region mismatch (404),
  invalid SSML (400), or quota exceeded (429).

#### Example

```ts
const result = await provider.synthesize('Guten Tag!', {
  voice: 'de-DE-ConradNeural',
});
fs.writeFileSync('output.mp3', result.audioBuffer);
```

#### Implementation of

[`TextToSpeechProvider`](../interfaces/TextToSpeechProvider.md).[`synthesize`](../interfaces/TextToSpeechProvider.md#synthesize)
