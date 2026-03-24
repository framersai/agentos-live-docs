# Real-time Streaming Voice Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a streaming conversational voice pipeline for AgentOS with barge-in, semantic endpointing, and speaker diarization — core interfaces + 6 extension packs + Wunderland CLI integration.

**Architecture:** Core pipeline interfaces and orchestrator in `packages/agentos/src/voice-pipeline/`. Extension packs in `packages/agentos-extensions/registry/curated/voice/`. Wunderland CLI consumes via `--voice` flags and `agent.config.json`. Follows the same pattern as guardrail packs.

**Tech Stack:** TypeScript, EventEmitter, WebSocket (`ws`), ONNX Runtime (optional), vitest

**Spec:** `docs/superpowers/specs/2026-03-23-voice-pipeline-streaming-design.md`

---

## File Structure

### Core (packages/agentos/src/voice-pipeline/)

| File                           | Responsibility                                                                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `types.ts`                     | All interfaces: IStreamTransport, IStreamingSTT, IEndpointDetector, IDiarizationEngine, IStreamingTTS, IBargeinHandler, plus config/event types |
| `VoicePipelineOrchestrator.ts` | State machine wiring all interfaces into conversational loop                                                                                    |
| `WebSocketStreamTransport.ts`  | IStreamTransport over ws.WebSocket                                                                                                              |
| `HeuristicEndpointDetector.ts` | Punctuation/syntax-based turn detection                                                                                                         |
| `AcousticEndpointDetector.ts`  | Wraps existing AdaptiveVAD + SilenceDetector                                                                                                    |
| `HardCutBargeinHandler.ts`     | Default barge-in: cancel after 300ms of speech                                                                                                  |
| `SoftFadeBargeinHandler.ts`    | Optional barge-in: fade + backchannel detection                                                                                                 |
| `index.ts`                     | Barrel exports                                                                                                                                  |

### Extension Kind Constants (packages/agentos/src/extensions/types.ts)

Add 5 new constants to existing file.

### Extension Packs (packages/agentos-extensions/registry/curated/voice/)

Each pack follows the guardrail pack pattern: `package.json`, `tsconfig.json`, `vitest.config.ts`, `manifest.json`, `SKILL.md`, `src/index.ts` with `createExtensionPack()` factory.

| Pack                        | Files                                                                                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `streaming-stt-deepgram/`   | index.ts, DeepgramStreamingSTT.ts, DeepgramStreamSession.ts, DeepgramDiarizationAdapter.ts, types.ts                                                                                                   |
| `streaming-stt-whisper/`    | index.ts, WhisperChunkedSTT.ts, WhisperChunkSession.ts, SlidingWindowBuffer.ts, types.ts                                                                                                               |
| `streaming-tts-openai/`     | index.ts, OpenAIStreamingTTS.ts, OpenAITTSSession.ts, AdaptiveSentenceChunker.ts, types.ts                                                                                                             |
| `streaming-tts-elevenlabs/` | index.ts, ElevenLabsStreamingTTS.ts, ElevenLabsTTSSession.ts, types.ts                                                                                                                                 |
| `diarization/`              | index.ts, DiarizationEngine.ts, DiarizationSession.ts, ProviderDiarizationBackend.ts, LocalDiarizationBackend.ts, SlidingWindowExtractor.ts, SpeakerEmbeddingCache.ts, ClusteringStrategy.ts, types.ts |
| `endpoint-semantic/`        | index.ts, SemanticEndpointDetector.ts, TurnCompletenessClassifier.ts, types.ts                                                                                                                         |

### Wunderland Integration (packages/wunderland/src/voice/)

| File                    | Responsibility                              |
| ----------------------- | ------------------------------------------- |
| `streaming-pipeline.ts` | Factory: config → VoicePipelineOrchestrator |
| `ws-server.ts`          | Local WS server for voice sessions          |
| `index.ts`              | Updated barrel                              |

---

## Task 1: Core Types and Interfaces

**Files:**

- Create: `packages/agentos/src/voice-pipeline/types.ts`
- Modify: `packages/agentos/src/extensions/types.ts` (add 5 extension kind constants)
- Test: `packages/agentos/src/voice-pipeline/__tests__/types.spec.ts`

This task defines every interface, type, and event shape the entire pipeline depends on. No implementations yet.

- [ ] **Step 1: Write the types test**

```typescript
// packages/agentos/src/voice-pipeline/__tests__/types.spec.ts
import { describe, it, expect } from 'vitest';
import type {
  AudioFrame,
  EncodedAudioChunk,
  IStreamTransport,
  IStreamingSTT,
  StreamingSTTSession,
  StreamingSTTConfig,
  TranscriptWord,
  TranscriptEvent,
  IEndpointDetector,
  VadEvent,
  EndpointReason,
  TurnCompleteEvent,
  IDiarizationEngine,
  DiarizationSession,
  DiarizationConfig,
  TranscriptSegment,
  DiarizedSegment,
  IStreamingTTS,
  StreamingTTSSession,
  StreamingTTSConfig,
  IBargeinHandler,
  BargeinContext,
  BargeinAction,
  TransportControlMessage,
  IVoicePipelineAgentSession,
  VoicePipelineConfig,
  VoiceTurnMetadata,
  PipelineState,
  VoicePipelineSession,
  ClientTextMessage,
  ServerTextMessage,
} from '../types.js';

describe('voice-pipeline types', () => {
  it('AudioFrame has required fields', () => {
    const frame: AudioFrame = {
      samples: new Float32Array(160),
      sampleRate: 16000,
      timestamp: Date.now(),
    };
    expect(frame.samples).toBeInstanceOf(Float32Array);
    expect(frame.sampleRate).toBe(16000);
  });

  it('EncodedAudioChunk is distinct from AudioFrame', () => {
    const chunk: EncodedAudioChunk = {
      audio: Buffer.from([0, 1, 2]),
      format: 'opus',
      sampleRate: 24000,
      durationMs: 500,
      text: 'hello',
    };
    expect(chunk.audio).toBeInstanceOf(Buffer);
    expect(chunk.format).toBe('opus');
  });

  it('VadEvent supports source field', () => {
    const event: VadEvent = {
      type: 'speech_start',
      timestamp: Date.now(),
      source: 'vad',
      energyLevel: 0.5,
    };
    expect(event.source).toBe('vad');
  });

  it('BargeinAction discriminated union works', () => {
    const cancel: BargeinAction = { type: 'cancel', injectMarker: '[interrupted]' };
    const pause: BargeinAction = { type: 'pause', fadeMs: 200 };
    const resume: BargeinAction = { type: 'resume' };
    const ignore: BargeinAction = { type: 'ignore' };
    expect(cancel.type).toBe('cancel');
    expect(pause.type).toBe('pause');
    expect(resume.type).toBe('resume');
    expect(ignore.type).toBe('ignore');
  });

  it('PipelineState includes all states', () => {
    const states: PipelineState[] = [
      'idle',
      'listening',
      'processing',
      'speaking',
      'interrupting',
      'closed',
    ];
    expect(states).toHaveLength(6);
  });

  it('VoicePipelineConfig has sensible defaults documented', () => {
    const config: VoicePipelineConfig = {
      stt: 'whisper-chunked',
      tts: 'openai',
    };
    // endpointing defaults to 'heuristic', bargeIn to 'hard-cut'
    expect(config.endpointing).toBeUndefined(); // default applied at runtime
    expect(config.stt).toBe('whisper-chunked');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/voice-pipeline/__tests__/types.spec.ts`
Expected: FAIL — cannot resolve `../types.js`

- [ ] **Step 3: Add extension kind constants to existing types.ts**

In `packages/agentos/src/extensions/types.ts`, add after the existing kind constants (search for `EXTENSION_KIND_GUARDRAIL` or `EXTENSION_KIND_TOOL`):

```typescript
/** Extension kind for streaming speech-to-text providers. */
export const EXTENSION_KIND_STREAMING_STT = 'streaming-stt-provider';
/** Extension kind for streaming text-to-speech providers. */
export const EXTENSION_KIND_STREAMING_TTS = 'streaming-tts-provider';
/** Extension kind for speaker diarization engines. */
export const EXTENSION_KIND_DIARIZATION = 'diarization-provider';
/** Extension kind for turn-taking endpoint detectors. */
export const EXTENSION_KIND_ENDPOINT_DETECTOR = 'endpoint-detector';
/** Extension kind for barge-in handlers. */
export const EXTENSION_KIND_BARGEIN_HANDLER = 'bargein-handler';
```

- [ ] **Step 4: Create the full types.ts**

Create `packages/agentos/src/voice-pipeline/types.ts` with all interfaces from the spec (Sections 2.1–2.7, 3.2, 3.4, 7). This is a pure types file — no runtime code. Copy every interface, type alias, and event type from the spec verbatim, adding thorough TSDoc comments to each one. Reference the spec section numbers in the TSDoc.

Key types to include:

- `AudioFrame`, `EncodedAudioChunk`
- `IStreamTransport`, `TransportControlMessage`
- `IStreamingSTT`, `StreamingSTTSession`, `StreamingSTTConfig`, `TranscriptWord`, `TranscriptEvent`
- `IEndpointDetector`, `VadEvent`, `EndpointReason`, `TurnCompleteEvent`
- `IDiarizationEngine`, `DiarizationSession`, `DiarizationConfig`, `TranscriptSegment`, `DiarizedSegment`
- `IStreamingTTS`, `StreamingTTSSession`, `StreamingTTSConfig`
- `IBargeinHandler`, `BargeinContext`, `BargeinAction`
- `IVoicePipelineAgentSession`, `VoiceTurnMetadata`
- `VoicePipelineConfig`, `PipelineState`, `VoicePipelineSession`
- `ClientTextMessage`, `ServerTextMessage`

- [ ] **Step 5: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/voice-pipeline/__tests__/types.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add packages/agentos/src/voice-pipeline/types.ts packages/agentos/src/voice-pipeline/__tests__/types.spec.ts packages/agentos/src/extensions/types.ts
git commit -m "feat(voice-pipeline): add core interfaces and types for streaming voice pipeline"
```

---

## Task 2: Barge-in Handlers

**Files:**

- Create: `packages/agentos/src/voice-pipeline/HardCutBargeinHandler.ts`
- Create: `packages/agentos/src/voice-pipeline/SoftFadeBargeinHandler.ts`
- Test: `packages/agentos/src/voice-pipeline/__tests__/HardCutBargeinHandler.spec.ts`
- Test: `packages/agentos/src/voice-pipeline/__tests__/SoftFadeBargeinHandler.spec.ts`

Simple, stateless components. Good TDD target.

- [ ] **Step 1: Write HardCutBargeinHandler tests**

```typescript
// packages/agentos/src/voice-pipeline/__tests__/HardCutBargeinHandler.spec.ts
import { describe, it, expect } from 'vitest';
import { HardCutBargeinHandler } from '../HardCutBargeinHandler.js';

describe('HardCutBargeinHandler', () => {
  const handler = new HardCutBargeinHandler();

  it('has mode "hard-cut"', () => {
    expect(handler.mode).toBe('hard-cut');
  });

  it('ignores speech under 300ms', () => {
    const result = handler.handleBargein({
      speechDurationMs: 150,
      interruptedText: 'Hello there',
      playedDurationMs: 1000,
    });
    expect(result).toEqual({ type: 'ignore' });
  });

  it('cancels speech over 300ms with interrupt marker', () => {
    const result = handler.handleBargein({
      speechDurationMs: 500,
      interruptedText: 'Hello there, how are you?',
      playedDurationMs: 2000,
    });
    expect(result).toEqual({ type: 'cancel', injectMarker: '[interrupted]' });
  });

  it('cancels at exactly 300ms', () => {
    const result = handler.handleBargein({
      speechDurationMs: 300,
      interruptedText: 'test',
      playedDurationMs: 100,
    });
    // At boundary — should cancel (>= 300ms)
    expect(result.type).toBe('cancel');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/voice-pipeline/__tests__/HardCutBargeinHandler.spec.ts`
Expected: FAIL — cannot resolve `../HardCutBargeinHandler.js`

- [ ] **Step 3: Implement HardCutBargeinHandler**

```typescript
// packages/agentos/src/voice-pipeline/HardCutBargeinHandler.ts
import type { IBargeinHandler, BargeinContext, BargeinAction } from './types.js';

/**
 * Default barge-in handler that immediately cancels TTS playback when the
 * user speaks for longer than a configurable threshold.
 *
 * Speech under the threshold (default 300ms) is treated as a lip smack,
 * breath, or ambient noise and ignored.
 *
 * @see Spec Section 4.4
 */
export class HardCutBargeinHandler implements IBargeinHandler {
  readonly mode = 'hard-cut' as const;

  /** Minimum speech duration (ms) to trigger a cancel. */
  private readonly minSpeechMs: number;

  constructor(options?: { minSpeechMs?: number }) {
    this.minSpeechMs = options?.minSpeechMs ?? 300;
  }

  handleBargein(context: BargeinContext): BargeinAction {
    if (context.speechDurationMs >= this.minSpeechMs) {
      return { type: 'cancel', injectMarker: '[interrupted]' };
    }
    return { type: 'ignore' };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd packages/agentos && npx vitest run src/voice-pipeline/__tests__/HardCutBargeinHandler.spec.ts`
Expected: PASS

- [ ] **Step 5: Write SoftFadeBargeinHandler tests**

```typescript
// packages/agentos/src/voice-pipeline/__tests__/SoftFadeBargeinHandler.spec.ts
import { describe, it, expect } from 'vitest';
import { SoftFadeBargeinHandler } from '../SoftFadeBargeinHandler.js';

describe('SoftFadeBargeinHandler', () => {
  it('has mode "soft-fade"', () => {
    const handler = new SoftFadeBargeinHandler();
    expect(handler.mode).toBe('soft-fade');
  });

  it('ignores speech under 100ms', () => {
    const handler = new SoftFadeBargeinHandler();
    const result = handler.handleBargein({
      speechDurationMs: 50,
      interruptedText: 'Hello',
      playedDurationMs: 1000,
    });
    expect(result).toEqual({ type: 'ignore' });
  });

  it('pauses with fade on initial barge-in (100ms-2s)', () => {
    const handler = new SoftFadeBargeinHandler();
    const result = handler.handleBargein({
      speechDurationMs: 500,
      interruptedText: 'Hello there',
      playedDurationMs: 1000,
    });
    expect(result).toEqual({ type: 'pause', fadeMs: 200 });
  });

  it('cancels when speech exceeds 2s', () => {
    const handler = new SoftFadeBargeinHandler();
    const result = handler.handleBargein({
      speechDurationMs: 2500,
      interruptedText: 'Hello there, how are you today?',
      playedDurationMs: 3000,
    });
    expect(result).toEqual({ type: 'cancel', injectMarker: '[interrupted]' });
  });
});
```

- [ ] **Step 6: Implement SoftFadeBargeinHandler**

```typescript
// packages/agentos/src/voice-pipeline/SoftFadeBargeinHandler.ts
import type { IBargeinHandler, BargeinContext, BargeinAction } from './types.js';

/**
 * Soft-fade barge-in handler that pauses TTS on initial interruption,
 * then either resumes (backchannel) or cancels (sustained speech).
 *
 * Thresholds:
 * - < ignoreMs (100ms): ignore (noise/breath)
 * - ignoreMs to cancelMs (2000ms): pause with fade
 * - > cancelMs: full cancel
 *
 * @see Spec Section 4.5
 */
export class SoftFadeBargeinHandler implements IBargeinHandler {
  readonly mode = 'soft-fade' as const;

  private readonly ignoreMs: number;
  private readonly cancelMs: number;
  private readonly fadeMs: number;

  constructor(options?: { ignoreMs?: number; cancelMs?: number; fadeMs?: number }) {
    this.ignoreMs = options?.ignoreMs ?? 100;
    this.cancelMs = options?.cancelMs ?? 2000;
    this.fadeMs = options?.fadeMs ?? 200;
  }

  handleBargein(context: BargeinContext): BargeinAction {
    if (context.speechDurationMs < this.ignoreMs) {
      return { type: 'ignore' };
    }
    if (context.speechDurationMs >= this.cancelMs) {
      return { type: 'cancel', injectMarker: '[interrupted]' };
    }
    return { type: 'pause', fadeMs: this.fadeMs };
  }
}
```

- [ ] **Step 7: Run all barge-in tests**

Run: `cd packages/agentos && npx vitest run src/voice-pipeline/__tests__/SoftFadeBargeinHandler.spec.ts`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add packages/agentos/src/voice-pipeline/HardCutBargeinHandler.ts packages/agentos/src/voice-pipeline/SoftFadeBargeinHandler.ts packages/agentos/src/voice-pipeline/__tests__/HardCutBargeinHandler.spec.ts packages/agentos/src/voice-pipeline/__tests__/SoftFadeBargeinHandler.spec.ts
git commit -m "feat(voice-pipeline): add HardCut and SoftFade barge-in handlers"
```

---

## Task 3: Heuristic Endpoint Detector

**Files:**

- Create: `packages/agentos/src/voice-pipeline/HeuristicEndpointDetector.ts`
- Test: `packages/agentos/src/voice-pipeline/__tests__/HeuristicEndpointDetector.spec.ts`

The default endpointing strategy. Watches streaming transcript for punctuation, syntax, and backchannel phrases. Falls back to silence timeout.

- [ ] **Step 1: Write tests**

```typescript
// packages/agentos/src/voice-pipeline/__tests__/HeuristicEndpointDetector.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HeuristicEndpointDetector } from '../HeuristicEndpointDetector.js';
import type { TranscriptEvent, VadEvent } from '../types.js';

describe('HeuristicEndpointDetector', () => {
  let detector: HeuristicEndpointDetector;

  beforeEach(() => {
    detector = new HeuristicEndpointDetector();
  });

  it('has mode "heuristic"', () => {
    expect(detector.mode).toBe('heuristic');
  });

  it('emits turn_complete on terminal punctuation + silence', () => {
    const handler = vi.fn();
    detector.on('turn_complete', handler);

    // Push transcript ending with period
    detector.pushTranscript({
      text: 'Hello there.',
      confidence: 0.95,
      words: [],
      isFinal: true,
    });

    // Then silence
    detector.pushVadEvent({ type: 'speech_end', timestamp: Date.now(), source: 'vad' });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].reason).toBe('punctuation');
    expect(handler.mock.calls[0][0].transcript).toBe('Hello there.');
  });

  it('emits turn_complete on question mark', () => {
    const handler = vi.fn();
    detector.on('turn_complete', handler);

    detector.pushTranscript({
      text: 'How are you?',
      confidence: 0.9,
      words: [],
      isFinal: true,
    });
    detector.pushVadEvent({ type: 'speech_end', timestamp: Date.now(), source: 'vad' });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].reason).toBe('punctuation');
  });

  it('detects backchannel phrases', () => {
    const handler = vi.fn();
    detector.on('backchannel_detected', handler);

    detector.pushTranscript({
      text: 'uh huh',
      confidence: 0.8,
      words: [],
      isFinal: true,
    });
    detector.pushVadEvent({ type: 'speech_end', timestamp: Date.now(), source: 'vad' });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].text).toBe('uh huh');
  });

  it('falls back to silence timeout when no punctuation', async () => {
    const handler = vi.fn();
    detector = new HeuristicEndpointDetector({ silenceTimeoutMs: 100 });
    detector.on('turn_complete', handler);

    detector.pushTranscript({
      text: 'well I think',
      confidence: 0.85,
      words: [],
      isFinal: true,
    });
    detector.pushVadEvent({ type: 'speech_end', timestamp: Date.now(), source: 'vad' });

    // Not immediate — no punctuation
    expect(handler).not.toHaveBeenCalled();

    // Wait for silence timeout
    await new Promise((r) => setTimeout(r, 150));
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].reason).toBe('silence_timeout');
  });

  it('reset() clears state', () => {
    detector.pushTranscript({ text: 'Hello', confidence: 0.9, words: [], isFinal: false });
    detector.reset();
    // After reset, should not have accumulated text
    const handler = vi.fn();
    detector.on('turn_complete', handler);
    detector.pushVadEvent({ type: 'speech_end', timestamp: Date.now(), source: 'vad' });
    // No transcript accumulated, so no turn_complete
    expect(handler).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/voice-pipeline/__tests__/HeuristicEndpointDetector.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement HeuristicEndpointDetector**

Create `packages/agentos/src/voice-pipeline/HeuristicEndpointDetector.ts`:

Key implementation details:

- Extends `EventEmitter` and implements `IEndpointDetector`
- `mode = 'heuristic'`
- Maintains `accumulatedText: string` from `pushTranscript()` calls
- `BACKCHANNEL_PHRASES` set: `'uh huh', 'yeah', 'okay', 'mm hmm', 'mmhmm', 'mhm', 'right', 'sure', 'yep', 'yup', 'gotcha', 'ok'`
- On `pushTranscript()` with `isFinal: true`: check if text matches backchannel (case-insensitive, trimmed)
- On `pushVadEvent({ type: 'speech_end' })`: if accumulated text ends with terminal punctuation (`. ? !`), emit `turn_complete` with `reason: 'punctuation'` immediately. Otherwise start silence timeout timer.
- Silence timeout (configurable, default 1500ms): if no new speech before timer fires, emit `turn_complete` with `reason: 'silence_timeout'`
- `reset()`: clear accumulated text, cancel any pending timer
- Add thorough TSDoc comments on every method

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd packages/agentos && npx vitest run src/voice-pipeline/__tests__/HeuristicEndpointDetector.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/voice-pipeline/HeuristicEndpointDetector.ts packages/agentos/src/voice-pipeline/__tests__/HeuristicEndpointDetector.spec.ts
git commit -m "feat(voice-pipeline): add HeuristicEndpointDetector with punctuation and silence detection"
```

---

## Task 4: Acoustic Endpoint Detector

**Files:**

- Create: `packages/agentos/src/voice-pipeline/AcousticEndpointDetector.ts`
- Test: `packages/agentos/src/voice-pipeline/__tests__/AcousticEndpointDetector.spec.ts`

Wraps the existing `AdaptiveVAD` + `SilenceDetector` + `EnvironmentalCalibrator` chain from `packages/agentos/src/core/audio/`.

- [ ] **Step 1: Write tests**

Test that:

- `mode` is `'acoustic'`
- `pushVadEvent({ type: 'speech_end' })` with `source: 'vad'` triggers internal SilenceDetector
- Emits `turn_complete` with `reason: 'silence_timeout'` after the SilenceDetector's `utterance_end_detected` fires
- `reset()` clears internal state
- Does NOT use transcript data at all (pure acoustic)

Use mocked `SilenceDetector` via vi.mock or dependency injection.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/voice-pipeline/__tests__/AcousticEndpointDetector.spec.ts`

- [ ] **Step 3: Implement AcousticEndpointDetector**

Key details:

- Extends `EventEmitter`, implements `IEndpointDetector`
- `mode = 'acoustic'`
- Constructor takes optional `SilenceDetectorConfig` (defaults: `significantPauseThresholdMs: 1500`, `utteranceEndThresholdMs: 3000`)
- Creates internal `SilenceDetector` instance from `../../core/audio/SilenceDetector.js`
- `pushVadEvent()`: converts to `VADResult` format expected by SilenceDetector and calls `silenceDetector.processSilence()` or `silenceDetector.processVADResult()`
- Listens to `silenceDetector.on('utterance_end_detected')` → emits `turn_complete` with `reason: 'silence_timeout'`
- `pushTranscript()`: no-op (this detector is pure acoustic)
- `reset()`: recreate SilenceDetector

- [ ] **Step 4: Run tests, verify pass**

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/voice-pipeline/AcousticEndpointDetector.ts packages/agentos/src/voice-pipeline/__tests__/AcousticEndpointDetector.spec.ts
git commit -m "feat(voice-pipeline): add AcousticEndpointDetector wrapping AdaptiveVAD + SilenceDetector"
```

---

## Task 5: WebSocket Stream Transport

**Files:**

- Create: `packages/agentos/src/voice-pipeline/WebSocketStreamTransport.ts`
- Test: `packages/agentos/src/voice-pipeline/__tests__/WebSocketStreamTransport.spec.ts`

Wraps a `ws.WebSocket` into `IStreamTransport`. Binary messages = audio. Text messages = JSON control.

- [ ] **Step 1: Write tests**

Test:

- `state` transitions: `'connecting'` → `'open'` → `'closed'`
- `sendAudio(chunk)` sends binary message via WS
- `sendControl(msg)` sends JSON text message via WS
- Incoming binary messages emit `'audio_frame'` with parsed `AudioFrame`
- Incoming text messages emit `'control'` with parsed `TransportControlMessage` or `ClientTextMessage`
- `close()` sends close frame and transitions state
- `'disconnected'` emitted when WS closes
- `'error'` emitted on WS error

Use a mock WebSocket (vi.fn() with on/send/close methods).

- [ ] **Step 2: Run test to verify it fails**

- [ ] **Step 3: Implement WebSocketStreamTransport**

Key details:

- Extends `EventEmitter`, implements `IStreamTransport`
- Constructor takes `ws.WebSocket` and `{ sampleRate: number }` config
- `id` = random UUID
- On WS `'message'` with binary data: parse as Float32Array (or typed array view over ArrayBuffer), wrap in `AudioFrame`, emit `'audio_frame'`
- On WS `'message'` with string data: `JSON.parse()`, emit `'control'`
- `sendAudio()`: if `EncodedAudioChunk` (has `audio` Buffer), send as binary. If `AudioFrame`, convert Float32Array to Buffer and send.
- `sendControl()`: `JSON.stringify()` and send as text
- WS `'close'` → set state to `'closed'`, emit `'disconnected'`
- WS `'error'` → emit `'error'`
- `close()`: send WS close frame, set state to `'closing'`

- [ ] **Step 4: Run tests, verify pass**

- [ ] **Step 5: Commit**

```bash
git add packages/agentos/src/voice-pipeline/WebSocketStreamTransport.ts packages/agentos/src/voice-pipeline/__tests__/WebSocketStreamTransport.spec.ts
git commit -m "feat(voice-pipeline): add WebSocketStreamTransport implementing IStreamTransport"
```

---

## Task 6: Barrel Export and Provider Catalog Update

**Files:**

- Create: `packages/agentos/src/voice-pipeline/index.ts`
- Modify: `packages/agentos/src/speech/providerCatalog.ts` (add `streamingCapable` flag)

- [ ] **Step 1: Create barrel export**

```typescript
// packages/agentos/src/voice-pipeline/index.ts
/**
 * Barrel exports for the AgentOS streaming voice pipeline.
 *
 * @module @framers/agentos/voice-pipeline
 */

export * from './types.js';
export { HardCutBargeinHandler } from './HardCutBargeinHandler.js';
export { SoftFadeBargeinHandler } from './SoftFadeBargeinHandler.js';
export { HeuristicEndpointDetector } from './HeuristicEndpointDetector.js';
export { AcousticEndpointDetector } from './AcousticEndpointDetector.js';
export { WebSocketStreamTransport } from './WebSocketStreamTransport.js';
// VoicePipelineOrchestrator exported after Task 7
```

- [ ] **Step 2: Update providerCatalog.ts**

In `packages/agentos/src/speech/providerCatalog.ts`, add `streamingCapable?: boolean` to the catalog entry type and set it to `true` for: `deepgram`, `assemblyai`, `google-stt`, `azure-stt` (STT providers with native streaming). Set `false` or omit for `whisper` (batch-only, streaming simulated via chunking).

Also add new entries for the streaming pipeline providers:

- `{ id: 'deepgram-streaming', kind: 'stt', streamingCapable: true, ... }`
- `{ id: 'whisper-chunked', kind: 'stt', streamingCapable: true, ... }` (simulated)
- `{ id: 'openai-streaming-tts', kind: 'tts', streamingCapable: true, ... }`
- `{ id: 'elevenlabs-streaming-tts', kind: 'tts', streamingCapable: true, ... }`

- [ ] **Step 3: Commit**

```bash
git add packages/agentos/src/voice-pipeline/index.ts packages/agentos/src/speech/providerCatalog.ts
git commit -m "feat(voice-pipeline): add barrel exports and update provider catalog with streaming flags"
```

---

## Task 7: VoicePipelineOrchestrator

**Files:**

- Create: `packages/agentos/src/voice-pipeline/VoicePipelineOrchestrator.ts`
- Test: `packages/agentos/src/voice-pipeline/__tests__/VoicePipelineOrchestrator.spec.ts`
- Modify: `packages/agentos/src/voice-pipeline/index.ts` (add export)

This is the most complex task. The orchestrator wires all interfaces into the conversational loop state machine.

- [ ] **Step 1: Write tests**

Test the state machine with mock implementations of all interfaces:

```typescript
// packages/agentos/src/voice-pipeline/__tests__/VoicePipelineOrchestrator.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventEmitter } from 'events';
import { VoicePipelineOrchestrator } from '../VoicePipelineOrchestrator.js';
import type {
  IStreamTransport,
  IStreamingSTT,
  StreamingSTTSession,
  IEndpointDetector,
  IStreamingTTS,
  StreamingTTSSession,
  IBargeinHandler,
  IVoicePipelineAgentSession,
  AudioFrame,
  VoicePipelineConfig,
} from '../types.js';

// --- Mock factories ---

function createMockTransport(): IStreamTransport {
  const transport = new EventEmitter() as any;
  transport.id = 'test-transport';
  transport.state = 'open';
  transport.sendAudio = vi.fn();
  transport.sendControl = vi.fn();
  transport.close = vi.fn().mockResolvedValue(undefined);
  return transport;
}

function createMockSTTSession(): StreamingSTTSession {
  const session = new EventEmitter() as any;
  session.pushAudio = vi.fn();
  session.flush = vi.fn().mockResolvedValue(undefined);
  session.close = vi.fn().mockResolvedValue(undefined);
  return session;
}

function createMockSTT(session: StreamingSTTSession): IStreamingSTT {
  return {
    providerId: 'mock-stt',
    isStreaming: true,
    startSession: vi.fn().mockResolvedValue(session),
  };
}

function createMockTTSSession(): StreamingTTSSession {
  const session = new EventEmitter() as any;
  session.pushTokens = vi.fn();
  session.flush = vi.fn().mockResolvedValue(undefined);
  session.cancel = vi.fn();
  session.close = vi.fn().mockResolvedValue(undefined);
  return session;
}

function createMockTTS(session: StreamingTTSSession): IStreamingTTS {
  return {
    providerId: 'mock-tts',
    startSession: vi.fn().mockResolvedValue(session),
  };
}

function createMockEndpoint(): IEndpointDetector {
  const detector = new EventEmitter() as any;
  detector.mode = 'heuristic';
  detector.pushVadEvent = vi.fn();
  detector.pushTranscript = vi.fn();
  detector.reset = vi.fn();
  return detector;
}

function createMockAgentSession(): IVoicePipelineAgentSession {
  return {
    sendText: vi.fn().mockReturnValue(
      (async function* () {
        yield 'Hello ';
        yield 'there!';
      })()
    ),
    abort: vi.fn(),
  };
}

describe('VoicePipelineOrchestrator', () => {
  it('starts in idle state', () => {
    const orchestrator = new VoicePipelineOrchestrator({
      stt: 'mock',
      tts: 'mock',
    });
    expect(orchestrator.state).toBe('idle');
  });

  it('transitions to listening on startSession', async () => {
    const sttSession = createMockSTTSession();
    const ttsSession = createMockTTSSession();
    const transport = createMockTransport();
    const endpoint = createMockEndpoint();
    const agentSession = createMockAgentSession();

    const orchestrator = new VoicePipelineOrchestrator({
      stt: 'mock',
      tts: 'mock',
    });

    // Inject mocks (orchestrator accepts pre-built components for testing)
    const session = await orchestrator.startSession(transport, agentSession, {
      streamingSTT: createMockSTT(sttSession),
      streamingTTS: createMockTTS(ttsSession),
      endpointDetector: endpoint,
      bargeinHandler: { mode: 'hard-cut', handleBargein: () => ({ type: 'ignore' }) },
    });

    expect(orchestrator.state).toBe('listening');
    expect(session.sessionId).toBeDefined();
  });

  it('forwards audio frames to STT on transport audio_frame', async () => {
    const sttSession = createMockSTTSession();
    const transport = createMockTransport();
    const endpoint = createMockEndpoint();

    const orchestrator = new VoicePipelineOrchestrator({ stt: 'mock', tts: 'mock' });
    await orchestrator.startSession(transport, createMockAgentSession(), {
      streamingSTT: createMockSTT(sttSession),
      streamingTTS: createMockTTS(createMockTTSSession()),
      endpointDetector: endpoint,
      bargeinHandler: { mode: 'hard-cut', handleBargein: () => ({ type: 'ignore' }) },
    });

    const frame: AudioFrame = {
      samples: new Float32Array(160),
      sampleRate: 16000,
      timestamp: Date.now(),
    };
    transport.emit('audio_frame', frame);

    expect(sttSession.pushAudio).toHaveBeenCalledWith(frame);
  });

  it('transitions LISTENING → PROCESSING → SPEAKING on turn_complete', async () => {
    const sttSession = createMockSTTSession();
    const ttsSession = createMockTTSSession();
    const transport = createMockTransport();
    const endpoint = createMockEndpoint();
    const agentSession = createMockAgentSession();

    const orchestrator = new VoicePipelineOrchestrator({ stt: 'mock', tts: 'mock' });
    await orchestrator.startSession(transport, agentSession, {
      streamingSTT: createMockSTT(sttSession),
      streamingTTS: createMockTTS(ttsSession),
      endpointDetector: endpoint,
      bargeinHandler: { mode: 'hard-cut', handleBargein: () => ({ type: 'ignore' }) },
    });

    expect(orchestrator.state).toBe('listening');

    // Simulate turn complete
    endpoint.emit('turn_complete', {
      transcript: 'Hello',
      confidence: 0.95,
      durationMs: 1000,
      reason: 'punctuation',
    });

    // Should have called agentSession.sendText
    // Allow microtask to process
    await new Promise((r) => setTimeout(r, 10));

    expect(agentSession.sendText).toHaveBeenCalled();
    // After processing the async iterable, should push tokens to TTS
    await new Promise((r) => setTimeout(r, 50));
    expect(ttsSession.pushTokens).toHaveBeenCalled();
  });

  it('transitions to closed on transport disconnect', async () => {
    const transport = createMockTransport();
    const orchestrator = new VoicePipelineOrchestrator({ stt: 'mock', tts: 'mock' });
    await orchestrator.startSession(transport, createMockAgentSession(), {
      streamingSTT: createMockSTT(createMockSTTSession()),
      streamingTTS: createMockTTS(createMockTTSSession()),
      endpointDetector: createMockEndpoint(),
      bargeinHandler: { mode: 'hard-cut', handleBargein: () => ({ type: 'ignore' }) },
    });

    transport.emit('disconnected');
    expect(orchestrator.state).toBe('closed');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/agentos && npx vitest run src/voice-pipeline/__tests__/VoicePipelineOrchestrator.spec.ts`

- [ ] **Step 3: Implement VoicePipelineOrchestrator**

Create `packages/agentos/src/voice-pipeline/VoicePipelineOrchestrator.ts`:

Key implementation details:

- Extends `EventEmitter`
- Constructor takes `VoicePipelineConfig`
- `startSession(transport, agentSession, overrides?)`:
  - `overrides` parameter allows injecting mock implementations for testing
  - If no overrides, resolve components from `ExtensionManager` by kind (future task wires this)
  - Creates `VoicePipelineSession` with unique sessionId
  - Wires event listeners per spec Section 3.3:
    - `transport.on('audio_frame')` → `sttSession.pushAudio()` (+ diarizationSession if present)
    - `sttSession.on('interim_transcript')` → `endpoint.pushTranscript()` + `transport.sendControl({ type: 'transcript', ... })`
    - `sttSession.on('speech_start'/'speech_end')` → `endpoint.pushVadEvent()`
    - `endpoint.on('turn_complete')` → transition to PROCESSING, call `agentSession.sendText()`
    - Iterate `AsyncIterable<string>` from sendText → `ttsSession.pushTokens()`, then `ttsSession.flush()`
    - `ttsSession.on('audio_chunk')` → `transport.sendAudio()`
    - `ttsSession.on('utterance_complete')` on last chunk → transition back to LISTENING
  - Barge-in wiring: during SPEAKING state, if `sttSession.on('speech_start')` fires, call `bargeinHandler.handleBargein()` and act on the result
  - Watchdog timer: 30s max turn duration
  - `transport.on('disconnected')` → transition to CLOSED, tear down all sessions
- State transitions enforce monotonic ordering (with SPEAKING↔LISTENING cycle exception)
- Emit `'state_changed'` on every transition

- [ ] **Step 4: Run tests, verify pass**

- [ ] **Step 5: Update barrel export**

Add to `packages/agentos/src/voice-pipeline/index.ts`:

```typescript
export { VoicePipelineOrchestrator } from './VoicePipelineOrchestrator.js';
```

- [ ] **Step 6: Commit**

```bash
git add packages/agentos/src/voice-pipeline/VoicePipelineOrchestrator.ts packages/agentos/src/voice-pipeline/__tests__/VoicePipelineOrchestrator.spec.ts packages/agentos/src/voice-pipeline/index.ts
git commit -m "feat(voice-pipeline): add VoicePipelineOrchestrator state machine"
```

---

## Task 8: Extension Pack — Streaming STT Deepgram

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/streaming-stt-deepgram/` (full pack)
- Key files: `package.json`, `tsconfig.json`, `vitest.config.ts`, `manifest.json`, `SKILL.md`, `src/index.ts`, `src/DeepgramStreamingSTT.ts`, `src/DeepgramStreamSession.ts`, `src/DeepgramDiarizationAdapter.ts`, `src/types.ts`
- Test: `test/DeepgramStreamSession.spec.ts`

Follow the exact same structure as `packages/agentos-extensions/registry/curated/safety/pii-redaction/`.

- [ ] **Step 1: Scaffold package**

Create `package.json`:

```json
{
  "name": "@framers/agentos-ext-streaming-stt-deepgram",
  "version": "0.1.0",
  "description": "Real-time streaming STT via Deepgram WebSocket API for AgentOS voice pipeline",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" } },
  "files": ["dist", "src", "SKILL.md", "manifest.json"],
  "scripts": { "build": "tsc -p tsconfig.json", "test": "vitest run" },
  "peerDependencies": { "@framers/agentos": "^0.1.0" },
  "dependencies": { "ws": "^8.17.0" },
  "devDependencies": {
    "@framers/agentos": "workspace:*",
    "typescript": "^5.5.0",
    "vitest": "^1.6.0",
    "@types/ws": "^8.5.0"
  },
  "license": "MIT",
  "author": "Frame.dev",
  "repository": {
    "type": "git",
    "url": "https://github.com/framersai/agentos-extensions.git",
    "directory": "registry/curated/voice/streaming-stt-deepgram"
  },
  "publishConfig": { "access": "public" }
}
```

Create `tsconfig.json`, `vitest.config.ts`, `manifest.json` following the pii-redaction pack pattern.

- [ ] **Step 2: Write tests**

Test `DeepgramStreamSession` with a mock WebSocket:

- Opens WS to Deepgram URL with correct query params
- Sends audio frames as binary messages
- Parses Deepgram JSON responses into `interim_transcript` / `final_transcript` events
- Maps `is_final: true` + `speech_final: true` to `speech_end` event
- Extracts `speaker` field from word-level results for diarization
- `close()` sends close frame
- Auto-reconnect on unexpected close (mock WS close, verify reconnect attempt)

- [ ] **Step 3: Implement DeepgramStreamSession**

Key details:

- Opens `wss://api.deepgram.com/v1/listen?model=nova-2&interim_results=true&punctuate=true&diarize=${config.diarize}&language=${config.language}`
- Authorization header: `Token ${apiKey}`
- `pushAudio()`: send Float32Array as binary message (convert to Int16 PCM first — Deepgram expects 16-bit linear PCM)
- Parse incoming messages: `{ type: 'Results', channel: { alternatives: [{ transcript, confidence, words }] }, is_final, speech_final }`
- Map to `TranscriptEvent` with `words: TranscriptWord[]`
- `flush()`: send `{ type: 'CloseStream' }` JSON message
- Reconnect logic: on unexpected close, buffer frames for up to 5s, exponential backoff 100ms → 5s

- [ ] **Step 4: Implement DeepgramStreamingSTT and index.ts**

`DeepgramStreamingSTT` implements `IStreamingSTT`:

- `startSession()` creates `DeepgramStreamSession` with API key from `context.getSecret('DEEPGRAM_API_KEY')`

`index.ts` exports `createExtensionPack()` following the pii-redaction pattern:

- Registers `ExtensionDescriptor` with `kind: EXTENSION_KIND_STREAMING_STT`

- [ ] **Step 5: Write SKILL.md**

Document the extension: what it does, env vars needed, config options.

- [ ] **Step 6: Run tests, verify pass**

Run: `cd packages/agentos-extensions/registry/curated/voice/streaming-stt-deepgram && npx vitest run`

- [ ] **Step 7: Commit**

```bash
git add packages/agentos-extensions/registry/curated/voice/streaming-stt-deepgram/
git commit -m "feat(ext): add streaming-stt-deepgram extension pack for real-time Deepgram STT"
```

---

## Task 9: Extension Pack — Streaming STT Whisper (Chunked)

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/streaming-stt-whisper/` (full pack)

- [ ] **Step 1: Scaffold package** (same pattern as Task 8, no `ws` dependency)

- [ ] **Step 2: Write SlidingWindowBuffer tests**

Test the ring buffer:

- Accumulates audio frames
- Emits chunks at configured size (1s = 16000 samples at 16kHz)
- Chunks overlap by configured amount (200ms = 3200 samples)
- `flush()` emits any remaining buffered audio

- [ ] **Step 3: Implement SlidingWindowBuffer**

Pure data structure: `pushAudio(frame)` accumulates into internal `Float32Array`. When accumulated samples >= chunkSize, emit chunk and retain overlap.

- [ ] **Step 4: Write WhisperChunkSession tests**

Test:

- Receives audio, buffers via SlidingWindowBuffer
- On chunk ready: encode to WAV, POST to Whisper API (mock fetch)
- Emits `interim_transcript` per chunk response
- Previous transcript passed as `prompt` for continuity
- `flush()` sends final chunk, emits `final_transcript`

- [ ] **Step 5: Implement WhisperChunkSession and WhisperChunkedSTT**

Key details:

- Uses `encodeFloat32ToWav()` from `@framers/agentos` (import from `../../speech/audio.js` or peer dep)
- POST to `${baseUrl}/v1/audio/transcriptions` with `model: 'whisper-1'`, `response_format: 'verbose_json'`
- `baseUrl` defaults to `https://api.openai.com` but configurable for local whisper.cpp
- Runs `AdaptiveVAD` in parallel on raw frames for `speech_start`/`speech_end` events

- [ ] **Step 6: Write SKILL.md, manifest.json**

- [ ] **Step 7: Run tests, verify pass**

- [ ] **Step 8: Commit**

```bash
git add packages/agentos-extensions/registry/curated/voice/streaming-stt-whisper/
git commit -m "feat(ext): add streaming-stt-whisper extension pack with sliding window chunked STT"
```

---

## Task 10: Extension Pack — Streaming TTS OpenAI

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/streaming-tts-openai/` (full pack)

- [ ] **Step 1: Scaffold package**

- [ ] **Step 2: Write AdaptiveSentenceChunker tests**

Test:

- Buffers tokens until sentence boundary (`. ? !`)
- Emits sentence on boundary detection
- Forces flush after `maxBufferMs` (2000ms) at nearest word boundary
- `flush()` emits remaining text
- `cancel()` clears buffer and returns remaining text

- [ ] **Step 3: Implement AdaptiveSentenceChunker**

Pure text buffering logic:

- `pushTokens(text)`: append to buffer, scan for sentence boundaries
- Sentence boundary regex: `/[.?!;]\s/` or end of string after `[.?!]`
- If boundary found: emit `'sentence'` event with the complete sentence
- Timer: if no boundary found within `maxBufferMs`, force emit at last space character
- `flush()`: emit whatever remains
- `cancel()`: return remaining buffer, clear

- [ ] **Step 4: Write OpenAITTSSession tests**

Test with mock fetch:

- Receives sentences from chunker → POST to `/v1/audio/speech`
- Emits `audio_chunk` with response body as Buffer
- Pipeline: while chunk N plays, chunk N+1 is already being fetched
- `cancel()`: abort in-flight fetch, emit `cancelled`

- [ ] **Step 5: Implement OpenAITTSSession and OpenAIStreamingTTS**

- [ ] **Step 6: Write SKILL.md, manifest.json**

- [ ] **Step 7: Run tests, verify pass**

- [ ] **Step 8: Commit**

```bash
git add packages/agentos-extensions/registry/curated/voice/streaming-tts-openai/
git commit -m "feat(ext): add streaming-tts-openai extension pack with adaptive sentence chunking"
```

---

## Task 11: Extension Pack — Streaming TTS ElevenLabs

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/streaming-tts-elevenlabs/` (full pack)

- [ ] **Step 1: Scaffold package** (with `ws` dependency)

- [ ] **Step 2: Write ElevenLabsTTSSession tests**

Test with mock WebSocket:

- Opens WS to ElevenLabs streaming endpoint
- Sends text chunks with `flush: true` on sentence boundaries
- Receives audio chunks as binary messages → emits `audio_chunk`
- `cancel()`: sends close frame, emits `cancelled`
- Sends `" "` continuation for mid-sentence forced flushes

- [ ] **Step 3: Implement ElevenLabsTTSSession and ElevenLabsStreamingTTS**

Key details:

- WS URL: `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=eleven_monolingual_v1&output_format=mp3_44100_128`
- Initial message: `{ text: " ", voice_settings: { stability, similarity_boost, style }, xi_api_key }`
- Text chunks: `{ text: "sentence.", flush: true }` or `{ text: "partial " }` (no flush)
- Audio responses: binary frames → `EncodedAudioChunk`

- [ ] **Step 4: Write SKILL.md, manifest.json**

- [ ] **Step 5: Run tests, verify pass**

- [ ] **Step 6: Commit**

```bash
git add packages/agentos-extensions/registry/curated/voice/streaming-tts-elevenlabs/
git commit -m "feat(ext): add streaming-tts-elevenlabs extension pack with WebSocket streaming"
```

---

## Task 12: Extension Pack — Diarization

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/diarization/` (full pack)

This is the most complex extension pack.

- [ ] **Step 1: Scaffold package** (optional dep: `onnxruntime-node`)

- [ ] **Step 2: Write SpeakerEmbeddingCache tests**

Test:

- `addEmbedding(speakerId, embedding)` stores embedding
- `findClosestSpeaker(embedding)` returns best match above threshold (0.7)
- Returns `null` when no match above threshold
- Centroid updates when multiple embeddings for same speaker
- Cosine similarity calculation is correct

- [ ] **Step 3: Implement SpeakerEmbeddingCache**

Pure math: cosine similarity, running centroid average, LRU eviction.

- [ ] **Step 4: Write ClusteringStrategy tests**

Test:

- Agglomerative clustering merges close centroids
- Respects `expectedSpeakers` hint
- Produces stable speaker labels

- [ ] **Step 5: Implement ClusteringStrategy**

- [ ] **Step 6: Write SlidingWindowExtractor tests**

Test:

- Accumulates audio frames into 1.5s chunks with 0.5s overlap
- Emits `'chunk_ready'` with the audio data

- [ ] **Step 7: Implement SlidingWindowExtractor**

Same pattern as SlidingWindowBuffer but with different defaults (1500ms chunks, 500ms overlap).

- [ ] **Step 8: Write DiarizationSession and DiarizationEngine tests**

Test:

- `DiarizationEngine.startSession()` returns a session
- `ProviderDiarizationBackend` delegates to STT provider when available
- `LocalDiarizationBackend` uses SlidingWindowExtractor + SpeakerEmbeddingCache
- `enrollSpeaker()` registers a known voiceprint
- `labelTranscript()` returns `DiarizedSegment` with speaker assignment

- [ ] **Step 9: Implement all diarization components**

Key details:

- `DiarizationEngine.startSession()`: check if STT provides `supportsDiarization()` → `ProviderDiarizationBackend`, else → `LocalDiarizationBackend`
- `LocalDiarizationBackend`: for initial implementation, use a simple energy-based voiceprint (spectral centroid) rather than requiring ONNX. The ONNX x-vector model integration can be added as an enhancement. This keeps the initial implementation testable without model files.
- `ProviderDiarizationBackend`: thin wrapper that extracts speaker labels from STT transcript events
- Model loading via `ISharedServiceRegistry.getOrCreate('diarization-model', ...)` when ONNX is available

- [ ] **Step 10: Write SKILL.md, manifest.json**

- [ ] **Step 11: Run tests, verify pass**

- [ ] **Step 12: Commit**

```bash
git add packages/agentos-extensions/registry/curated/voice/diarization/
git commit -m "feat(ext): add diarization extension pack with provider delegation and local clustering"
```

---

## Task 13: Extension Pack — Semantic Endpoint Detector

**Files:**

- Create: `packages/agentos-extensions/registry/curated/voice/endpoint-semantic/` (full pack)

- [ ] **Step 1: Scaffold package**

- [ ] **Step 2: Write TurnCompletenessClassifier tests**

Test with mock LLM:

- Sends correct prompt with transcript + context
- Returns `'COMPLETE'` or `'INCOMPLETE'`
- Respects timeout (500ms default)
- LRU cache: same prefix → cached result
- Falls back gracefully on timeout or error

- [ ] **Step 3: Implement TurnCompletenessClassifier**

Key details:

- Uses `SmallModelResolver` from existing codebase to pick cheapest model
- Prompt: `"Is the following utterance a complete thought that expects a response, or is the speaker likely to continue? Context (last 2 turns): {context}\n\nCurrent utterance: {transcript}\n\nRespond with exactly COMPLETE or INCOMPLETE, then one sentence of reasoning."`
- Parse response: check if first word is `COMPLETE` or `INCOMPLETE`
- LRU cache keyed by transcript prefix (first 100 chars)

- [ ] **Step 4: Write SemanticEndpointDetector tests**

Test:

- Only invokes classifier when VAD silence detected AND no clear punctuation
- Emits `turn_complete` with `reason: 'semantic_model'` on `COMPLETE`
- Does NOT emit on `INCOMPLETE` (waits for more speech)
- Falls back to silence timeout if classifier times out

- [ ] **Step 5: Implement SemanticEndpointDetector**

Extends `HeuristicEndpointDetector` (inherits punctuation/backchannel logic), adds LLM classification for uncertain cases.

- [ ] **Step 6: Write SKILL.md, manifest.json**

- [ ] **Step 7: Run tests, verify pass**

- [ ] **Step 8: Commit**

```bash
git add packages/agentos-extensions/registry/curated/voice/endpoint-semantic/
git commit -m "feat(ext): add endpoint-semantic extension pack with LLM turn-completeness classification"
```

---

## Task 14: Wunderland CLI Integration

**Files:**

- Create: `packages/wunderland/src/voice/streaming-pipeline.ts`
- Create: `packages/wunderland/src/voice/ws-server.ts`
- Modify: `packages/wunderland/src/voice/index.ts` (update barrel)
- Modify: `packages/wunderland/src/cli/commands/chat.ts` (add `--voice` flags)
- Modify: `packages/wunderland/src/cli/commands/start/seed-initializer.ts` (add `--voice` flags)

- [ ] **Step 1: Create streaming-pipeline.ts**

```typescript
// packages/wunderland/src/voice/streaming-pipeline.ts
/**
 * Factory that creates a fully-wired VoicePipelineOrchestrator from
 * Wunderland CLI config. Resolves providers from agent.config.json voice
 * section, loads extension packs via ExtensionManager, falls back to
 * built-in defaults.
 */
import type { VoicePipelineConfig } from '@framers/agentos/voice-pipeline';
import { VoicePipelineOrchestrator } from '@framers/agentos/voice-pipeline';
import type { ExtensionManager } from '@framers/agentos';

export interface StreamingPipelineOptions {
  stt?: string;
  tts?: string;
  endpointing?: 'acoustic' | 'heuristic' | 'semantic';
  diarization?: boolean;
  bargeIn?: 'hard-cut' | 'soft-fade' | 'disabled';
  voice?: string;
  language?: string;
  port?: number;
}

export async function createStreamingPipeline(
  options: StreamingPipelineOptions,
  extensionManager?: ExtensionManager
): Promise<VoicePipelineOrchestrator> {
  const config: VoicePipelineConfig = {
    stt: options.stt ?? 'whisper-chunked',
    tts: options.tts ?? 'openai',
    endpointing: options.endpointing ?? 'heuristic',
    diarization: options.diarization ?? false,
    bargeIn: options.bargeIn ?? 'hard-cut',
    voice: options.voice,
    language: options.language ?? 'en-US',
  };

  // Resolve extension packs from ExtensionManager by kind
  // (Implementation wires to actual extension loading)

  return new VoicePipelineOrchestrator(config);
}
```

- [ ] **Step 2: Create ws-server.ts**

```typescript
// packages/wunderland/src/voice/ws-server.ts
/**
 * Starts a local WebSocket server for voice pipeline sessions.
 * Each WS connection gets its own VoicePipelineSession.
 */
import { WebSocketServer } from 'ws';
import { WebSocketStreamTransport } from '@framers/agentos/voice-pipeline';
import type {
  VoicePipelineOrchestrator,
  IVoicePipelineAgentSession,
} from '@framers/agentos/voice-pipeline';

export interface VoiceServerOptions {
  port?: number;
  host?: string;
}

export async function startVoiceServer(
  pipeline: VoicePipelineOrchestrator,
  agentSessionFactory: () => IVoicePipelineAgentSession,
  options?: VoiceServerOptions
): Promise<{ port: number; close: () => Promise<void> }> {
  const port = options?.port ?? 0; // 0 = auto-assign
  const host = options?.host ?? '127.0.0.1';

  const wss = new WebSocketServer({ port, host });

  wss.on('connection', async (ws) => {
    const transport = new WebSocketStreamTransport(ws, { sampleRate: 16000 });
    const agentSession = agentSessionFactory();
    await pipeline.startSession(transport, agentSession);
  });

  const actualPort = (wss.address() as any)?.port ?? port;

  return {
    port: actualPort,
    close: () => new Promise<void>((resolve) => wss.close(() => resolve())),
  };
}
```

- [ ] **Step 3: Update barrel export**

Add to `packages/wunderland/src/voice/index.ts`:

```typescript
export { createStreamingPipeline } from './streaming-pipeline.js';
export type { StreamingPipelineOptions } from './streaming-pipeline.js';
export { startVoiceServer } from './ws-server.js';
export type { VoiceServerOptions } from './ws-server.js';
```

- [ ] **Step 4: Add CLI flags to chat.ts**

In `packages/wunderland/src/cli/commands/chat.ts`, add these flags alongside existing `--no-guardrails` flags:

```typescript
// Voice pipeline flags
// --voice                    Enable voice mode (streaming pipeline)
// --voice-stt <provider>     STT provider (deepgram, whisper-chunked)
// --voice-tts <provider>     TTS provider (openai, elevenlabs)
// --voice-endpointing <mode> Endpointing (acoustic, heuristic, semantic)
// --voice-diarization        Enable speaker diarization
// --voice-barge-in <mode>    Barge-in handling (hard-cut, soft-fade, disabled)
// --voice-port <port>        WebSocket server port (default: auto)
```

When `--voice` is present, after the agent session is created, call `createStreamingPipeline()` and `startVoiceServer()`, log the WS URL.

- [ ] **Step 5: Add CLI flags to seed-initializer.ts**

Same flags parsed in `packages/wunderland/src/cli/commands/start/seed-initializer.ts`.

- [ ] **Step 6: Add completions**

Add the new flags to `packages/wunderland/src/cli/commands/completions.ts`.

- [ ] **Step 7: Commit**

```bash
git add packages/wunderland/src/voice/streaming-pipeline.ts packages/wunderland/src/voice/ws-server.ts packages/wunderland/src/voice/index.ts packages/wunderland/src/cli/commands/chat.ts packages/wunderland/src/cli/commands/start/seed-initializer.ts packages/wunderland/src/cli/commands/completions.ts
git commit -m "feat(wunderland): add --voice CLI flags and streaming pipeline integration"
```

---

## Task 15: Documentation

**Files:**

- Create: `apps/agentos-live-docs/docs/features/voice-pipeline.md`
- Modify: `apps/agentos-live-docs/sidebars.js` (add Voice Pipeline entry)

- [ ] **Step 1: Write voice pipeline architecture docs page**

Cover:

- Overview: what the streaming voice pipeline is, why it exists
- Architecture diagram (Mermaid): transport → STT + diarization → endpoint → LLM → TTS → transport
- Configuration: `agent.config.json` voice section with all options documented
- CLI flags reference
- Extension packs: table of all 6 packs with description, env vars, npm package
- Built-in components: endpoint detectors, barge-in handlers
- WebSocket protocol: client/server message types
- Error recovery behavior

- [ ] **Step 2: Add to sidebar**

In `apps/agentos-live-docs/sidebars.js`, add `'features/voice-pipeline'` to the Features category.

- [ ] **Step 3: Commit**

```bash
git add apps/agentos-live-docs/docs/features/voice-pipeline.md apps/agentos-live-docs/sidebars.js
git commit -m "docs: add voice pipeline architecture and configuration guide"
```

---

## Task 16: Integration Test

**Files:**

- Create: `packages/agentos/src/voice-pipeline/__tests__/integration.spec.ts`

- [ ] **Step 1: Write full loop integration test**

Test the complete conversational loop with all mock components:

1. Create orchestrator with mock STT, TTS, endpoint, barge-in
2. Start session with mock transport and mock agent session
3. Simulate: transport sends audio frames → STT emits transcript → endpoint fires turn_complete → agent session returns token stream → TTS emits audio chunks → transport receives audio
4. Verify all state transitions: IDLE → LISTENING → PROCESSING → SPEAKING → LISTENING
5. Test barge-in: during SPEAKING, simulate speech_start → verify TTS cancelled, state returns to LISTENING
6. Test disconnect: transport emits disconnected → verify state is CLOSED

- [ ] **Step 2: Run integration test**

Run: `cd packages/agentos && npx vitest run src/voice-pipeline/__tests__/integration.spec.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add packages/agentos/src/voice-pipeline/__tests__/integration.spec.ts
git commit -m "test(voice-pipeline): add full conversational loop integration test"
```
