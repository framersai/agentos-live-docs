# Telephony Providers — Design Spec

**Sub-project A** of the Voice Pipeline initiative (B → C → A).

**Goal:** Implement Twilio, Telnyx, and Plivo voice call providers for AgentOS, bridge phone calls into the streaming voice pipeline via `TelephonyStreamTransport`, and surface DTMF events to the LLM — all fetch-only in core, no SDKs, no Python.

**Architecture:** Three `IVoiceCallProvider` implementations in `packages/agentos/src/voice/providers/` using REST APIs via fetch. A `TelephonyStreamTransport` bridges provider media stream WebSockets into the `IStreamTransport` interface from Sub-project B, handling mu-law ↔ PCM conversion. Provider-specific WebSocket message formats are isolated in `MediaStreamParser` adapters. DTMF digits are surfaced as normalized events for the LLM to interpret — no IVR menu engine.

**Tech Stack:** TypeScript, fetch API, Node.js `crypto` (for webhook verification), `ws` (already a dependency), vitest.

---

## 1. Scope

### In Scope

- 3 telephony providers: Twilio, Telnyx, Plivo (all fetch-only, in core)
- `TelephonyStreamTransport` — `IStreamTransport` implementation bridging phone audio to the streaming pipeline
- `MediaStreamParser` interface + 3 parser implementations (Twilio, Telnyx, Plivo WebSocket formats)
- `NormalizedDtmfReceived` event type added to the existing discriminated union
- XML/TwiML generation helpers for all 3 providers
- Wunderland CLI telephony webhook server
- CLI flags for telephony configuration
- Tests for all components

### Out of Scope

- IVR menu engine / DTMF menu trees (LLM handles digit interpretation)
- SIP trunking (providers handle SIP internally)
- WebRTC direct (future — `IStreamTransport` abstraction supports it later)
- Call recording / transcription storage (future)
- Multi-party conferencing

---

## 2. TelephonyStreamTransport

New file: `packages/agentos/src/voice/TelephonyStreamTransport.ts`

Implements `IStreamTransport` from `packages/agentos/src/voice-pipeline/types.ts`. Bridges a telephony provider's media stream WebSocket into the streaming voice pipeline.

### Class

```typescript
class TelephonyStreamTransport extends EventEmitter implements IStreamTransport {
  readonly id: string;
  readonly state: 'connecting' | 'open' | 'closing' | 'closed';

  constructor(
    ws: WebSocket,
    parser: MediaStreamParser,
    config?: { outputSampleRate?: number } // default 16000 (pipeline expects 16kHz)
  );

  // --- Incoming audio (phone → pipeline) ---
  // ws message → parser.parseIncoming() → { type: 'audio', payload: Buffer (mu-law) }
  //   → convertMulawToPcm16(payload) → Int16 PCM
  //   → resample 8kHz → outputSampleRate (linear interpolation)
  //   → convert Int16 to Float32Array
  //   → emit 'audio' as AudioFrame { samples, sampleRate, timestamp }

  // --- Outgoing audio (pipeline → phone) ---
  // sendAudio(chunk: EncodedAudioChunk): Promise<void>
  //   → decode EncodedAudioChunk to PCM → resample to 8kHz → convertPcmToMulaw8k()
  //   → parser.formatOutgoing(mulawBuffer, streamSid) → ws.send()
  //   (Private helper convertToMulaw() handles AudioFrame input for internal use)

  // --- DTMF ---
  // parser.parseIncoming() → { type: 'dtmf', digit } → emit 'dtmf' event (extension event)

  // --- Control ---
  // parser.parseIncoming() → { type: 'start', streamSid, callSid } → store streamSid, set state 'open'
  // parser.parseIncoming() → { type: 'stop' } → emit 'close', set state 'closed'

  // IStreamTransport interface methods (exact signatures):
  sendAudio(chunk: EncodedAudioChunk): Promise<void>;
  sendControl(message: ServerTextMessage): Promise<void>;
  close(code?: number, reason?: string): void;

  // Events (IStreamTransport contract):
  // 'audio' (AudioFrame) — inbound audio from phone
  // 'close' () — transport closed
  // Extension events (TelephonyStreamTransport-specific):
  // 'dtmf' ({ digit: string, durationMs?: number }) — DTMF tone received
}
```

Reuses `convertPcmToMulaw8k()` and `convertMulawToPcm16()` from the existing `telephony-audio.ts`.

---

## 3. MediaStreamParser

New file: `packages/agentos/src/voice/MediaStreamParser.ts`

### Interface

```typescript
interface MediaStreamParser {
  /** Parse an incoming WebSocket message into structured data */
  parseIncoming(data: Buffer | string): MediaStreamIncoming | null;

  /** Format outgoing mu-law audio into the provider's WS message format */
  formatOutgoing(audio: Buffer, streamSid: string): Buffer | string;

  /** Generate the initial connection acknowledgment message (provider-specific) */
  formatConnected?(streamSid: string): string | null;
}

type MediaStreamIncoming =
  | { type: 'audio'; payload: Buffer; streamSid: string; sequenceNumber?: number }
  | { type: 'dtmf'; digit: string; streamSid: string }
  | { type: 'start'; streamSid: string; callSid: string; metadata?: Record<string, unknown> }
  | { type: 'stop'; streamSid: string }
  | { type: 'mark'; name: string; streamSid: string };
```

### 3.1 TwilioMediaStreamParser

File: `packages/agentos/src/voice/parsers/TwilioMediaStreamParser.ts`

Twilio `<Connect><Stream>` sends JSON messages over WebSocket:

```
Incoming:
  { "event": "start", "streamSid": "MZ...", "start": { "callSid": "CA...", ... } }
  { "event": "media", "streamSid": "MZ...", "media": { "payload": "base64MuLaw", "track": "inbound" } }
  { "event": "dtmf", "streamSid": "MZ...", "dtmf": { "digit": "1", "duration": 500 } }
  { "event": "stop", "streamSid": "MZ..." }
  { "event": "mark", "streamSid": "MZ...", "mark": { "name": "my-mark" } }

Outgoing:
  { "event": "media", "streamSid": "MZ...", "media": { "payload": "base64MuLaw" } }
  { "event": "mark", "streamSid": "MZ...", "mark": { "name": "playback-done" } }

Connected:
  { "event": "connected", "protocol": "Call", "version": "1.0.0" }
```

Parser maps these JSON fields to `MediaStreamIncoming`. Audio payloads are base64-decoded to raw mu-law bytes.

### 3.2 TelnyxMediaStreamParser

File: `packages/agentos/src/voice/parsers/TelnyxMediaStreamParser.ts`

Telnyx media streams use a different JSON format:

```
Incoming:
  { "event": "media", "media": { "track": "inbound", "chunk": "base64MuLaw" }, "stream_id": "..." }
  { "event": "start", "stream_id": "...", "call_control_id": "..." }
  { "event": "stop", "stream_id": "..." }

Outgoing:
  Binary mu-law frames sent directly (no JSON wrapper for audio)
```

Telnyx sends audio as base64 in JSON but receives raw binary for outgoing. The parser handles this asymmetry.

### 3.3 PlivoMediaStreamParser

File: `packages/agentos/src/voice/parsers/PlivoMediaStreamParser.ts`

Plivo Audio Streams:

```
Incoming:
  { "event": "start", "stream_id": "...", "call_uuid": "..." }
  { "event": "media", "media": { "payload": "base64MuLaw", "timestamp": "..." }, "stream_id": "..." }
  { "event": "stop", "stream_id": "..." }

Outgoing:
  { "event": "playAudio", "media": { "payload": "base64MuLaw" } }
```

---

## 4. Telephony Providers

All live in `packages/agentos/src/voice/providers/`. Each implements `IVoiceCallProvider` using fetch. No SDKs.

### 4.1 TwilioVoiceProvider

File: `packages/agentos/src/voice/providers/twilio.ts`

```typescript
class TwilioVoiceProvider implements IVoiceCallProvider {
  readonly name = 'twilio';

  constructor(
    private config: {
      accountSid: string;
      authToken: string;
      fetchImpl?: typeof fetch;
    }
  ) {}
}
```

**Auth:** `Authorization: Basic ${base64(accountSid:authToken)}`

**API calls:**

- `initiateCall()`: `POST https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json` with form-encoded body: `To`, `From`, `Url` (webhook), `StatusCallback`, `StatusCallbackEvent[]=initiated&StatusCallbackEvent[]=ringing&StatusCallbackEvent[]=answered&StatusCallbackEvent[]=completed`
- `hangupCall()`: `POST /Accounts/${accountSid}/Calls/${sid}.json` with `Status=completed`
- `playTts()`: `POST /Accounts/${accountSid}/Calls/${sid}.json` with `Twiml=<Response><Say voice="${voice}">${text}</Say></Response>`

**Webhook verification:** HMAC-SHA1 of the full webhook URL + sorted POST body params, using `authToken` as key. Compare against `X-Twilio-Signature` header.

**Event mapping:**
| Twilio `CallStatus` | NormalizedCallEvent `kind` |
|---------------------|---------------------------|
| `ringing` | `call-ringing` |
| `in-progress` | `call-answered` |
| `completed` | `call-completed` |
| `failed` | `call-failed` |
| `busy` | `call-busy` |
| `no-answer` | `call-no-answer` |
| `canceled` | `call-hangup-user` |

DTMF: Twilio sends `Digits` param in webhook when `<Gather>` is used. Also available via media stream `dtmf` event.

Env: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`

### 4.2 TelnyxVoiceProvider

File: `packages/agentos/src/voice/providers/telnyx.ts`

```typescript
class TelnyxVoiceProvider implements IVoiceCallProvider {
  readonly name = 'telnyx';

  constructor(
    private config: {
      apiKey: string;
      connectionId: string;
      publicKey?: string; // for webhook verification
      fetchImpl?: typeof fetch;
    }
  ) {}
}
```

**Auth:** `Authorization: Bearer ${apiKey}`

**API calls:**

- `initiateCall()`: `POST https://api.telnyx.com/v2/calls` with JSON body: `{ connection_id, to, from, webhook_url }`. Note: Telnyx does NOT accept `stream_url` in Create Call. Media streaming is started separately after `call.answered` webhook via `POST /v2/calls/${callControlId}/actions/streaming_start` with `{ stream_url, stream_track: 'both_tracks' }`.
- `hangupCall()`: `POST /v2/calls/${callControlId}/actions/hangup`
- `playTts()`: `POST /v2/calls/${callControlId}/actions/speak` with `{ payload: text, voice, language }`

**Webhook verification:** Ed25519 signature. Verify `X-Telnyx-Signature-Ed25519` header against `X-Telnyx-Timestamp + body` using Telnyx public key. Uses Node.js `crypto.verify()` with `'ed25519'` algorithm.

**Event mapping:**
| Telnyx `event_type` | NormalizedCallEvent `kind` |
|--------------------|---------------------------|
| `call.initiated` | `call-ringing` |
| `call.answered` | `call-answered` |
| `call.hangup` | `call-completed` or `call-hangup-user` (based on `hangup_cause`) |
| `call.machine.detection.ended` | `call-voicemail` (if `result === 'machine'`) |
| `call.dtmf.received` | `call-dtmf` |

**Note:** Telnyx does not send DTMF over the media stream WebSocket. DTMF arrives via the `call.dtmf.received` webhook event only. The `TelnyxMediaStreamParser` does not handle DTMF — it is processed by `TelnyxVoiceProvider.parseWebhookEvent()`. `durationMs` is not available from Telnyx DTMF events.

Env: `TELNYX_API_KEY`, `TELNYX_CONNECTION_ID`

### 4.3 PlivoVoiceProvider

File: `packages/agentos/src/voice/providers/plivo.ts`

```typescript
class PlivoVoiceProvider implements IVoiceCallProvider {
  readonly name = 'plivo';

  constructor(
    private config: {
      authId: string;
      authToken: string;
      fetchImpl?: typeof fetch;
    }
  ) {}
}
```

**Auth:** `Authorization: Basic ${base64(authId:authToken)}`

**API calls:**

- `initiateCall()`: `POST https://api.plivo.com/v1/Account/${authId}/Call/` with JSON body: `{ from, to, answer_url, answer_method: 'POST' }`
- `hangupCall()`: `DELETE /v1/Account/${authId}/Call/${callUuid}/`
- `playTts()`: `POST /v1/Account/${authId}/Call/${callUuid}/Speak/` with `{ text, voice, language }`

**Webhook verification:** HMAC-SHA256 of `webhook_url + nonce` using `authToken` as key. Compare against `X-Plivo-Signature-V3` header with nonce from `X-Plivo-Signature-V3-Nonce`.

**Event mapping:**
| Plivo param | NormalizedCallEvent `kind` |
|------------|---------------------------|
| `CallStatus=ringing` | `call-ringing` |
| `CallStatus=in-progress` | `call-answered` |
| `CallStatus=completed` | `call-completed` |
| `CallStatus=busy` | `call-busy` |
| `CallStatus=no-answer` | `call-no-answer` |
| `CallStatus=failed` | `call-failed` |

**Note on Plivo DTMF:** Plivo DTMF is collected via the `<GetDigits>` XML verb in webhook responses, not as async push events or media stream messages. When a webhook response includes `<GetDigits>`, Plivo calls back to the `action` URL with the digits in the `Digits` param. The `PlivoVoiceProvider.parseWebhookEvent()` should check for the `Digits` param and emit a `call-dtmf` event. This is a synchronous request-response pattern, unlike Twilio/Telnyx which push DTMF asynchronously.

Env: `PLIVO_AUTH_ID`, `PLIVO_AUTH_TOKEN`

---

## 5. DTMF Event Type

Modify: `packages/agentos/src/voice/types.ts`

Add to the `NormalizedCallEvent` discriminated union:

```typescript
interface NormalizedDtmfReceived extends NormalizedEventBase {
  kind: 'call-dtmf';
  /** The digit pressed: '0'-'9', '*', '#' */
  digit: string;
  /** How long the key was pressed (ms), if available */
  durationMs?: number;
}
```

Update the union type:

```typescript
export type NormalizedCallEvent =
  | NormalizedCallRinging
  | NormalizedCallAnswered
  | NormalizedCallCompleted
  | NormalizedCallFailed
  | NormalizedCallBusy
  | NormalizedCallNoAnswer
  | NormalizedCallVoicemail
  | NormalizedCallHangupUser
  | NormalizedCallError
  | NormalizedTranscript
  | NormalizedSpeechStart
  | NormalizedMediaStreamConnected
  | NormalizedDtmfReceived; // NEW
```

### CallManager DTMF Handling

The following changes are required in `CallManager.ts`:

1. Add `'call:dtmf'` to the `CallManagerEventType` union
2. Add a `case 'call-dtmf':` branch in `processNormalizedEvent()`:
   ```typescript
   case 'call-dtmf':
     this.emitEvent({ type: 'call:dtmf', callId, call, data: { digit: event.digit, durationMs: event.durationMs } });
     break;
   ```
3. DTMF does NOT trigger a state transition — the call stays in its current state

### Pipeline Integration

DTMF arrives through two paths depending on the provider:

1. **Media stream path** (Twilio only): `TelephonyStreamTransport` receives DTMF from the parser and emits a `'dtmf'` event. The orchestrator can listen and inject `[User pressed digit: ${digit}]` into the LLM context.
2. **Webhook path** (all providers): `CallManager` processes the `call-dtmf` event and emits `'call:dtmf'`. The Wunderland CLI wires this to the pipeline orchestrator.

Both paths converge at the LLM — the agent decides what the digit means. No IVR menu engine.

---

## 6. TwiML / XML Generation

New file: `packages/agentos/src/voice/twiml.ts`

Utility functions for generating provider-specific XML responses for webhook callbacks:

```typescript
/** Generate TwiML for Twilio conversation mode (media stream connect) */
export function twilioConversationTwiml(streamUrl: string, token?: string): string;

/** Generate TwiML for Twilio notify mode (say + hangup) */
export function twilioNotifyTwiml(text: string, voice?: string): string;

/** Generate Telnyx streaming XML response */
export function telnyxStreamXml(streamUrl: string): string;

/** Generate Plivo streaming XML response */
export function plivoStreamXml(streamUrl: string): string;

/** Generate Plivo speak + hangup XML */
export function plivoNotifyXml(text: string, voice?: string): string;
```

All functions use the existing `escapeXml()` from `telephony-audio.ts` for XSS protection.

---

## 7. Wunderland CLI Integration

### Webhook Server

New file: `packages/wunderland/src/voice/telephony-webhook-server.ts`

```typescript
export async function startTelephonyWebhookServer(
  callManager: CallManager,
  provider: IVoiceCallProvider,
  pipeline: VoicePipelineOrchestrator, // from packages/agentos/src/voice-pipeline/ (Sub-project B)
  options?: {
    port?: number;
    host?: string;
    basePath?: string; // default '/api/voice'
  }
): Promise<{ port: number; url: string; close: () => Promise<void> }>;
```

Routes:

- `POST ${basePath}/webhook/:provider` — Provider webhook callback (e.g. `/api/voice/webhook/twilio`). Resolves provider by name, verifies signature, parses event, processes through `callManager.processWebhook(providerName, ctx)`. Returns appropriate XML for conversation/notify mode.
- `POST ${basePath}/status/:provider` — Status callback. Same verify + parse flow, no XML response needed.

Data flow: incoming HTTP POST → resolve provider by `:provider` param → `provider.verifyWebhook(ctx)` → `provider.parseWebhookEvent(ctx)` → `callManager.processNormalizedEvent(event)` → state machine + event emission → return XML response (if needed).

For `conversation` mode: the webhook response contains XML that tells the provider to connect a media stream WebSocket to the Wunderland voice WS server (from Sub-project B). When the media stream connects, `TelephonyStreamTransport` wraps it and feeds into the pipeline.

### CLI Flags

Added to `start` and `chat` commands:

```
--voice-provider <provider>     Telephony provider (twilio, telnyx, plivo)
--voice-phone-from <number>     E.164 from number
--voice-phone-to <number>       E.164 to number (for outbound calls)
--voice-call-mode <mode>        Call mode (conversation, notify)
--voice-inbound-policy <p>      Inbound policy (disabled, allowlist, pairing, open)
--voice-webhook-port <port>     Webhook server port (default: auto)
```

### agent.config.json

```json
{
  "voice": {
    "telephony": {
      "provider": "twilio",
      "fromNumber": "+15551234567",
      "inboundPolicy": "open",
      "callMode": "conversation",
      "webhookBaseUrl": "https://your-server.com/api/voice"
    }
  }
}
```

---

## 8. File Map

### Core (`packages/agentos/src/voice/`)

| File                                 | Action                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------- |
| `types.ts`                           | MODIFY — add `NormalizedDtmfReceived` to union                                           |
| `CallManager.ts`                     | MODIFY — add `'call:dtmf'` to event types + `'call-dtmf'` case in processNormalizedEvent |
| `TelephonyStreamTransport.ts`        | NEW                                                                                      |
| `MediaStreamParser.ts`               | NEW — interface + types                                                                  |
| `parsers/TwilioMediaStreamParser.ts` | NEW                                                                                      |
| `parsers/TelnyxMediaStreamParser.ts` | NEW                                                                                      |
| `parsers/PlivoMediaStreamParser.ts`  | NEW                                                                                      |
| `providers/twilio.ts`                | NEW                                                                                      |
| `providers/telnyx.ts`                | NEW                                                                                      |
| `providers/plivo.ts`                 | NEW                                                                                      |
| `twiml.ts`                           | NEW                                                                                      |
| `index.ts`                           | MODIFY — export all new components                                                       |

### Wunderland (`packages/wunderland/src/voice/`)

| File                          | Action                         |
| ----------------------------- | ------------------------------ |
| `telephony-webhook-server.ts` | NEW                            |
| `index.ts`                    | MODIFY — export webhook server |

### Tests

| Test                                         | What                                           |
| -------------------------------------------- | ---------------------------------------------- |
| `__tests__/TelephonyStreamTransport.spec.ts` | Mu-law conversion, DTMF, pipeline integration  |
| `__tests__/TwilioMediaStreamParser.spec.ts`  | JSON parsing, base64 decode, format outgoing   |
| `__tests__/TelnyxMediaStreamParser.spec.ts`  | Same                                           |
| `__tests__/PlivoMediaStreamParser.spec.ts`   | Same                                           |
| `__tests__/TwilioVoiceProvider.spec.ts`      | API calls, webhook verification, event mapping |
| `__tests__/TelnyxVoiceProvider.spec.ts`      | Same                                           |
| `__tests__/PlivoVoiceProvider.spec.ts`       | Same                                           |
| `__tests__/twiml.spec.ts`                    | XML generation, escaping                       |

---

## 9. Testing Strategy

**Unit tests (per component, mock fetch):**

- Each provider: `initiateCall`, `hangupCall`, `verifyWebhook`, `parseWebhookEvent`, `playTts`
- Each parser: `parseIncoming` with real JSON samples, `formatOutgoing`, edge cases
- `TelephonyStreamTransport`: mu-law ↔ PCM round-trip, DTMF event relay, state transitions
- `twiml.ts`: XML output correctness, XSS escaping

**Integration tests:**

- Full flow: mock WS → parser → transport → pipeline connection
- CallManager + provider: initiate call → webhook events → state transitions

**No real API calls in CI** — gated behind provider-specific env flags.
