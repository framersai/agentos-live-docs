# Provider Ecosystem Buildout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 11 speech providers and a SpeechProviderResolver with capability-based resolution, priority chains, and automatic fallback.

**Architecture:** 4 fetch-only providers in core (`packages/agentos/src/speech/providers/`), 7 SDK-dependent extension packs (`packages/agentos-extensions/registry/curated/voice/`), 1 resolver + fallback proxy in core, SpeechRuntime updated to use resolver. All TypeScript native.

**Tech Stack:** TypeScript, fetch API, vitest. Extension SDKs: `@google-cloud/speech`, `@google-cloud/text-to-speech`, `@aws-sdk/client-polly`, `vosk`, `@picovoice/porcupine-node`, `onnxruntime-node`.

**Spec:** `docs/superpowers/specs/2026-03-23-provider-ecosystem-design.md`

---

## File Structure

### Core (`packages/agentos/src/speech/`)

| File                                    | Action | Responsibility                                                                                 |
| --------------------------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| `types.ts`                              | MODIFY | Add `SpeechResolverConfig`, `ProviderRequirements`, `ProviderRegistration`, `available?` field |
| `SpeechProviderResolver.ts`             | NEW    | Central resolver with resolution algorithms + auto-discovery                                   |
| `FallbackProxy.ts`                      | NEW    | `FallbackSTTProxy` + `FallbackTTSProxy`                                                        |
| `providers/DeepgramBatchSTTProvider.ts` | NEW    | Deepgram batch REST STT                                                                        |
| `providers/AssemblyAISTTProvider.ts`    | NEW    | AssemblyAI upload+poll STT                                                                     |
| `providers/AzureSpeechSTTProvider.ts`   | NEW    | Azure Speech batch REST STT                                                                    |
| `providers/AzureSpeechTTSProvider.ts`   | NEW    | Azure Speech SSML TTS                                                                          |
| `SpeechRuntime.ts`                      | MODIFY | Wire resolver, deprecate registry field                                                        |
| `providerCatalog.ts`                    | MODIFY | Add `available` field, mark 4 as unavailable, add `deepgram-batch` entry                       |
| `index.ts`                              | MODIFY | Export new providers and resolver                                                              |

### Extensions (`packages/agentos-extensions/registry/curated/voice/`)

| Pack                | npm Package                             | Key Dep                        |
| ------------------- | --------------------------------------- | ------------------------------ |
| `google-cloud-stt/` | `@framers/agentos-ext-google-cloud-stt` | `@google-cloud/speech`         |
| `google-cloud-tts/` | `@framers/agentos-ext-google-cloud-tts` | `@google-cloud/text-to-speech` |
| `amazon-polly/`     | `@framers/agentos-ext-amazon-polly`     | `@aws-sdk/client-polly`        |
| `vosk/`             | `@framers/agentos-ext-vosk`             | `vosk`                         |
| `piper/`            | `@framers/agentos-ext-piper`            | none (spawn binary)            |
| `porcupine/`        | `@framers/agentos-ext-porcupine`        | `@picovoice/porcupine-node`    |
| `openwakeword/`     | `@framers/agentos-ext-openwakeword`     | `onnxruntime-node`             |

---

## Task 1: Types and Catalog Update

**Files:**

- Modify: `packages/agentos/src/speech/types.ts`
- Modify: `packages/agentos/src/speech/providerCatalog.ts`
- Test: `packages/agentos/src/speech/__tests__/providerCatalog.spec.ts`

- [ ] **Step 1: Add resolver types to types.ts**

Add these interfaces after the existing `SpeechProviderCatalogEntry`:

```typescript
/** Configuration for the speech provider resolver. */
export interface SpeechResolverConfig {
  stt?: {
    preferred?: string[];
    fallback?: boolean;
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

/** Requirements for provider resolution. */
export interface ProviderRequirements {
  streaming?: boolean;
  local?: boolean;
  features?: string[];
  preferredIds?: string[];
}

/** A registered provider with metadata. */
export interface ProviderRegistration {
  id: string;
  kind: SpeechProviderKind;
  provider: SpeechToTextProvider | TextToSpeechProvider | SpeechVadProvider | WakeWordProvider;
  catalogEntry: SpeechProviderCatalogEntry;
  isConfigured: boolean;
  priority: number;
  source: 'core' | 'extension';
}
```

Also add `available?: boolean` to `SpeechProviderCatalogEntry`.

- [ ] **Step 2: Update providerCatalog.ts**

Add `available: false` to entries: `nvidia-nemo`, `coqui`, `bark`, `styletts2`.

Add new `deepgram-batch` catalog entry:

```typescript
{
  id: 'deepgram-batch',
  kind: 'stt',
  label: 'Deepgram Batch',
  envVars: ['DEEPGRAM_API_KEY'],
  local: false,
  streaming: false,
  description: 'Batch speech-to-text via Deepgram REST API.',
  features: ['cloud', 'diarization', 'timestamps'],
},
```

Update `azure-speech-stt` entry to `streaming: false`.

- [ ] **Step 3: Write catalog test**

Test that unavailable providers are marked, that `deepgram-batch` entry exists, and that `findSpeechProviderCatalogEntry` works for new entries.

- [ ] **Step 4: Run tests, verify pass**

Run: `cd packages/agentos && ./node_modules/.bin/vitest run src/speech/__tests__/providerCatalog.spec.ts`

- [ ] **Step 5: Commit**

```bash
git add src/speech/types.ts src/speech/providerCatalog.ts src/speech/__tests__/providerCatalog.spec.ts
git commit -m "feat(speech): add resolver types, catalog updates, mark unavailable providers"
```

---

## Task 2: FallbackProxy

**Files:**

- Create: `packages/agentos/src/speech/FallbackProxy.ts`
- Test: `packages/agentos/src/speech/__tests__/FallbackProxy.spec.ts`

- [ ] **Step 1: Write tests**

Test `FallbackSTTProxy`:

- Single provider succeeds → returns result
- First provider fails, second succeeds → returns second's result, emits `provider_fallback`
- All providers fail → throws last error
- Empty chain → throws

Test `FallbackTTSProxy`:

- Same pattern with `synthesize()` instead of `transcribe()`

- [ ] **Step 2: Implement FallbackProxy.ts**

Two classes: `FallbackSTTProxy implements SpeechToTextProvider` and `FallbackTTSProxy implements TextToSpeechProvider`. Constructor signature matches spec exactly: `constructor(chain: Provider[], resolver: SpeechProviderResolver)` — the second argument is the resolver instance (not a generic EventEmitter), so the proxy can call `this.resolver.emit('provider_fallback', ...)`. Follow the spec — iterate chain, catch errors, emit fallback event, try next.

The `FallbackSTTProxy` must implement all fields: `id` (from first provider), `displayName`, `supportsStreaming`, `getProviderName()`. Same for TTS proxy including optional `listAvailableVoices()` (delegate to first provider that has it).

- [ ] **Step 3: Run tests, verify pass**

- [ ] **Step 4: Commit**

```bash
git add src/speech/FallbackProxy.ts src/speech/__tests__/FallbackProxy.spec.ts
git commit -m "feat(speech): add FallbackSTTProxy and FallbackTTSProxy for provider chain fallback"
```

---

## Task 3: SpeechProviderResolver

**Files:**

- Create: `packages/agentos/src/speech/SpeechProviderResolver.ts`
- Test: `packages/agentos/src/speech/__tests__/SpeechProviderResolver.spec.ts`

This is the most complex task — the central resolver.

- [ ] **Step 1: Write tests**

```typescript
describe('SpeechProviderResolver', () => {
  // Setup: create mock providers implementing the interfaces

  it('resolveSTT returns the first configured provider by priority');
  it('resolveSTT with preferredIds returns first matching configured provider');
  it('resolveSTT filters by streaming requirement');
  it('resolveSTT filters by local requirement');
  it('resolveSTT filters by features');
  it('resolveSTT throws when no provider matches');
  it('resolveSTT with fallback=true wraps in FallbackSTTProxy');

  it('resolveTTS follows same algorithm as resolveSTT');
  it('resolveTTS with fallback=true wraps in FallbackTTSProxy');

  it('resolveVAD returns built-in AdaptiveVAD when no others registered');
  it('resolveVAD returns higher-priority VAD when registered');

  it('resolveWakeWord returns null when none configured');
  it('resolveWakeWord returns configured provider');

  it('register adds a provider');
  it('listProviders returns all providers of a kind');
  it('listProviders returns empty array for unknown kind');

  it('refresh registers core providers based on env vars');
  it('refresh marks unconfigured providers as isConfigured=false');
  it('refresh applies user config preferred priorities (50, 51, 52...)');
  it('refresh discovers extension providers from ExtensionManager with priority 200');
  it('refresh registers extension providers with source: extension');

  it('emits provider_registered on register');
});
```

- [ ] **Step 2: Implement SpeechProviderResolver**

Key implementation details:

- Extends `EventEmitter`
- Internal `registrations = new Map<string, ProviderRegistration>()`
- Constructor takes optional `SpeechResolverConfig`, `env: Record<string, string | undefined>`, and `extensionManager?: ExtensionManager`
- `register(reg)`: store in map, emit `provider_registered`
- `resolveSTT(requirements?)`: implement the resolution algorithm from spec Section 2
- `resolveTTS(requirements?)`: same algorithm for TTS kind
- `resolveVAD()`: return first VAD by priority, guaranteed to have AdaptiveVAD
- `resolveWakeWord()`: return first configured wake-word or null
- `refresh()` follows the spec's 5-step auto-discovery algorithm:
  1. Register core providers via explicit static list (NOT filesystem scanning):
     - OpenAIWhisper, DeepgramBatch, AssemblyAI, AzureSTT, OpenAITTS, ElevenLabs, AzureTTS, AdaptiveVAD
     - Check env vars for each, mark `isConfigured`, default `priority: 100`, `source: 'core'`
     - Providers created lazily: `provider` field stores a getter/proxy that creates the real provider on first use
  2. If `extensionManager` provided, query it for descriptors with kinds:
     `'stt-provider'`, `'tts-provider'`, `'vad-provider'`, `'wake-word-provider'`
     - Extract provider instance from descriptor payload
     - Check env vars from catalog entry, mark `isConfigured`
     - Register with `priority: 200`, `source: 'extension'`
  3. Apply user config preferred priorities:
     - For each ID in `config.stt?.preferred`, find the registration and set `priority = 50 + index`
     - Same for `config.tts?.preferred`
  4. Sort registrations by priority within each kind
  5. Emit `provider_registered` for each new registration
- Fallback wrapping: when `config.stt?.fallback === true`, `resolveSTT` collects all matching configured providers and wraps in `FallbackSTTProxy`

- [ ] **Step 3: Run tests, verify pass**

- [ ] **Step 4: Commit**

```bash
git add src/speech/SpeechProviderResolver.ts src/speech/__tests__/SpeechProviderResolver.spec.ts
git commit -m "feat(speech): add SpeechProviderResolver with capability-based resolution and fallback"
```

---

## Task 4: Core Provider — DeepgramBatchSTTProvider

**Files:**

- Create: `packages/agentos/src/speech/providers/DeepgramBatchSTTProvider.ts`
- Test: `packages/agentos/src/speech/__tests__/DeepgramBatchSTTProvider.spec.ts`

- [ ] **Step 1: Write tests** (mock global `fetch`)

Test:

- Sends POST to correct Deepgram URL with auth header
- Passes model, language, diarize as query params
- Parses response into `SpeechTranscriptionResult` with segments and words
- Maps Deepgram word timestamps to `SpeechTranscriptionSegment`
- Handles error response (401, 400)
- `getProviderName()` returns `'deepgram'`
- `id` is `'deepgram-batch'`, `supportsStreaming` is `false`

- [ ] **Step 2: Implement**

Follow the existing `OpenAIWhisperSpeechToTextProvider` pattern:

- Constructor: `(config: { apiKey: string; model?: string; language?: string; fetchImpl?: typeof fetch })`
- `transcribe()`: POST to `https://api.deepgram.com/v1/listen?model=${model}&punctuate=true&diarize=${diarize}&language=${lang}`
- Headers: `Authorization: Token ${apiKey}`, `Content-Type` from audio.mimeType or `audio/wav`
- Body: raw audio buffer
- Parse: `response.results.channels[0].alternatives[0]` → extract transcript, confidence, words with timestamps

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(speech): add DeepgramBatchSTTProvider"
```

---

## Task 5: Core Provider — AssemblyAISTTProvider

**Files:**

- Create: `packages/agentos/src/speech/providers/AssemblyAISTTProvider.ts`
- Test: `packages/agentos/src/speech/__tests__/AssemblyAISTTProvider.spec.ts`

- [ ] **Step 1: Write tests** (mock `fetch`)

Test the 3-step flow:

- Step 1: upload → correct URL, auth header, returns upload_url
- Step 2: create transcript → correct body with audio_url and speaker_labels
- Step 3: poll → handles 'queued', 'processing', 'completed', 'error' statuses
- Maps completed response to `SpeechTranscriptionResult`
- Respects AbortSignal (via `providerSpecificOptions.signal`)
- Timeout after 120s (use fake timers)

- [ ] **Step 2: Implement**

3-step async flow:

1. `POST /v2/upload` with audio buffer → `{ upload_url }`
2. `POST /v2/transcript` with `{ audio_url, language_code, speaker_labels }` → `{ id }`
3. Poll `GET /v2/transcript/${id}` every 1s until `status === 'completed'` or timeout

- Wire AbortController through all fetches
- Map `response.words[]` with `speaker` field to segments

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(speech): add AssemblyAISTTProvider with upload+poll flow"
```

---

## Task 6: Core Provider — AzureSpeechSTTProvider

**Files:**

- Create: `packages/agentos/src/speech/providers/AzureSpeechSTTProvider.ts`
- Test: `packages/agentos/src/speech/__tests__/AzureSpeechSTTProvider.spec.ts`

- [ ] **Step 1: Write tests**

Test:

- Correct URL with region and language
- `Ocp-Apim-Subscription-Key` header
- Parses `{ RecognitionStatus: 'Success', DisplayText, Duration, Offset }`
- Handles `RecognitionStatus: 'NoMatch'` and error statuses

- [ ] **Step 2: Implement**

Single POST to `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${lang}`.

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(speech): add AzureSpeechSTTProvider"
```

---

## Task 7: Core Provider — AzureSpeechTTSProvider

**Files:**

- Create: `packages/agentos/src/speech/providers/AzureSpeechTTSProvider.ts`
- Test: `packages/agentos/src/speech/__tests__/AzureSpeechTTSProvider.spec.ts`

- [ ] **Step 1: Write tests**

Test:

- Correct URL with region
- SSML body construction: `<speak version="1.0" xmlns="..."><voice name="${voice}">${text}</voice></speak>`
- Correct headers: `Ocp-Apim-Subscription-Key`, `Content-Type: application/ssml+xml`, `X-Microsoft-OutputFormat`
- Returns audio buffer as `SpeechSynthesisResult`
- `listAvailableVoices()` calls correct endpoint and maps response

- [ ] **Step 2: Implement**

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(speech): add AzureSpeechTTSProvider with SSML synthesis"
```

---

## Task 8: SpeechRuntime Update

**Files:**

- Modify: `packages/agentos/src/speech/SpeechRuntime.ts`
- Modify: `packages/agentos/src/speech/index.ts`
- Test: `packages/agentos/src/speech/__tests__/SpeechRuntime.spec.ts` (update existing)

- [ ] **Step 1: Read existing SpeechRuntime.ts and its tests**

Understand current registration flow, `hydrateFromExtensionManager()`, and how providers are currently resolved.

- [ ] **Step 2: Add resolver to SpeechRuntime**

- Add `private resolver: SpeechProviderResolver` field
- In constructor: create resolver, call the existing env-based registration through the resolver instead of directly through the registry
- **Deprecation bridge:** If `config.preferredSttProviderId` (single string) is set and no `config.resolverConfig?.stt?.preferred` array exists, bridge it as `stt: { preferred: [config.preferredSttProviderId] }`. Same for `preferredTtsProviderId` → `tts: { preferred: [value] }`.
- Add `getSTT(requirements?)` and `getTTS(requirements?)` methods that delegate to resolver
- Keep existing `registry` field as a deprecated getter that returns a compatibility wrapper
- The existing `getSttProvider()` and `getTtsProvider()` methods should delegate to `resolver.resolveSTT()` / `resolver.resolveTTS()`
- `hydrateFromExtensionManager()` should pass the ExtensionManager to the resolver and call `resolver.refresh()`

- [ ] **Step 3: Update index.ts exports**

Export `SpeechProviderResolver`, `FallbackSTTProxy`, `FallbackTTSProxy`, all new providers, and new types.

- [ ] **Step 4: Run all speech tests**

Run: `cd packages/agentos && ./node_modules/.bin/vitest run src/speech/__tests__/`
Expected: All existing + new tests pass

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(speech): wire SpeechProviderResolver into SpeechRuntime"
```

---

## Task 9: Extension Pack — Google Cloud STT

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/google-cloud-stt/` (full pack)

- [ ] **Step 1: Scaffold package** (`package.json`, `tsconfig.json`, `vitest.config.ts`, `manifest.json`, `SKILL.md`)

Peer dep: `@google-cloud/speech`. Follow the same structure as `streaming-stt-deepgram`.

- [ ] **Step 2: Write tests** (mock `@google-cloud/speech`)

Test:

- Creates SpeechClient with correct credentials (keyFilename path or JSON string)
- Calls `client.recognize()` with correct config (encoding, sampleRate, languageCode)
- Maps response to `SpeechTranscriptionResult`
- Handles empty results

- [ ] **Step 3: Implement GoogleCloudSTTProvider + index.ts**

- [ ] **Step 4: Run tests, commit**

```bash
git commit -m "feat(ext): add google-cloud-stt extension pack"
```

---

## Task 10: Extension Pack — Google Cloud TTS

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/google-cloud-tts/` (full pack)

- [ ] **Step 1: Scaffold + write tests** (mock `@google-cloud/text-to-speech`)

Test: `synthesizeSpeech()` with correct params, `listVoices()` mapping, credential handling.

- [ ] **Step 2: Implement + commit**

```bash
git commit -m "feat(ext): add google-cloud-tts extension pack"
```

---

## Task 11: Extension Pack — Amazon Polly

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/amazon-polly/` (full pack)

- [ ] **Step 1: Scaffold + write tests** (mock `@aws-sdk/client-polly`)

Test: `SynthesizeSpeechCommand` with correct params, `DescribeVoicesCommand` for voice listing, credential passing.

- [ ] **Step 2: Implement + commit**

```bash
git commit -m "feat(ext): add amazon-polly extension pack"
```

---

## Task 12: Extension Pack — Vosk

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/vosk/` (full pack)

- [ ] **Step 1: Scaffold + write tests** (mock `vosk` module)

Test:

- Model lazy-loaded on first transcribe call (singleton)
- `recognizer.acceptWaveform()` called with audio buffer
- `recognizer.result()` mapped to `SpeechTranscriptionResult`
- Model path from env or default
- Handles missing model path gracefully

- [ ] **Step 2: Implement + commit**

Key: module-level `let model: Model | undefined` for lazy singleton. On first `transcribe()`, create Model from `VOSK_MODEL_PATH` or `~/.agentos/models/vosk/`.

```bash
git commit -m "feat(ext): add vosk local STT extension pack"
```

---

## Task 13: Extension Pack — Piper

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/piper/` (full pack)

- [ ] **Step 1: Scaffold + write tests** (mock `child_process.spawn`)

Test:

- Spawns `piper` binary with correct args
- Writes text to stdin, collects WAV from stdout
- Returns audio buffer as `SpeechSynthesisResult`
- Handles process exit with non-zero code
- Respects `maxBufferBytes` and `timeoutMs`
- Binary path from `PIPER_BIN` or PATH

- [ ] **Step 2: Implement + commit**

Use `child_process.spawn('piper', ['--model', modelPath, '--output_file', '-'])`. Write text to stdin, collect stdout chunks into Buffer, resolve on `close` event.

```bash
git commit -m "feat(ext): add piper local TTS extension pack"
```

---

## Task 14: Extension Pack — Porcupine

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/porcupine/` (full pack)

- [ ] **Step 1: Scaffold + write tests** (mock `@picovoice/porcupine-node`)

Test:

- Creates Porcupine with correct accessKey, keywords, sensitivities
- `detect()` calls `porcupine.process()`, returns detection when index >= 0
- Returns null when index === -1
- `dispose()` calls `porcupine.release()`

- [ ] **Step 2: Implement + commit**

```bash
git commit -m "feat(ext): add porcupine wake-word extension pack"
```

---

## Task 15: Extension Pack — OpenWakeWord

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/openwakeword/` (full pack)

- [ ] **Step 1: Scaffold + write tests** (mock `onnxruntime-node`)

Test:

- Loads ONNX model lazily on first detect call
- Processes 80ms audio frames (1280 samples at 16kHz)
- Returns detection when probability > threshold
- Returns null when below threshold
- Model path from env or default
- `dispose()` releases ONNX session

- [ ] **Step 2: Implement**

Key details:

- Compute simple mel-spectrogram features from raw PCM (can use a basic FFT implementation or precomputed filterbank)
- Feed features to ONNX model via `InferenceSession.run()`
- Check output probability against threshold (default 0.5)
- For initial implementation, can use a simplified feature extraction — the model loading and inference path is the important part

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(ext): add openwakeword ONNX wake-word extension pack"
```

---

## Task 16: Integration Test

**Files:**

- Create: `packages/agentos/src/speech/__tests__/resolver-integration.spec.ts`

- [ ] **Step 1: Write integration test**

Test the full resolver flow with mock providers:

1. Create `SpeechProviderResolver` with mock env vars
2. Call `refresh()` → verify core providers registered
3. `resolveSTT()` → returns OpenAI Whisper (first configured)
4. `resolveSTT({ preferredIds: ['deepgram-batch'] })` → returns Deepgram
5. `resolveSTT({ streaming: true })` → skips non-streaming providers
6. `resolveSTT({ local: true })` → returns no cloud providers
7. `resolveTTS()` → returns first configured TTS
8. `resolveVAD()` → always returns AdaptiveVAD
9. `resolveWakeWord()` → returns null when no wake-word configured
10. Fallback: configure `fallback: true`, make first provider throw, verify second is tried, verify `provider_fallback` event
11. ExtensionManager discovery: pass a mock ExtensionManager that returns a stub extension STT descriptor, call `refresh()`, assert it appears in `listProviders('stt')` with `source: 'extension'` and `priority: 200`
12. Preferred priority override: configure `stt.preferred: ['assemblyai', 'openai-whisper']`, call `refresh()`, verify AssemblyAI has `priority: 50` and Whisper has `priority: 51`

- [ ] **Step 2: Run test, commit**

```bash
git commit -m "test(speech): add resolver integration test with full discovery and fallback"
```

---

## Task 17: Documentation

**Files:**

- Create: `packages/agentos/docs/SPEECH_PROVIDERS.md`
- Modify: `apps/agentos-live-docs/scripts/pull-docs.mjs` (register new doc)

- [ ] **Step 1: Write provider ecosystem docs**

Cover:

- Overview of the provider resolver
- Configuration guide (agent.config.json speech section)
- All 11 providers: what they do, env vars, setup instructions
- Fallback behavior
- Extension pack installation
- Provider comparison table

- [ ] **Step 2: Register in pull-docs.mjs**

Add `SPEECH_PROVIDERS.md` entry mapping to `features/speech-providers.md`.

- [ ] **Step 3: Commit**

```bash
git commit -m "docs: add speech provider ecosystem guide"
```
