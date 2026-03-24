# Real-time Streaming Voice Pipeline — Design Spec

**Sub-project B** of the Voice Pipeline initiative (B → C → A).

**Goal:** Build a streaming conversational voice pipeline for AgentOS that enables real-time, low-latency voice interactions with barge-in, semantic endpointing, and speaker diarization — architected as core interfaces + extension packs matching the guardrail pack pattern.

**Architecture:** Core pipeline interfaces and orchestrator live in `packages/agentos/src/voice-pipeline/`. Concrete provider implementations (Deepgram streaming STT, ElevenLabs streaming TTS, etc.) ship as extension packs in `packages/agentos-extensions/registry/curated/voice/`. Wunderland CLI consumes the pipeline via `--voice` flags and `agent.config.json` voice section.

**Tech Stack:** TypeScript, EventEmitter, WebSocket (`ws`), ONNX Runtime (optional, for local diarization), vitest.

---

## 1. Scope

### In Scope (Sub-project B)

- 6 core interfaces: `IStreamTransport`, `IStreamingSTT`, `IEndpointDetector`, `IDiarizationEngine`, `IStreamingTTS`, `IBargeinHandler`
- `VoicePipelineOrchestrator` — state machine wiring all interfaces into a conversational loop
- 3 built-in implementations: `WebSocketStreamTransport`, `HeuristicEndpointDetector`, `AcousticEndpointDetector`
- 6 extension packs: Deepgram STT, Whisper chunked STT, OpenAI TTS, ElevenLabs TTS, Diarization, Semantic Endpoint
- Wunderland CLI integration: `--voice` flags, `agent.config.json` voice config, local WS server
- WebSocket client protocol for browser/app connectivity
- Unit + integration tests for all components

### Out of Scope (Later Sub-projects)

- **Sub-project C:** Provider ecosystem buildout (Deepgram batch, AssemblyAI, Google, Azure, Vosk, NeMo, Piper, Coqui, Bark, StyleTTS2, Porcupine, OpenWakeWord)
- **Sub-project A:** Telephony (Twilio, Telnyx, Plivo providers; IVR/DTMF; SIP/WebRTC channel adapters)
- WebRTC transport (designed for via `IStreamTransport` abstraction, implemented later)
- Browser-side pipeline changes (existing Vue voice pipeline is unmodified)
- Backend REST API changes (existing `/api/tts` and `/api/stt` routes are unmodified)

---

## 2. Core Interfaces

All interfaces live in `packages/agentos/src/voice-pipeline/types.ts` and follow the AgentOS EventEmitter pattern used by `AdaptiveVAD`, `SpeechSession`, and `CallManager`.

### Extension Kind Constants

New extension kind constants registered in `packages/agentos/src/extensions/types.ts`:

```typescript
export const EXTENSION_KIND_STREAMING_STT = 'streaming-stt-provider';
export const EXTENSION_KIND_STREAMING_TTS = 'streaming-tts-provider';
export const EXTENSION_KIND_DIARIZATION = 'diarization-provider';
export const EXTENSION_KIND_ENDPOINT_DETECTOR = 'endpoint-detector';
export const EXTENSION_KIND_BARGEIN_HANDLER = 'bargein-handler';
```

Each extension pack registers typed descriptors (e.g., `StreamingSTTDescriptor extends ExtensionDescriptor`) with these kinds, enabling the `ExtensionManager` to resolve them by kind during pipeline assembly.

### 2.1 AudioFrame

The universal audio unit passed between all pipeline components.

```typescript
interface AudioFrame {
  /** Raw PCM Float32 samples, mono */
  samples: Float32Array;
  sampleRate: number;
  timestamp: number;
  /** Optional speaker hint from client-side pre-processing */
  speakerHint?: string;
}
```

### 2.2 IStreamTransport

Bidirectional audio pipe. Abstracts WebSocket now, WebRTC later.

```typescript
interface IStreamTransport extends EventEmitter {
  readonly id: string;
  readonly state: 'connecting' | 'open' | 'closing' | 'closed';

  /** Send raw audio to the remote end (TTS playback) — accepts encoded chunks from TTS */
  sendAudio(chunk: EncodedAudioChunk | AudioFrame): void;

  /** Send a control message (e.g. barge-in stop, metadata) */
  sendControl(msg: TransportControlMessage): void;

  /** Graceful shutdown */
  close(reason?: string): Promise<void>;

  // Events: 'audio_frame', 'control', 'connected', 'disconnected', 'error'
}

type TransportControlMessage =
  | { type: 'mute' }
  | { type: 'unmute' }
  | { type: 'config'; voice?: string; language?: string }
  | { type: 'stop' };
```

### 2.3 IStreamingSTT

Streaming transcription with interim results. Provider implementations vary (Deepgram native WS, Whisper chunked polling) but the consumer sees the same event stream.

```typescript
interface IStreamingSTT {
  readonly providerId: string;
  readonly isStreaming: boolean;

  /** Start a transcription session */
  startSession(config: StreamingSTTConfig): Promise<StreamingSTTSession>;
}

interface StreamingSTTSession extends EventEmitter {
  /** Feed raw audio frames */
  pushAudio(frame: AudioFrame): void;

  /** Signal end of audio input */
  flush(): Promise<void>;

  /** Tear down */
  close(): Promise<void>;

  // Events:
  // 'interim_transcript'  -> { text, confidence, words[], isFinal: false }
  // 'final_transcript'    -> { text, confidence, words[], isFinal: true, durationMs }
  // 'speech_start'        -> { timestamp }
  // 'speech_end'          -> { timestamp, durationMs }
  // 'error'               -> Error
}

interface StreamingSTTConfig {
  language?: string; // BCP-47, e.g. 'en-US'
  interimResults?: boolean; // default true
  punctuate?: boolean; // default true
  profanityFilter?: boolean; // default false
  /** Provider-specific extras (deepgram keywords, whisper prompt, etc.) */
  providerOptions?: Record<string, unknown>;
}

interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: string;
}

interface TranscriptEvent {
  text: string;
  confidence: number;
  words: TranscriptWord[];
  isFinal: boolean;
  durationMs?: number;
}
```

### 2.4 IEndpointDetector

Watches the transcript stream and decides when the user's turn is complete. Three tiers plug into the same interface: acoustic (existing VAD), heuristic (punctuation/syntax), semantic (LLM classifier).

```typescript
interface IEndpointDetector extends EventEmitter {
  readonly mode: 'acoustic' | 'heuristic' | 'semantic';

  /** Feed a VAD event (speech/silence state change) */
  pushVadEvent(event: VadEvent): void;

  /** Feed a transcript update (interim or final) */
  pushTranscript(transcript: TranscriptEvent): void;

  /** Reset state (new conversation turn) */
  reset(): void;

  // Events:
  // 'turn_complete'        -> { transcript, confidence, durationMs, reason }
  // 'backchannel_detected' -> { text }
}

interface VadEvent {
  type: 'speech_start' | 'speech_end' | 'silence';
  timestamp: number;
  energyLevel?: number;
  /** Source of this event — 'vad' from AdaptiveVAD on raw audio, 'stt' from provider hints (e.g. Deepgram speech_final) */
  source?: 'vad' | 'stt';
}

type EndpointReason =
  | 'silence_timeout'
  | 'punctuation'
  | 'syntax_complete'
  | 'semantic_model'
  | 'manual'
  | 'timeout';

interface TurnCompleteEvent {
  transcript: string;
  confidence: number;
  durationMs: number;
  reason: EndpointReason;
}
```

### 2.5 IDiarizationEngine

Single entry point for speaker identification. Internally dispatches to provider-native diarization when available, falls back to local voiceprint clustering. The consumer never knows which backend ran.

```typescript
interface IDiarizationEngine {
  /** Start a diarization session for a conversation */
  startSession(config?: DiarizationConfig): Promise<DiarizationSession>;
}

interface DiarizationSession extends EventEmitter {
  /** Feed audio chunks for speaker embedding extraction */
  pushAudio(frame: AudioFrame): void;

  /** Associate a transcript segment with a speaker */
  labelTranscript(segment: TranscriptSegment): Promise<DiarizedSegment>;

  /** Register a known speaker voiceprint for recognition */
  enrollSpeaker(id: string, voiceprint: Float32Array): void;

  close(): Promise<void>;

  // Events:
  // 'speaker_identified' -> { speakerId, confidence, timestamp }
  // 'speaker_changed'    -> { from, to, timestamp }
}

interface DiarizationConfig {
  /** Expected number of speakers (hint for clustering) */
  expectedSpeakers?: number;
  /** Use provider-native diarization if available */
  preferProviderNative?: boolean; // default true
  /** Sliding window chunk size in ms */
  chunkSizeMs?: number; // default 1500
  /** Overlap between chunks in ms */
  overlapMs?: number; // default 500
}

interface TranscriptSegment {
  text: string;
  startMs: number;
  endMs: number;
}

interface DiarizedSegment extends TranscriptSegment {
  speakerId: string;
  speakerConfidence: number;
}
```

### 2.6 IStreamingTTS

Consumes a token stream from the LLM and emits audio chunks. Handles adaptive sentence-boundary buffering internally.

```typescript
interface IStreamingTTS {
  readonly providerId: string;

  startSession(config: StreamingTTSConfig): Promise<StreamingTTSSession>;
}

interface StreamingTTSSession extends EventEmitter {
  /** Feed LLM output tokens */
  pushTokens(text: string): void;

  /** Signal that the LLM is done generating */
  flush(): Promise<void>;

  /** Immediately stop playback (barge-in) */
  cancel(): void;

  close(): Promise<void>;

  // Events:
  // 'audio_chunk'        -> EncodedAudioChunk { audio: Buffer, format, sampleRate, durationMs, text }
  // 'utterance_start'    -> { text }
  // 'utterance_complete' -> { text, durationMs }
  // 'cancelled'          -> { remainingText }
}

/**
 * Encoded audio output from TTS. Distinct from AudioFrame (raw PCM Float32).
 * TTS produces encoded audio (mp3/opus/pcm-s16le) which the transport sends
 * directly to the client. The client decodes and plays it.
 */
interface EncodedAudioChunk {
  audio: Buffer;
  format: 'pcm' | 'mp3' | 'opus';
  sampleRate: number;
  durationMs: number;
  /** The text that was synthesized */
  text: string;
}

interface StreamingTTSConfig {
  voice?: string;
  format?: 'pcm' | 'mp3' | 'opus';
  sampleRate?: number;
  /** Chunking strategy */
  chunkingMode?: 'sentence' | 'adaptive'; // default 'adaptive'
  /** Max buffer time before forced flush (ms) */
  maxBufferMs?: number; // default 2000
  /** Provider-specific (ElevenLabs stability, etc.) */
  providerOptions?: Record<string, unknown>;
}
```

### 2.7 IBargeinHandler

Decides what to do when the user speaks while the agent is still speaking.

```typescript
interface IBargeinHandler {
  readonly mode: 'hard-cut' | 'soft-fade';

  /** Called when speech is detected while TTS is playing */
  handleBargein(context: BargeinContext): BargeinAction;
}

interface BargeinContext {
  /** How long the user has been speaking during barge-in */
  speechDurationMs: number;
  /** The interrupted TTS text */
  interruptedText: string;
  /** How much of the response was already played */
  playedDurationMs: number;
}

type BargeinAction =
  | { type: 'cancel'; injectMarker: string } // hard cut
  | { type: 'pause'; fadeMs: number } // soft fade - pause
  | { type: 'resume' } // soft fade - resume after backchannel
  | { type: 'ignore' }; // too short to count
```

---

## 3. VoicePipelineOrchestrator

### 3.1 State Machine

```
                    +----------+
                    |   IDLE   |
                    +----+-----+
                         | startSession()
                    +----v-----+
              +-----|LISTENING |<--------------------------+
              |     +----+-----+                           |
              |          | endpoint: turn_complete          |
              |     +----v------+                          |
              |     |PROCESSING | -> sendText() to LLM     |
              |     +----+------+                          |
              |          | LLM starts streaming tokens     |
              |     +----v-----+                           |
              |     |SPEAKING  | -> TTS audio out           |
              |     +----+-+---+                           |
              |          | |  barge-in detected             |
              |          | +-->INTERRUPTING-----------------+
              |          | TTS complete                     |
              |          +---------------------------------+
              |
              | transport disconnected
         +----v-----+
         |  CLOSED  |
         +----------+
```

### 3.2 Class Interface

```typescript
/**
 * Minimal interface for the AgentOS session that the pipeline interacts with.
 * Maps to the existing AgentRuntime.chat() / session.sendText() pattern.
 * The return is an AsyncIterable of token strings for streaming TTS consumption.
 */
interface IVoicePipelineAgentSession {
  /** Send a user turn and receive a streaming token response */
  sendText(message: string, metadata?: VoiceTurnMetadata): AsyncIterable<string>;
  /** Abort the current LLM generation (for barge-in) */
  abort?(): void;
}

class VoicePipelineOrchestrator extends EventEmitter {
  readonly state: PipelineState;

  constructor(config: VoicePipelineConfig);

  /**
   * Start a voice session. Wires all components, begins listening.
   * The agentSession wraps the existing AgentOS runtime for LLM interaction.
   */
  startSession(
    transport: IStreamTransport,
    agentSession: IVoicePipelineAgentSession
  ): Promise<VoicePipelineSession>;

  /** Shut down all components gracefully */
  stopSession(reason?: string): Promise<void>;
}

type PipelineState = 'idle' | 'listening' | 'processing' | 'speaking' | 'interrupting' | 'closed';

/**
 * Represents an active voice pipeline session.
 * Returned by startSession(), used to monitor and control the session.
 */
interface VoicePipelineSession extends EventEmitter {
  readonly sessionId: string;
  readonly state: PipelineState;
  /** Active transport connection */
  readonly transport: IStreamTransport;
  /** Close this session gracefully */
  close(reason?: string): Promise<void>;
  // Events: 'state_changed', 'turn_complete', 'error', 'session_ended'
}
```

### 3.3 Conversational Loop

**LISTENING phase:**

1. `transport.on('audio_frame')` fires for each incoming audio frame
2. Frame is forwarded in parallel to: `streamingSTT.pushAudio()`, `diarization.pushAudio()`, and the local `AdaptiveVAD` (which runs directly on raw audio for energy-based detection)
3. `streamingSTT.on('interim_transcript')` feeds `endpointDetector.pushTranscript()` and emits to the client for live display
4. VAD events come from two sources: (a) local `AdaptiveVAD.on('speech_start'/'speech_end')` with `source: 'vad'` and energy levels, (b) `streamingSTT.on('speech_start'/'speech_end')` with `source: 'stt'` (provider hints like Deepgram `speech_final`). Both feed `endpointDetector.pushVadEvent()`.
5. `endpointDetector.on('turn_complete')` triggers transition to PROCESSING

**PROCESSING phase:**

1. Collect final transcript + diarization labels
2. Build turn message with `VoiceTurnMetadata` (speakers, endpointReason, confidence, wasInterrupted)
3. Call `agentSession.sendText(turnMessage)` which returns a token stream
4. Transition to SPEAKING

**SPEAKING phase:**

1. LLM token stream pipes into `streamingTTS.pushTokens()`
2. `streamingTTS.on('audio_chunk')` sends audio back via `transport.sendAudioFrame()`
3. STT remains active in barge-in detection mode
4. If `streamingSTT.on('speech_start')` fires during SPEAKING:
   - Call `bargeinHandler.handleBargein(context)`
   - `cancel` → `streamingTTS.cancel()`, inject `[interrupted]` marker into conversation history, transition to LISTENING
   - `pause` → fade TTS, wait for classification
   - `resume` → resume playback
   - `ignore` → continue playing
5. `streamingTTS.on('utterance_complete')` on last chunk → transition to LISTENING

### 3.4 Conversation Memory Integration

Voice metadata injected into AgentOS conversation history:

```typescript
interface VoiceTurnMetadata {
  /** Who spoke (from diarization) */
  speakers: { id: string; label?: string; segments: number }[];
  /** How the turn ended */
  endpointReason: EndpointReason;
  /** Duration of user speech */
  speechDurationMs: number;
  /** Was the previous agent response interrupted? */
  wasInterrupted: boolean;
  /** If interrupted, what was left unsaid */
  interruptedRemainder?: string;
  /** Confidence of the transcript */
  transcriptConfidence: number;
}
```

On hard-cut barge-in, the orchestrator appends a system message:

```
[Agent response was interrupted after "{playedText}".
 Remaining unsaid: "{remainingText}".
 User interrupted with: "{userSpeech}"]
```

### 3.5 Error Recovery

| Failure                 | Recovery                                                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| STT session drops       | Auto-reconnect with exponential backoff (100ms -> 5s). Emit `stt_reconnecting`. Buffer audio frames during reconnect (up to 5s). |
| TTS session drops       | Cancel current utterance, re-create session, re-send current buffered text.                                                      |
| Transport disconnects   | Tear down all sessions, emit `session_ended`. No auto-reconnect (client must re-initiate).                                       |
| Endpoint detector stuck | Watchdog timer (30s max turn). Force `turn_complete` with `reason: 'timeout'`.                                                   |
| Diarization lag         | Non-blocking. Transcript sent to LLM immediately; speaker labels backfilled asynchronously.                                      |

---

## 4. Built-in Implementations

These ship in `packages/agentos/src/voice-pipeline/` — no extension pack needed.

### 4.1 WebSocketStreamTransport

Wraps a `ws.WebSocket` connection into an `IStreamTransport`. Binary messages carry audio frames. Text messages carry JSON control/metadata.

### 4.2 HeuristicEndpointDetector

Default endpointing strategy. Watches the streaming transcript for:

- Terminal punctuation (`. ? !`) → immediate `turn_complete` with `reason: 'punctuation'`
- Clause-ending patterns (complete subject-verb structure followed by silence) → `turn_complete` with `reason: 'syntax_complete'`
- Backchannel phrases ("uh huh", "yeah", "okay", "mm hmm") → `backchannel_detected` instead of `turn_complete`
- Falls back to silence timeout (configurable, default 1.5s) if no syntactic signal

Zero model calls, zero latency overhead.

### 4.3 AcousticEndpointDetector

Wraps the existing `AdaptiveVAD` + `SilenceDetector` + `EnvironmentalCalibrator` chain. Pure energy-based endpointing with adaptive thresholds. Used as the fallback when heuristic or semantic is not configured.

### 4.4 HardCutBargeinHandler

Default `IBargeinHandler`. When `speechDurationMs > 300ms` (not a breath or lip smack), returns `{ type: 'cancel', injectMarker: '[interrupted]' }`. Under 300ms returns `{ type: 'ignore' }`.

### 4.5 SoftFadeBargeinHandler

Optional `IBargeinHandler`. On initial barge-in, returns `{ type: 'pause', fadeMs: 200 }`. If user speech continues past 2s, returns `{ type: 'cancel', injectMarker: '[interrupted]' }`. If user speech stops within 2s (backchannel), returns `{ type: 'resume' }`.

---

## 5. Extension Packs

All packs live at `packages/agentos-extensions/registry/curated/voice/` following the established pattern: `createExtensionPack(context: ExtensionPackContext)` factory, `manifest.json`, `SKILL.md`, vitest tests.

### 5.1 streaming-stt-deepgram (`@framers/agentos-ext-streaming-stt-deepgram`)

SOTA real-time STT via Deepgram's native WebSocket API.

**Files:** `src/index.ts`, `src/DeepgramStreamingSTT.ts`, `src/DeepgramStreamSession.ts`, `src/DeepgramDiarizationAdapter.ts`, `src/types.ts`

**Behavior:**

- Opens persistent WebSocket to `wss://api.deepgram.com/v1/listen`
- Sends raw PCM frames directly (no local buffering)
- Parses Deepgram `Results` messages into `interim_transcript` / `final_transcript` events
- Maps Deepgram `is_final` + `speech_final` to `speech_end`
- `DeepgramDiarizationAdapter` extracts `speaker` field from word-level results when `diarize: true`
- Auto-reconnect on WS drop with frame buffering (up to 5s)
- Env: `DEEPGRAM_API_KEY`
- Dependencies: `ws`

### 5.2 streaming-stt-whisper (`@framers/agentos-ext-streaming-stt-whisper`)

Chunked-streaming STT using OpenAI Whisper or any OpenAI-compatible endpoint (local whisper.cpp).

**Files:** `src/index.ts`, `src/WhisperChunkedSTT.ts`, `src/WhisperChunkSession.ts`, `src/SlidingWindowBuffer.ts`, `src/types.ts`

**Behavior:**

- `SlidingWindowBuffer` accumulates audio frames into 1s chunks with 200ms overlap
- Each chunk encoded to WAV via existing `encodeFloat32ToWav()` utility
- Sent to Whisper API (or local `baseUrl`) as standard transcription request
- Previous chunk's transcript passed as `prompt` for continuity
- Emits `interim_transcript` on each chunk response, `final_transcript` on flush
- `speech_start` / `speech_end` derived from `AdaptiveVAD` running in parallel
- Latency: ~1-2s per partial
- Env: `OPENAI_API_KEY` or `WHISPER_BASE_URL` for local
- Dependencies: none (uses fetch)

### 5.3 streaming-tts-openai (`@framers/agentos-ext-streaming-tts-openai`)

Streaming TTS via OpenAI's TTS API with adaptive sentence-boundary chunking.

**Files:** `src/index.ts`, `src/OpenAIStreamingTTS.ts`, `src/OpenAITTSSession.ts`, `src/AdaptiveSentenceChunker.ts`, `src/types.ts`

**Behavior:**

- `AdaptiveSentenceChunker` buffers `pushTokens()` calls until sentence boundary (`. ? ! ;` or clause break after `,`)
- If no boundary found within `maxBufferMs` (default 2000ms), forces flush at nearest word boundary
- Each sentence chunk sent to `POST /v1/audio/speech` with `response_format: 'opus'`
- `Promise` pipelining: while chunk N plays, chunk N+1 is already being synthesized
- On `cancel()`: aborts in-flight fetch, clears buffer, emits `cancelled` with remaining text
- Voices: alloy, echo, fable, onyx, nova, shimmer
- Env: `OPENAI_API_KEY`
- Dependencies: none (uses fetch)

### 5.4 streaming-tts-elevenlabs (`@framers/agentos-ext-streaming-tts-elevenlabs`)

Streaming TTS via ElevenLabs WebSocket API with continuation hints for mid-sentence flushes.

**Files:** `src/index.ts`, `src/ElevenLabsStreamingTTS.ts`, `src/ElevenLabsTTSSession.ts`, `src/types.ts`

**Behavior:**

- Uses ElevenLabs' input-streaming WebSocket (`/v1/text-to-speech/{voice}/stream-input`)
- Sends text chunks, receives audio chunks in real-time
- No local sentence buffering needed — ElevenLabs handles prosody across streamed text
- Sends `flush: true` on sentence boundaries for natural pauses
- Sends `" "` (space) continuation signal for mid-sentence forced flushes to prevent falling intonation
- Lowest latency of any TTS option (~200ms to first audio)
- On `cancel()`: sends close frame, drains final audio chunk
- Env: `ELEVENLABS_API_KEY`
- Dependencies: `ws`

### 5.5 diarization (`@framers/agentos-ext-diarization`)

Speaker identification engine — delegates to provider-native diarization or runs local x-vector clustering.

**Files:** `src/index.ts`, `src/DiarizationEngine.ts`, `src/DiarizationSession.ts`, `src/ProviderDiarizationBackend.ts`, `src/LocalDiarizationBackend.ts`, `src/SlidingWindowExtractor.ts`, `src/SpeakerEmbeddingCache.ts`, `src/ClusteringStrategy.ts`, `src/types.ts`

**Behavior:**

- `DiarizationEngine.startSession()` checks if active STT provider exposes native diarization (via `supportsDiarization()` capability check). If yes, wraps in `ProviderDiarizationBackend`. If no, spins up `LocalDiarizationBackend`.
- `LocalDiarizationBackend` uses `SlidingWindowExtractor` (1.5s chunks, 0.5s overlap) to extract speaker embeddings via a lightweight ONNX x-vector model (speechbrain `spkrec-ecapa-voxceleb`, ~25MB). Model loaded lazily via `ISharedServiceRegistry.getOrCreate()`.
- `SpeakerEmbeddingCache` maintains running centroid per speaker. New chunks compared via cosine similarity — above 0.7 threshold assigns to existing speaker, below creates new speaker.
- `ClusteringStrategy` runs agglomerative clustering on all centroids periodically (every 10 chunks) to merge speakers that drifted apart.
- Speaker labels stable within session: `Speaker_0`, `Speaker_1`, etc. `enrollSpeaker()` attaches a name to a label.
- Non-blocking: runs in parallel with STT. Labels backfilled.
- Dependencies: `onnxruntime-node` (optional peer dependency)

### 5.6 endpoint-semantic (`@framers/agentos-ext-endpoint-semantic`)

LLM-based semantic endpointing — classifies whether an utterance is a complete thought.

**Files:** `src/index.ts`, `src/SemanticEndpointDetector.ts`, `src/TurnCompletenessClassifier.ts`, `src/types.ts`

**Behavior:**

- Only fires when acoustic VAD detects silence AND heuristic detector is uncertain (no clear punctuation/syntax signal)
- Sends current transcript + last 2 turns of context to a fast small model (via `SmallModelResolver` — gpt-4o-mini, claude-haiku, etc.)
- Prompt: `"Is the following utterance a complete thought that expects a response, or is the speaker likely to continue? Respond COMPLETE or INCOMPLETE with one-sentence reasoning."`
- Response cached with LRU to avoid redundant calls
- Timeout: 500ms max. Falls back to heuristic result if model doesn't respond in time.
- Configurable: `{ model?: string, timeoutMs?: number, minSilenceBeforeCheck?: number }`
- Dependencies: none (uses existing AgentOS LLM infrastructure)

---

## 6. Wunderland CLI Integration

### 6.1 New Files

**`packages/wunderland/src/voice/streaming-pipeline.ts`**

Factory that creates a fully-wired `VoicePipelineOrchestrator` from Wunderland CLI config:

```typescript
export async function createStreamingPipeline(
  agentConfig: AgentConfig,
  extensionManager: ExtensionManager
): Promise<VoicePipelineOrchestrator>;
```

Resolves providers from `agent.config.json` voice section, loads extension packs via `ExtensionManager`, falls back to built-in defaults (whisper-chunked STT, OpenAI TTS, heuristic endpoint).

**`packages/wunderland/src/voice/ws-server.ts`**

Starts a local WebSocket server when `wunderland start --voice` or `wunderland chat --voice` is invoked:

```typescript
export async function startVoiceServer(
  pipeline: VoicePipelineOrchestrator,
  options?: { port?: number; host?: string }
): Promise<{ port: number; close: () => Promise<void> }>;
```

Each WS connection gets its own `VoicePipelineSession`.

### 6.2 CLI Flags

Added to `start` and `chat` commands:

```
--voice                    Enable voice mode (streaming pipeline)
--voice-stt <provider>     STT provider (deepgram, whisper-chunked)
--voice-tts <provider>     TTS provider (openai, elevenlabs)
--voice-endpointing <mode> Endpointing (acoustic, heuristic, semantic)
--voice-diarization        Enable speaker diarization
--voice-barge-in <mode>    Barge-in handling (hard-cut, soft-fade, disabled)
--voice-port <port>        WebSocket server port (default: auto)
```

CLI flags override `agent.config.json`. Config file overrides defaults.

### 6.3 agent.config.json

```json
{
  "voice": {
    "enabled": true,
    "pipeline": "streaming",
    "stt": "deepgram",
    "tts": "elevenlabs",
    "ttsVoice": "nova",
    "endpointing": "heuristic",
    "diarization": {
      "enabled": true,
      "expectedSpeakers": 2
    },
    "bargeIn": "hard-cut",
    "language": "en-US",
    "server": {
      "port": 8765,
      "host": "127.0.0.1"
    }
  }
}
```

### 6.4 Provider Catalog Update

`packages/agentos/src/speech/providerCatalog.ts` updated to add `streamingCapable: true` flag to relevant entries and register the new streaming provider IDs.

---

## 7. WebSocket Client Protocol

Two message types on the wire:

- **Binary WS messages** carry raw audio (client→server: PCM Float32 mono; server→client: encoded audio in negotiated format)
- **Text WS messages** carry JSON control/metadata

Audio sample rate is negotiated once via a `config` message at session start. No JSON wrapper around audio data.

### Client -> Server (text messages)

```typescript
type ClientTextMessage =
  | { type: 'config'; sampleRate: number; voice?: string; language?: string }
  | { type: 'control'; action: 'mute' | 'unmute' | 'stop' };
```

Client binary messages: raw PCM Float32 mono audio at the negotiated sample rate.

### Server -> Client (text messages)

```typescript
type ServerTextMessage =
  | { type: 'session_started'; sessionId: string; config: { sampleRate: number; format: string } }
  | { type: 'transcript'; text: string; isFinal: boolean; speaker?: string }
  | { type: 'agent_thinking' }
  | { type: 'agent_speaking'; text: string }
  | { type: 'agent_done' }
  | { type: 'barge_in'; action: 'cancelled' | 'paused' }
  | { type: 'error'; message: string; code: string }
  | { type: 'session_ended'; reason: string };
```

Server binary messages: encoded audio (mp3/opus/pcm) in the format specified in `session_started.config.format`.

---

## 8. Relationship to Existing Code

| Existing Component                                            | Relationship                                                                                                                             |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `SpeechRuntime` / `SpeechSession`                             | Still used for batch voice mode (record -> transcribe -> respond -> play). Streaming pipeline is an alternative mode, not a replacement. |
| `AdaptiveVAD` / `EnvironmentalCalibrator` / `SilenceDetector` | Reused directly. `AcousticEndpointDetector` wraps these. Whisper chunked STT uses `AdaptiveVAD` for `speech_start`/`speech_end`.         |
| `CallManager` / `IVoiceCallProvider`                          | Untouched. Sub-project A will wire `CallManager` as an `IStreamTransport` implementation so phone calls flow through the same pipeline.  |
| `voice-synthesis` extension pack                              | Remains as batch ITool for agents needing one-shot TTS/STT. Streaming TTS packs are pipeline components, not agent tools.                |
| `speech/providerCatalog.ts`                                   | Updated with `streamingCapable` flag and new streaming provider IDs.                                                                     |
| Backend `audio.service.ts`                                    | Untouched. REST TTS/STT routes serve the existing frontend. Streaming pipeline runs server-side within the Wunderland process.           |
| Frontend Vue voice pipeline                                   | Unmodified. Existing browser STT/TTS continues to work. Future sub-project may add a WS client mode to the frontend.                     |

---

## 9. File Map

### Core (packages/agentos/src/voice-pipeline/)

| File                           | Purpose                                                                                                                                                     |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types.ts`                     | All interfaces: `IStreamTransport`, `IStreamingSTT`, `IEndpointDetector`, `IDiarizationEngine`, `IStreamingTTS`, `IBargeinHandler`, plus config/event types |
| `VoicePipelineOrchestrator.ts` | State machine wiring all interfaces into conversational loop                                                                                                |
| `WebSocketStreamTransport.ts`  | `IStreamTransport` over `ws.WebSocket`                                                                                                                      |
| `HeuristicEndpointDetector.ts` | Punctuation/syntax-based turn detection                                                                                                                     |
| `AcousticEndpointDetector.ts`  | Wraps existing AdaptiveVAD + SilenceDetector                                                                                                                |
| `HardCutBargeinHandler.ts`     | Default barge-in: cancel after 300ms of speech                                                                                                              |
| `SoftFadeBargeinHandler.ts`    | Optional barge-in: fade + backchannel detection                                                                                                             |
| `index.ts`                     | Barrel exports                                                                                                                                              |

### Extension Packs (packages/agentos-extensions/registry/curated/voice/)

| Directory                   | npm Package                                     | Files          |
| --------------------------- | ----------------------------------------------- | -------------- |
| `streaming-stt-deepgram/`   | `@framers/agentos-ext-streaming-stt-deepgram`   | 5 src + 2 test |
| `streaming-stt-whisper/`    | `@framers/agentos-ext-streaming-stt-whisper`    | 5 src + 3 test |
| `streaming-tts-openai/`     | `@framers/agentos-ext-streaming-tts-openai`     | 5 src + 3 test |
| `streaming-tts-elevenlabs/` | `@framers/agentos-ext-streaming-tts-elevenlabs` | 4 src + 2 test |
| `diarization/`              | `@framers/agentos-ext-diarization`              | 9 src + 5 test |
| `endpoint-semantic/`        | `@framers/agentos-ext-endpoint-semantic`        | 4 src + 3 test |

### Wunderland (packages/wunderland/src/voice/)

| File                    | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| `streaming-pipeline.ts` | Factory: config -> VoicePipelineOrchestrator |
| `ws-server.ts`          | Local WS server for voice sessions           |
| `index.ts`              | Updated barrel                               |

---

## 10. Testing Strategy

**Unit tests** (per-file, vitest):

- Each interface implementation tested in isolation with mocked dependencies
- `SlidingWindowBuffer`, `AdaptiveSentenceChunker`, `SpeakerEmbeddingCache`, `ClusteringStrategy` — pure functions, deterministic
- Mock WebSocket servers for Deepgram/ElevenLabs protocol conformance

**Integration tests** (orchestrator-level):

- `VoicePipelineOrchestrator` tested with `MockStreamTransport`, `MockStreamingSTT`, `MockStreamingTTS`
- State machine transitions: LISTENING -> PROCESSING -> SPEAKING -> LISTENING
- Barge-in: SPEAKING -> speech detected -> cancel TTS -> LISTENING
- Error recovery: STT drop -> reconnect -> resume

**End-to-end tests** (gated behind `VOICE_E2E=true`):

- Records test audio -> streams to pipeline -> verifies transcript + TTS output
- Deepgram + OpenAI TTS as tested path

---

## 11. Configuration Reference

```typescript
interface VoicePipelineConfig {
  stt: string; // 'deepgram' | 'whisper-chunked'
  tts: string; // 'openai' | 'elevenlabs'
  endpointing: 'acoustic' | 'heuristic' | 'semantic'; // default 'heuristic'
  diarization: boolean | DiarizationConfig; // default false
  bargeIn: 'hard-cut' | 'soft-fade' | 'disabled'; // default 'hard-cut'
  voice?: string; // TTS voice ID
  format?: 'pcm' | 'mp3' | 'opus'; // default 'opus'
  language?: string; // default 'en-US'
  maxTurnDurationMs?: number; // default 30000
  sttOptions?: Record<string, unknown>; // provider-specific
  ttsOptions?: Record<string, unknown>; // provider-specific
}
```
