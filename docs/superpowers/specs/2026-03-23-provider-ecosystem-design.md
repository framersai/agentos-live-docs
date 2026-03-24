# Provider Ecosystem Buildout — Design Spec

**Sub-project C** of the Voice Pipeline initiative (B → C → A).

**Goal:** Implement 11 speech providers (4 core fetch-only + 7 extension packs) and build a `SpeechProviderResolver` that handles capability-based resolution, priority chains, and automatic fallback — making provider selection hybrid, abstracted, and zero-config where possible.

**Architecture:** Fetch-only cloud providers (Deepgram batch, AssemblyAI, Azure STT/TTS) go in `packages/agentos/src/speech/providers/`. SDK-dependent providers (Google, Polly, Vosk, Piper, Porcupine, OpenWakeWord) ship as extension packs in `packages/agentos-extensions/registry/curated/voice/`. A new `SpeechProviderResolver` in core handles discovery, capability matching, priority chains, and fallback. Everything is TypeScript native — no Python.

**Tech Stack:** TypeScript, fetch API, vitest. Extension SDKs: `@google-cloud/speech`, `@google-cloud/text-to-speech`, `@aws-sdk/client-polly`, `vosk`, `@picovoice/porcupine-node`, `onnxruntime-node`.

---

## 1. Scope

### In Scope

- 4 core providers: Deepgram batch STT, AssemblyAI STT, Azure Speech STT, Azure Speech TTS
- 7 extension packs: Google Cloud STT, Google Cloud TTS, Amazon Polly, Vosk, Piper, Porcupine, OpenWakeWord
- `SpeechProviderResolver` — capability-based resolution + priority chain + fallback
- `SpeechRuntime` update to use resolver
- Provider catalog updates (mark 4 Python-only providers as `available: false`)
- Tests for all providers and resolver

### Out of Scope

- NVIDIA NeMo (Python-only, no Node.js bindings) — `available: false`
- Coqui XTTS (Python-only) — `available: false`
- Bark (Python-only) — `available: false`
- StyleTTS2 (Python-only) — `available: false`
- Streaming STT/TTS providers (already built in Sub-project B)
- Telephony providers (Sub-project A)

---

## 2. SpeechProviderResolver

New file: `packages/agentos/src/speech/SpeechProviderResolver.ts`

### Interface

```typescript
interface SpeechProviderResolver extends EventEmitter {
  /** Resolve best STT provider matching requirements */
  resolveSTT(requirements?: ProviderRequirements): SpeechToTextProvider;

  /** Resolve best TTS provider matching requirements */
  resolveTTS(requirements?: ProviderRequirements): TextToSpeechProvider;

  /** Resolve VAD provider (always local) */
  resolveVAD(): SpeechVadProvider;

  /** Resolve wake-word provider if available */
  resolveWakeWord(): WakeWordProvider | null;

  /** Get all registered providers by kind */
  listProviders(kind: SpeechProviderKind): ProviderRegistration[];

  /** Register a provider manually */
  register(registration: ProviderRegistration): void;

  /** Refresh discovery (re-scan for installed extensions) */
  refresh(): Promise<void>;

  // Events:
  // 'provider_fallback' -> { from: string, to: string, kind: string, error: Error }
  // 'provider_registered' -> { id: string, kind: string, source: string }
}

interface ProviderRequirements {
  /** Require streaming support */
  streaming?: boolean;
  /** Require local/offline operation */
  local?: boolean;
  /** Require specific features (e.g. 'diarization', 'timestamps') */
  features?: string[];
  /** Explicit priority chain — try these IDs in order */
  preferredIds?: string[];
}

interface ProviderRegistration {
  id: string;
  kind: SpeechProviderKind;
  provider: SpeechToTextProvider | TextToSpeechProvider | SpeechVadProvider | WakeWordProvider;
  catalogEntry: SpeechProviderCatalogEntry;
  /** Whether required env vars are present */
  isConfigured: boolean;
  /** Lower = higher priority. Core defaults: 100, extensions: 200, user overrides: 50 */
  priority: number;
  /** Where this provider was loaded from */
  source: 'core' | 'extension';
}
```

### Relationship to Existing SpeechProviderRegistry

`SpeechProviderResolver` replaces `SpeechProviderRegistry` as the public API. Internally, `SpeechProviderResolver` owns a `Map<string, ProviderRegistration>` (the same role `SpeechProviderRegistry` played). `SpeechProviderRegistry` is deprecated but kept as a re-export alias for backwards compatibility. `SpeechRuntime` replaces its `registry` field with a `resolver` field.

### Resolution Algorithm — STT and TTS

```
resolveSTT(requirements) / resolveTTS(requirements):
  1. If requirements.preferredIds is set:
     - For each ID in order:
       a. Find registration by ID
       b. Skip if not configured (missing env vars)
       c. Skip if doesn't match requirements (streaming, local, features)
       d. Return first match
  2. Else (no preferred list):
     - Get all registrations where kind === 'stt' (or 'tts')
     - Filter by requirements (streaming, local, features)
     - Filter by isConfigured === true
     - Sort by priority (ascending)
     - Return first match
  3. If no match found: throw Error('No configured STT/TTS provider matches requirements')
```

### Resolution Algorithm — VAD

```
resolveVAD():
  1. Get all registrations where kind === 'vad'
  2. Sort by priority (ascending)
  3. Return first configured match
  4. If none registered: return the built-in AdaptiveVAD (always available, always registered at priority 100)
  5. AdaptiveVAD is guaranteed to be registered — it requires no env vars and is always local
```

### Resolution Algorithm — Wake-Word

```
resolveWakeWord():
  1. Get all registrations where kind === 'wake-word'
  2. Filter by isConfigured === true
  3. Sort by priority (ascending)
  4. Return first match, or null if none configured
  5. Wake-word is entirely optional — returning null means no wake-word detection
```

### Fallback Wrapper

When `fallback: true` in config, the resolver wraps the returned provider in a `FallbackProxy` that catches errors and retries with the next provider in the chain:

```typescript
class FallbackSTTProxy implements SpeechToTextProvider {
  constructor(
    private readonly chain: SpeechToTextProvider[],
    private readonly resolver: SpeechProviderResolver
  ) {}

  async transcribe(audio, options) {
    for (let i = 0; i < this.chain.length; i++) {
      try {
        return await this.chain[i].transcribe(audio, options);
      } catch (error) {
        if (i < this.chain.length - 1) {
          this.resolver.emit('provider_fallback', {
            from: this.chain[i].id,
            to: this.chain[i + 1].id,
            kind: 'stt',
            error,
          });
        } else {
          throw error; // last provider, no fallback
        }
      }
    }
    throw new Error('No providers in fallback chain');
  }
}

class FallbackTTSProxy implements TextToSpeechProvider {
  readonly id: string;
  readonly displayName = 'Fallback TTS';
  readonly supportsStreaming = false;

  constructor(
    private readonly chain: TextToSpeechProvider[],
    private readonly resolver: SpeechProviderResolver
  ) {
    this.id = chain[0]?.id ?? 'fallback-tts';
  }

  async synthesize(text: string, options?: SpeechSynthesisOptions): Promise<SpeechSynthesisResult> {
    for (let i = 0; i < this.chain.length; i++) {
      try {
        return await this.chain[i].synthesize(text, options);
      } catch (error) {
        if (i < this.chain.length - 1) {
          this.resolver.emit('provider_fallback', {
            from: this.chain[i].id,
            to: this.chain[i + 1].id,
            kind: 'tts',
            error,
          });
        } else {
          throw error;
        }
      }
    }
    throw new Error('No providers in fallback chain');
  }

  getProviderName(): string {
    return this.chain[0]?.getProviderName() ?? 'fallback';
  }
}
```

Both proxies share the same pattern — `FallbackProxy.ts` exports both classes.

### Auto-Discovery

```
SpeechProviderResolver.refresh():
  1. Register all core providers via an explicit static list (no filesystem scanning):
     - OpenAIWhisperSpeechToTextProvider, DeepgramBatchSTTProvider, AssemblyAISTTProvider,
       AzureSpeechSTTProvider, OpenAITextToSpeechProvider, ElevenLabsTextToSpeechProvider,
       AzureSpeechTTSProvider, BuiltInAdaptiveVadProvider
     - Each is instantiated only if its env vars are present (lazy: create on first resolve, not at scan time)
     - Check env vars for each, mark isConfigured
     - Default priority: 100
  2. Ask ExtensionManager for descriptors with kinds:
     'stt-provider', 'tts-provider', 'vad-provider', 'wake-word-provider'
     - For each descriptor, extract the provider instance from payload
     - Check env vars from catalog entry, mark isConfigured
     - Default priority: 200
  3. Apply user config overrides (from agent.config.json speech.stt.preferred etc.)
     - Set priority based on position in preferred list (50, 51, 52, ...)
  4. Sort registrations by priority within each kind
  5. Emit 'provider_registered' for each new registration
```

---

## 3. Core Providers

All live in `packages/agentos/src/speech/providers/`. Each is a single file implementing `SpeechToTextProvider` or `TextToSpeechProvider`. Zero npm dependencies (fetch-only).

### 3.1 DeepgramBatchSTTProvider

```typescript
export class DeepgramBatchSTTProvider implements SpeechToTextProvider {
  readonly id = 'deepgram-batch';
  readonly displayName = 'Deepgram';
  readonly supportsStreaming = false;

  constructor(
    private readonly apiKey: string,
    private readonly config?: {
      model?: string; // default 'nova-2'
      language?: string; // default 'en-US'
    }
  ) {}

  async transcribe(
    audio: SpeechAudioInput,
    options?: SpeechTranscriptionOptions
  ): Promise<SpeechTranscriptionResult> {
    // POST https://api.deepgram.com/v1/listen?model=${model}&punctuate=true&diarize=${diarize}&language=${lang}
    // Headers: Authorization: Token ${apiKey}, Content-Type: audio/wav (or detected)
    // Response: { results: { channels: [{ alternatives: [{ transcript, confidence, words }] }] } }
    // Map words[].start/end to SpeechTranscriptionSegment with timestamps
  }

  getProviderName(): string {
    return 'deepgram';
  }
}
```

Env: `DEEPGRAM_API_KEY`

### 3.2 AssemblyAISTTProvider

```typescript
export class AssemblyAISTTProvider implements SpeechToTextProvider {
  readonly id = 'assemblyai';
  readonly displayName = 'AssemblyAI';
  readonly supportsStreaming = false;

  constructor(private readonly apiKey: string) {}

  async transcribe(
    audio: SpeechAudioInput,
    options?: SpeechTranscriptionOptions
  ): Promise<SpeechTranscriptionResult> {
    // Step 1: POST https://api.assemblyai.com/v2/upload — upload audio, get upload_url
    // Step 2: POST https://api.assemblyai.com/v2/transcript — { audio_url, language_code, speaker_labels }
    // Step 3: Poll GET https://api.assemblyai.com/v2/transcript/{id} until status === 'completed'
    // Map response.words[] with speaker labels to SpeechTranscriptionResult
    // Poll interval: 1s, max 120s timeout
    // Uses AbortController: pass signal to all fetch calls, abort on dispose() or external cancellation
    // The AbortSignal can be passed via options.providerSpecificOptions.signal
  }

  getProviderName(): string {
    return 'assemblyai';
  }
}
```

Env: `ASSEMBLYAI_API_KEY`

### 3.3 AzureSpeechSTTProvider

```typescript
export class AzureSpeechSTTProvider implements SpeechToTextProvider {
  readonly id = 'azure-speech-stt';
  readonly displayName = 'Azure Speech STT';
  readonly supportsStreaming = false; // This is the batch REST endpoint; catalog entry updated to streaming: false

  constructor(
    private readonly key: string,
    private readonly region: string
  ) {}

  async transcribe(
    audio: SpeechAudioInput,
    options?: SpeechTranscriptionOptions
  ): Promise<SpeechTranscriptionResult> {
    // POST https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${lang}
    // Headers: Ocp-Apim-Subscription-Key: ${key}, Content-Type: audio/wav
    // Response: { RecognitionStatus, DisplayText, Duration, Offset }
  }

  getProviderName(): string {
    return 'azure-speech-stt';
  }
}
```

Env: `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`

### 3.4 AzureSpeechTTSProvider

```typescript
export class AzureSpeechTTSProvider implements TextToSpeechProvider {
  readonly id = 'azure-speech-tts';
  readonly displayName = 'Azure Speech TTS';
  readonly supportsStreaming = true;

  constructor(
    private readonly key: string,
    private readonly region: string
  ) {}

  async synthesize(text: string, options?: SpeechSynthesisOptions): Promise<SpeechSynthesisResult> {
    // POST https://${region}.tts.speech.microsoft.com/cognitiveservices/v1
    // Body: SSML <speak version="1.0" xmlns="..."><voice name="${voice}">${text}</voice></speak>
    // Headers: Ocp-Apim-Subscription-Key, Content-Type: application/ssml+xml, X-Microsoft-OutputFormat: audio-24khz-96kbitrate-mono-mp3
    // Response: raw audio buffer
  }

  async listAvailableVoices(): Promise<SpeechVoice[]> {
    // GET https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list
    // Map to SpeechVoice[]
  }

  getProviderName(): string {
    return 'azure-speech-tts';
  }
}
```

Env: `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION`

---

## 4. Extension Pack Providers

All live in `packages/agentos-extensions/registry/curated/voice/` (the same `packages/agentos-extensions` package used for guardrail and streaming packs in Sub-project B). Each follows the established extension pack pattern: `package.json`, `tsconfig.json`, `vitest.config.ts`, `manifest.json`, `SKILL.md`, `src/index.ts` with `createExtensionPack()` factory. Tests live in `<pack>/test/<ProviderName>.spec.ts` alongside the pack's `vitest.config.ts`.

### 4.1 google-cloud-stt (`@framers/agentos-ext-google-cloud-stt`)

- Peer dep: `@google-cloud/speech`
- Implements `SpeechToTextProvider`
- `new SpeechClient({ keyFilename })` or `new SpeechClient({ credentials: JSON.parse(creds) })`
- `client.recognize({ audio: { content: base64 }, config: { encoding: 'LINEAR16', sampleRateHertz, languageCode } })`
- Maps `response.results[].alternatives[].words[]` to segments with timestamps
- Env: `GOOGLE_STT_CREDENTIALS` (path to JSON file or JSON string)

### 4.2 google-cloud-tts (`@framers/agentos-ext-google-cloud-tts`)

- Peer dep: `@google-cloud/text-to-speech`
- Implements `TextToSpeechProvider`
- `client.synthesizeSpeech({ input: { text }, voice: { languageCode, name }, audioConfig: { audioEncoding: 'MP3' } })`
- `listAvailableVoices()` via `client.listVoices({})`
- Env: `GOOGLE_TTS_CREDENTIALS`

### 4.3 amazon-polly (`@framers/agentos-ext-amazon-polly`)

- Peer dep: `@aws-sdk/client-polly`
- Implements `TextToSpeechProvider`
- `new PollyClient({ region, credentials: { accessKeyId, secretAccessKey } })`
- `SynthesizeSpeechCommand({ Engine: 'neural', OutputFormat: 'mp3', Text, VoiceId })`
- `listAvailableVoices()` via `DescribeVoicesCommand()`
- Env: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`

### 4.4 vosk (`@framers/agentos-ext-vosk`)

- Peer dep: `vosk`
- Implements `SpeechToTextProvider`
- `new Model(modelPath)` → `new Recognizer({ model, sampleRate: 16000 })`
- `recognizer.acceptWaveform(buffer)` → `recognizer.result()` → `{ text }`
- Model path from `VOSK_MODEL_PATH` or `~/.agentos/models/vosk/`
- Model lazy-loaded via a module-level singleton (`let model: Model | undefined` with lazy init on first `transcribe()` call) — shared across calls
- Local, offline, no API key needed

### 4.5 piper (`@framers/agentos-ext-piper`)

- Peer dep: none (shells out to `piper` C++ binary via `child_process.spawn`)
- Implements `TextToSpeechProvider`
- Uses `spawn('piper', ['--model', modelPath, '--output_file', '-'])` with text written to stdin, WAV collected from stdout
- Configurable `maxBufferBytes` (default 10MB) and `timeoutMs` (default 30000) to prevent runaway processes
- Binary path from `PIPER_BIN` or searches `PATH`
- Model path from `PIPER_MODEL_PATH` or `~/.agentos/models/piper/`
- Local, offline, no API key needed
- NOT Python — Piper is a standalone compiled C++ binary

### 4.6 porcupine (`@framers/agentos-ext-porcupine`)

- Peer dep: `@picovoice/porcupine-node`
- Implements `WakeWordProvider`
- `new Porcupine(accessKey, keywords, sensitivities)` (Node.js SDK v3 constructor)
- `detect(frame)`: `porcupine.process(frame)` → returns keyword index or -1
- Keywords configurable via options: `['hey computer', 'ok agent']`
- Sensitivities configurable: `[0.5, 0.5]`
- `dispose()`: `porcupine.release()`
- Env: `PICOVOICE_ACCESS_KEY`

### 4.7 openwakeword (`@framers/agentos-ext-openwakeword`)

- Peer dep: `onnxruntime-node`
- Implements `WakeWordProvider`
- Loads ONNX wake-word model (~2MB, e.g. `hey_mycroft_v0.1.onnx`)
- Processes 80ms frames (1280 samples at 16kHz)
- Computes mel-spectrogram features → feeds to ONNX model → probability
- Detection when probability > threshold (default 0.5)
- Model path from `OPENWAKEWORD_MODEL_PATH` or `~/.agentos/models/openwakeword/`
- Model loaded lazily via `ISharedServiceRegistry.getOrCreate()`
- Local, offline, no API key needed

---

## 5. SpeechRuntime Update

### Config Schema Update

Add to `packages/agentos/src/speech/types.ts`:

```typescript
interface SpeechResolverConfig {
  stt?: {
    preferred?: string[]; // priority chain, e.g. ['deepgram-batch', 'assemblyai', 'openai-whisper']
    fallback?: boolean; // default false
  };
  tts?: {
    preferred?: string[];
    voice?: string;
    fallback?: boolean;
  };
  wakeWord?: {
    provider?: string;
    keywords?: string[];
    sensitivity?: number;
  };
}
```

The existing `SpeechRuntimeConfig.preferredSttProviderId` (single string) becomes a deprecated alias — if set, it's treated as `stt.preferred: [value]`. New array-based config takes precedence.

### Migration from SpeechProviderRegistry

`SpeechProviderResolver` replaces `SpeechProviderRegistry`. `SpeechRuntime.registry` is deprecated in favor of `SpeechRuntime.resolver`. The old `SpeechProviderRegistry` class is kept as a re-export for backwards compatibility but internally delegates to the resolver's registration map.

### Changes to SpeechRuntime

Modify `packages/agentos/src/speech/SpeechRuntime.ts`:

- Add `SpeechProviderResolver` as an internal dependency
- `createSpeechRuntime()` creates the resolver, calls `refresh()` for auto-discovery
- `getSTT(requirements?)` delegates to `resolver.resolveSTT(requirements)`
- `getTTS(requirements?)` delegates to `resolver.resolveTTS(requirements)`
- Existing `createSpeechRuntimeFromEnv()` still works — it creates the resolver and auto-discovers from env vars
- Backwards compatible: existing code that uses `SpeechRuntime` directly continues to work

---

## 6. Provider Catalog Update

Modify `packages/agentos/src/speech/providerCatalog.ts`:

- Add `available?: boolean` field to `SpeechProviderCatalogEntry`
- Set `available: false` for: `nvidia-nemo`, `coqui`, `bark`, `styletts2`
- These remain in the catalog for documentation/UI purposes but won't be offered for resolution

---

## 7. Configuration

### agent.config.json

```json
{
  "speech": {
    "stt": {
      "preferred": ["deepgram", "assemblyai", "openai-whisper"],
      "fallback": true
    },
    "tts": {
      "preferred": ["elevenlabs", "openai-tts"],
      "voice": "nova",
      "fallback": true
    },
    "wakeWord": {
      "provider": "porcupine",
      "keywords": ["hey agent"],
      "sensitivity": 0.5
    }
  }
}
```

CLI flags already exist for voice pipeline (`--voice-stt`, `--voice-tts`). These feed into the `preferredIds` field of `ProviderRequirements`.

---

## 8. Testing Strategy

**Unit tests (per provider):**

- Each core provider: mock `fetch`, verify correct URL/headers/body, verify response mapping
- Each extension provider: mock the SDK, verify correct method calls and response mapping
- `SpeechProviderResolver`: mock providers, test resolution algorithm, priority sorting, fallback behavior

**Integration tests (resolver-level):**

- Register mix of core + extension providers
- Verify capability-based resolution (streaming, local, features)
- Verify priority chain with fallback
- Verify `provider_fallback` event emission
- Verify auto-discovery from ExtensionManager

**E2E tests (gated behind `SPEECH_E2E=true`):**

- Real API calls to each cloud provider with test audio
- Gated per-provider: `DEEPGRAM_E2E=true`, `AZURE_E2E=true`, etc.

---

## 9. File Map

### Core (`packages/agentos/src/speech/`)

| File                                    | Action                                                                        |
| --------------------------------------- | ----------------------------------------------------------------------------- |
| `SpeechProviderResolver.ts`             | NEW — central resolver                                                        |
| `FallbackProxy.ts`                      | NEW — fallback wrapper for STT and TTS                                        |
| `providers/DeepgramBatchSTTProvider.ts` | NEW                                                                           |
| `providers/AssemblyAISTTProvider.ts`    | NEW                                                                           |
| `providers/AzureSpeechSTTProvider.ts`   | NEW                                                                           |
| `providers/AzureSpeechTTSProvider.ts`   | NEW                                                                           |
| `SpeechRuntime.ts`                      | MODIFY — wire resolver                                                        |
| `providerCatalog.ts`                    | MODIFY — add `available` field, mark 4 as unavailable                         |
| `types.ts`                              | MODIFY — add `available?` to `SpeechProviderCatalogEntry`, add resolver types |
| `index.ts`                              | MODIFY — export new providers and resolver                                    |

### Extensions (`packages/agentos-extensions/registry/curated/voice/`)

| Pack                | npm Package                             |
| ------------------- | --------------------------------------- |
| `google-cloud-stt/` | `@framers/agentos-ext-google-cloud-stt` |
| `google-cloud-tts/` | `@framers/agentos-ext-google-cloud-tts` |
| `amazon-polly/`     | `@framers/agentos-ext-amazon-polly`     |
| `vosk/`             | `@framers/agentos-ext-vosk`             |
| `piper/`            | `@framers/agentos-ext-piper`            |
| `porcupine/`        | `@framers/agentos-ext-porcupine`        |
| `openwakeword/`     | `@framers/agentos-ext-openwakeword`     |
