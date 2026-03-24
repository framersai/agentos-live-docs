# Telephony Providers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Twilio, Telnyx, and Plivo telephony providers for AgentOS with a TelephonyStreamTransport bridge to the streaming voice pipeline and DTMF event support.

**Architecture:** Three fetch-only `IVoiceCallProvider` implementations in core. A `TelephonyStreamTransport` bridges provider media stream WebSockets to the pipeline's `IStreamTransport` interface, handling mu-law ↔ PCM conversion. Provider-specific WS message formats isolated in `MediaStreamParser` adapters. DTMF surfaced as normalized events.

**Tech Stack:** TypeScript, fetch API, Node.js `crypto`, `ws`, vitest

**Spec:** `docs/superpowers/specs/2026-03-24-telephony-providers-design.md`

---

## File Structure

### Core (`packages/agentos/src/voice/`)

| File                                 | Action | Responsibility                                    |
| ------------------------------------ | ------ | ------------------------------------------------- |
| `types.ts`                           | MODIFY | Add `NormalizedDtmfReceived` to event union       |
| `CallManager.ts`                     | MODIFY | Add `'call:dtmf'` event type + `'call-dtmf'` case |
| `MediaStreamParser.ts`               | NEW    | Interface + `MediaStreamIncoming` types           |
| `parsers/TwilioMediaStreamParser.ts` | NEW    | Twilio WS JSON format parser                      |
| `parsers/TelnyxMediaStreamParser.ts` | NEW    | Telnyx WS format parser                           |
| `parsers/PlivoMediaStreamParser.ts`  | NEW    | Plivo WS format parser                            |
| `TelephonyStreamTransport.ts`        | NEW    | IStreamTransport for phone audio                  |
| `providers/twilio.ts`                | NEW    | Twilio REST API provider                          |
| `providers/telnyx.ts`                | NEW    | Telnyx REST API provider                          |
| `providers/plivo.ts`                 | NEW    | Plivo REST API provider                           |
| `twiml.ts`                           | NEW    | XML generation for all 3 providers                |
| `index.ts`                           | MODIFY | Export new components                             |

### Wunderland (`packages/wunderland/src/voice/`)

| File                          | Action | Responsibility         |
| ----------------------------- | ------ | ---------------------- |
| `telephony-webhook-server.ts` | NEW    | HTTP webhook endpoints |
| `index.ts`                    | MODIFY | Export webhook server  |

---

## Task 1: DTMF Types + CallManager Update

**Files:**

- Modify: `packages/agentos/src/voice/types.ts`
- Modify: `packages/agentos/src/voice/CallManager.ts`
- Test: `packages/agentos/src/voice/__tests__/dtmf-types.spec.ts`

- [ ] **Step 1: Read existing types.ts and CallManager.ts**

Read `src/voice/types.ts` to find `NormalizedCallEvent` union and `NormalizedEventBase`. Read `src/voice/CallManager.ts` to find `CallManagerEventType` union and `processNormalizedEvent()` switch statement.

- [ ] **Step 2: Add NormalizedDtmfReceived to types.ts**

After the existing `NormalizedMediaStreamConnected` interface, add:

```typescript
/** DTMF digit received during a call. */
interface NormalizedDtmfReceived extends NormalizedEventBase {
  kind: 'call-dtmf';
  /** The digit pressed: '0'-'9', '*', '#' */
  digit: string;
  /** How long the key was pressed (ms), if available */
  durationMs?: number;
}
```

Add `| NormalizedDtmfReceived` to the `NormalizedCallEvent` union. Export `NormalizedDtmfReceived`.

- [ ] **Step 3: Update CallManager.ts**

Add `'call:dtmf'` to the `CallManagerEventType` union.

In `processNormalizedEvent()`, find the switch on `event.kind` and add:

```typescript
case 'call-dtmf':
  this.emitEvent({ type: 'call:dtmf', callId, call, data: { digit: event.digit, durationMs: event.durationMs } });
  break;
```

DTMF does NOT trigger a state transition.

- [ ] **Step 4: Write test**

Test that a DTMF event is processed without state change and emits `'call:dtmf'`.

- [ ] **Step 5: Run test, commit**

```bash
git commit -m "feat(voice): add NormalizedDtmfReceived event type and CallManager DTMF handling"
```

---

## Task 2: MediaStreamParser Interface

**Files:**

- Create: `packages/agentos/src/voice/MediaStreamParser.ts`
- Test: `packages/agentos/src/voice/__tests__/MediaStreamParser.spec.ts`

- [ ] **Step 1: Create MediaStreamParser.ts**

```typescript
/**
 * Interface for parsing provider-specific WebSocket media stream messages.
 * Each telephony provider (Twilio, Telnyx, Plivo) sends audio and control
 * messages in different JSON formats. Parsers normalize them to MediaStreamIncoming.
 */

export interface MediaStreamParser {
  parseIncoming(data: Buffer | string): MediaStreamIncoming | null;
  formatOutgoing(audio: Buffer, streamSid: string): Buffer | string;
  formatConnected?(streamSid: string): string | null;
}

export type MediaStreamIncoming =
  | { type: 'audio'; payload: Buffer; streamSid: string; sequenceNumber?: number }
  | { type: 'dtmf'; digit: string; streamSid: string; durationMs?: number } // durationMs from Twilio only
  | { type: 'start'; streamSid: string; callSid: string; metadata?: Record<string, unknown> }
  | { type: 'stop'; streamSid: string }
  | { type: 'mark'; name: string; streamSid: string };
```

- [ ] **Step 2: Write type-check test**

Verify types compile and discriminated union works.

- [ ] **Step 3: Commit**

```bash
git commit -m "feat(voice): add MediaStreamParser interface and types"
```

---

## Task 3: TwilioMediaStreamParser

**Files:**

- Create: `packages/agentos/src/voice/parsers/TwilioMediaStreamParser.ts`
- Test: `packages/agentos/src/voice/__tests__/TwilioMediaStreamParser.spec.ts`

- [ ] **Step 1: Write tests**

Test with real Twilio JSON samples:

- `{ "event": "start", "streamSid": "MZ123", "start": { "callSid": "CA456" } }` → `{ type: 'start', streamSid: 'MZ123', callSid: 'CA456' }`
- `{ "event": "media", "streamSid": "MZ123", "media": { "payload": "base64data", "track": "inbound" } }` → `{ type: 'audio', payload: Buffer, streamSid: 'MZ123' }`
- `{ "event": "dtmf", "streamSid": "MZ123", "dtmf": { "digit": "5", "duration": 500 } }` → `{ type: 'dtmf', digit: '5', streamSid: 'MZ123', durationMs: 500 }`
- `{ "event": "stop", "streamSid": "MZ123" }` → `{ type: 'stop', streamSid: 'MZ123' }`
- `{ "event": "mark", "streamSid": "MZ123", "mark": { "name": "done" } }` → `{ type: 'mark', name: 'done', streamSid: 'MZ123' }`
- `formatOutgoing(buffer, 'MZ123')` → JSON with base64 payload
- `formatConnected('MZ123')` → `{ "event": "connected", "protocol": "Call", "version": "1.0.0" }`
- Ignores `track: 'outbound'` media (only process inbound)
- Returns null for unknown events

- [ ] **Step 2: Implement TwilioMediaStreamParser**

~60 lines. Parse JSON, switch on `event` field, base64 decode audio payloads, base64 encode outgoing.

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(voice): add TwilioMediaStreamParser"
```

---

## Task 4: TelnyxMediaStreamParser

**Files:**

- Create: `packages/agentos/src/voice/parsers/TelnyxMediaStreamParser.ts`
- Test: `packages/agentos/src/voice/__tests__/TelnyxMediaStreamParser.spec.ts`

- [ ] **Step 1: Write tests**

- `{ "event": "start", "stream_id": "str123", "call_control_id": "cc456" }` → `{ type: 'start', streamSid: 'str123', callSid: 'cc456' }`
- `{ "event": "media", "stream_id": "str123", "media": { "track": "inbound", "chunk": "base64data" } }` → `{ type: 'audio', payload: Buffer, streamSid: 'str123' }`
- `{ "event": "stop", "stream_id": "str123" }` → `{ type: 'stop', streamSid: 'str123' }`
- `formatOutgoing(buffer, sid)` → raw binary Buffer (no JSON wrapper)
- No DTMF in media stream (Telnyx sends DTMF via webhook only)

- [ ] **Step 2: Implement**

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(voice): add TelnyxMediaStreamParser"
```

---

## Task 5: PlivoMediaStreamParser

**Files:**

- Create: `packages/agentos/src/voice/parsers/PlivoMediaStreamParser.ts`
- Test: `packages/agentos/src/voice/__tests__/PlivoMediaStreamParser.spec.ts`

- [ ] **Step 1: Write tests**

- `{ "event": "start", "stream_id": "s1", "call_uuid": "u1" }` → `{ type: 'start', streamSid: 's1', callSid: 'u1' }`
- `{ "event": "media", "stream_id": "s1", "media": { "payload": "base64data" } }` → `{ type: 'audio', payload: Buffer, streamSid: 's1' }`
- `{ "event": "stop", "stream_id": "s1" }` → `{ type: 'stop', streamSid: 's1' }`
- `formatOutgoing(buffer, sid)` → `{ "event": "playAudio", "media": { "payload": "base64" } }` JSON string

- [ ] **Step 2: Implement**

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(voice): add PlivoMediaStreamParser"
```

---

## Task 6: TwiML / XML Generation

**Files:**

- Create: `packages/agentos/src/voice/twiml.ts`
- Test: `packages/agentos/src/voice/__tests__/twiml.spec.ts`

- [ ] **Step 1: Write tests**

Test each function:

- `twilioConversationTwiml(url)` → `<Response><Connect><Stream url="..."/></Connect></Response>`
- `twilioConversationTwiml(url, token)` → includes `?token=...` in URL
- `twilioNotifyTwiml(text)` → `<Response><Say>text</Say><Hangup/></Response>`
- `twilioNotifyTwiml(text, 'alice')` → `<Say voice="alice">text</Say>`
- `telnyxStreamXml(url)` → Telnyx streaming XML
- `plivoStreamXml(url)` → Plivo `<Stream>` XML
- `plivoNotifyXml(text)` → `<Response><Speak>text</Speak><Hangup/></Response>`
- All escape XML special chars (`<>&"'`)

- [ ] **Step 2: Read telephony-audio.ts to verify escapeXml is exported**

Read `src/voice/telephony-audio.ts` and confirm `escapeXml()` is exported. If not, implement it inline in twiml.ts (simple `&<>"'` replacement).

- [ ] **Step 3: Implement**

Import `escapeXml` from `./telephony-audio.js`. Each function returns a string. ~80 lines total.

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(voice): add TwiML/XML generation helpers for Twilio, Telnyx, Plivo"
```

---

## Task 7: TelephonyStreamTransport

**Files:**

- Create: `packages/agentos/src/voice/TelephonyStreamTransport.ts`
- Test: `packages/agentos/src/voice/__tests__/TelephonyStreamTransport.spec.ts`

This is the most complex task — bridges phone audio to the streaming pipeline.

- [ ] **Step 1: Write tests**

Use a mock WebSocket and mock MediaStreamParser:

```typescript
function createMockParser(): MediaStreamParser {
  return {
    parseIncoming: vi.fn(),
    formatOutgoing: vi.fn((audio, sid) => JSON.stringify({ audio: audio.toString('base64'), sid })),
    formatConnected: vi.fn((sid) => JSON.stringify({ event: 'connected' })),
  };
}

function createMockWS() {
  const ws = new EventEmitter() as any;
  ws.send = vi.fn();
  ws.close = vi.fn();
  ws.readyState = 1;
  return ws;
}
```

Tests:

1. `readonly state` starts as 'connecting', becomes 'open' on 'start' message
2. Incoming audio: parser returns `{ type: 'audio', payload }` → transport converts mu-law to PCM Float32 → emits `'audio'` with AudioFrame
3. Incoming DTMF: parser returns `{ type: 'dtmf', digit: '5' }` → emits `'dtmf'`
4. Incoming stop: parser returns `{ type: 'stop' }` → emits `'close'`, state = 'closed'
5. `sendAudio(EncodedAudioChunk)`: converts PCM to mu-law 8kHz → calls parser.formatOutgoing → ws.send
6. `sendControl(msg)`: JSON.stringify → ws.send
7. `close()`: ws.close called
8. WS error → emits 'error'
9. Mu-law round trip: encode → decode should roughly match original (lossy, but within tolerance)

- [ ] **Step 2: Implement TelephonyStreamTransport**

Key details:

- Extends `EventEmitter`, implements `IStreamTransport`
- `readonly id = crypto.randomUUID()`
- Private `_state` with `readonly state` getter
- Private `streamSid: string | null = null`
- On WS message: call `parser.parseIncoming(data)`, switch on result type:
  - `'start'`: store streamSid, set state 'open', call `parser.formatConnected?.(streamSid)` and send if result
  - `'audio'`: `convertMulawToPcm16(payload)` → resample 8kHz to outputSampleRate → Float32Array → emit `'audio'`
  - `'dtmf'`: emit `'dtmf'`
  - `'stop'`: set state 'closed', emit `'close'`
  - `'mark'`: emit `'mark'`
- `sendAudio(chunk)`: decode EncodedAudioChunk audio buffer to Int16 PCM → resample to 8kHz → `convertPcmToMulaw8k()` → `parser.formatOutgoing()` → ws.send
- Resampling helper: linear interpolation between sample rates
- Import `convertPcmToMulaw8k`, `convertMulawToPcm16` from `./telephony-audio.js`

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(voice): add TelephonyStreamTransport bridging phone audio to streaming pipeline"
```

---

## Task 8: TwilioVoiceProvider

**Files:**

- Create: `packages/agentos/src/voice/providers/twilio.ts`
- Test: `packages/agentos/src/voice/__tests__/TwilioVoiceProvider.spec.ts`

- [ ] **Step 1: Write tests** (mock fetch)

Test:

- `initiateCall()`: correct URL, Basic auth header, form-encoded body with To/From/Url/StatusCallback
- Returns `{ providerCallId: callSid, success: true }` from response
- `hangupCall()`: correct URL with SID, Status=completed
- `playTts()`: correct URL, Twiml body with `<Say>`
- `verifyWebhook()`: HMAC-SHA1 verification succeeds with valid signature
- `verifyWebhook()`: fails with invalid signature
- `parseWebhookEvent()`: maps each CallStatus to correct `kind`
  - `ringing` → `call-ringing`
  - `in-progress` → `call-answered`
  - `completed` → `call-completed`
  - `failed` → `call-failed`
  - `busy` → `call-busy`
  - `no-answer` → `call-no-answer`
  - `canceled` → `call-hangup-user`
- DTMF: when `Digits` param present → `call-dtmf` event

- [ ] **Step 2: Implement**

~250 lines. Follow the existing `mock.ts` provider pattern. Use `fetchImpl ?? globalThis.fetch` for testability.

Webhook verification (Twilio algorithm: URL + sorted params concatenated as key+value, no separators):

```typescript
import { createHmac } from 'node:crypto';
// Twilio sorts params alphabetically by key, then concatenates key+value directly to URL
const params = Object.entries(JSON.parse(ctx.body) ?? {}).sort(([a], [b]) => a.localeCompare(b));
let data = ctx.url;
for (const [key, value] of params) {
  data += key + value; // No '=' or '&' — direct concatenation per Twilio spec
}
const expected = createHmac('sha1', authToken).update(data).digest('base64');
return { valid: expected === ctx.headers['x-twilio-signature'] };
```

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(voice): add TwilioVoiceProvider with REST API and webhook verification"
```

---

## Task 9: TelnyxVoiceProvider

**Files:**

- Create: `packages/agentos/src/voice/providers/telnyx.ts`
- Test: `packages/agentos/src/voice/__tests__/TelnyxVoiceProvider.spec.ts`

- [ ] **Step 1: Write tests** (mock fetch)

Test:

- `initiateCall()`: correct URL, Bearer auth, JSON body with connection_id/to/from/webhook_url (NO stream_url)
- `hangupCall()`: correct URL with callControlId
- `playTts()`: POST to /actions/speak with payload/voice/language
- `verifyWebhook()`: Ed25519 verification (mock crypto.verify)
- `parseWebhookEvent()`: maps Telnyx event_type to correct kind
  - `call.initiated` → `call-ringing`
  - `call.answered` → `call-answered`
  - `call.hangup` → `call-completed` or `call-hangup-user` based on hangup_cause
  - `call.dtmf.received` → `call-dtmf` with digit
  - `call.machine.detection.ended` with `result === 'machine'` → `call-voicemail`
- Telnyx-specific: `startStreaming()` private helper called after `call.answered`

- [ ] **Step 2: Implement**

~250 lines. Ed25519 verification:

```typescript
import { verify } from 'node:crypto';
const timestamp = ctx.headers['x-telnyx-timestamp'];
const signature = Buffer.from(ctx.headers['x-telnyx-signature-ed25519'], 'base64');
const payload = Buffer.from(`${timestamp}|${ctx.rawBody}`);
const publicKeyBuffer = Buffer.from(publicKey, 'base64');
return {
  valid: verify(null, payload, { key: publicKeyBuffer, format: 'der', type: 'spki' }, signature),
};
```

NOTE: `initiateCall()` does NOT include `stream_url`. The provider stores `mediaStreamUrl` from `InitiateCallInput` and calls `streaming_start` when it receives `call.answered` webhook via an internal `startStreaming(callControlId)` helper.

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(voice): add TelnyxVoiceProvider with REST API and Ed25519 webhook verification"
```

---

## Task 10: PlivoVoiceProvider

**Files:**

- Create: `packages/agentos/src/voice/providers/plivo.ts`
- Test: `packages/agentos/src/voice/__tests__/PlivoVoiceProvider.spec.ts`

- [ ] **Step 1: Write tests** (mock fetch)

Test:

- `initiateCall()`: correct URL with authId, Basic auth, JSON body with from/to/answer_url
- `hangupCall()`: DELETE to correct URL with callUuid
- `playTts()`: POST to /Speak/ with text/voice/language
- `verifyWebhook()`: HMAC-SHA256 verification
- `parseWebhookEvent()`: maps Plivo CallStatus to correct kind
- DTMF: when `Digits` param present → `call-dtmf` event

- [ ] **Step 2: Implement**

~200 lines. Webhook verification:

```typescript
import { createHmac } from 'node:crypto';
const nonce = ctx.headers['x-plivo-signature-v3-nonce'];
const data = ctx.url + nonce;
const expected = createHmac('sha256', authToken).update(data).digest('base64');
return { valid: expected === ctx.headers['x-plivo-signature-v3'] };
```

- [ ] **Step 3: Run tests, commit**

```bash
git commit -m "feat(voice): add PlivoVoiceProvider with REST API and HMAC-SHA256 webhook verification"
```

---

## Task 11: Barrel Export Update

**Files:**

- Modify: `packages/agentos/src/voice/index.ts`

- [ ] **Step 1: Add exports for all new components**

```typescript
// Media stream parsers
export type { MediaStreamParser, MediaStreamIncoming } from './MediaStreamParser.js';
export { TwilioMediaStreamParser } from './parsers/TwilioMediaStreamParser.js';
export { TelnyxMediaStreamParser } from './parsers/TelnyxMediaStreamParser.js';
export { PlivoMediaStreamParser } from './parsers/PlivoMediaStreamParser.js';

// Telephony stream transport
export { TelephonyStreamTransport } from './TelephonyStreamTransport.js';

// Providers
export { TwilioVoiceProvider } from './providers/twilio.js';
export { TelnyxVoiceProvider } from './providers/telnyx.js';
export { PlivoVoiceProvider } from './providers/plivo.js';

// TwiML/XML helpers
export {
  twilioConversationTwiml,
  twilioNotifyTwiml,
  telnyxStreamXml,
  plivoStreamXml,
  plivoNotifyXml,
} from './twiml.js';
```

- [ ] **Step 2: Run all voice tests to verify nothing broke**

`./node_modules/.bin/vitest run src/voice/__tests__/`

- [ ] **Step 3: Commit**

```bash
git commit -m "feat(voice): export all telephony providers, parsers, and transport"
```

---

## Task 12: Wunderland Telephony Webhook Server

**Files:**

- Create: `packages/wunderland/src/voice/telephony-webhook-server.ts`
- Modify: `packages/wunderland/src/voice/index.ts`

- [ ] **Step 1: Read existing Wunderland voice files**

Read `packages/wunderland/src/voice/index.ts` and `packages/wunderland/src/voice/ws-server.ts` (from Sub-project B) to understand the pattern.

- [ ] **Step 2: Create telephony-webhook-server.ts**

```typescript
import { createServer } from 'node:http';
import type { IncomingMessage, ServerResponse } from 'node:http';

export interface TelephonyWebhookServerOptions {
  port?: number;
  host?: string;
  basePath?: string;
}

export async function startTelephonyWebhookServer(
  callManager: any, // CallManager from @framers/agentos/voice
  providers: Map<string, any>, // Map<providerName, IVoiceCallProvider>
  pipeline: any, // VoicePipelineOrchestrator from @framers/agentos/voice-pipeline (Sub-project B)
  options?: TelephonyWebhookServerOptions
): Promise<{ port: number; url: string; close: () => Promise<void> }> {
  const basePath = options?.basePath ?? '/api/voice';
  const host = options?.host ?? '127.0.0.1';
  const port = options?.port ?? 0;

  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

    // Route: POST /api/voice/webhook/:provider
    // Route: POST /api/voice/status/:provider
    const webhookMatch = url.pathname.match(new RegExp(`^${basePath}/webhook/(.+)$`));
    const statusMatch = url.pathname.match(new RegExp(`^${basePath}/status/(.+)$`));

    const providerName = webhookMatch?.[1] ?? statusMatch?.[1];
    if (!providerName || req.method !== 'POST') {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const provider = providers.get(providerName);
    if (!provider) {
      res.writeHead(404);
      res.end(`Unknown provider: ${providerName}`);
      return;
    }

    // Read body
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const rawBody = Buffer.concat(chunks).toString();

    // Build WebhookContext
    const ctx = {
      url: `${url.origin}${url.pathname}`,
      headers: req.headers as Record<string, string>,
      body: rawBody,
      rawBody,
      method: req.method,
    };

    // Verify + parse
    const verification = provider.verifyWebhook(ctx);
    if (!verification.valid) {
      res.writeHead(403);
      res.end('Invalid signature');
      return;
    }

    const parseResult = provider.parseWebhookEvent(ctx);
    if (parseResult.events) {
      for (const event of parseResult.events) {
        callManager.processNormalizedEvent?.(event);
      }
    }

    // Return XML response if needed
    res.writeHead(200, { 'Content-Type': parseResult.responseContentType ?? 'text/xml' });
    res.end(parseResult.responseBody ?? '');
  });

  await new Promise<void>((resolve) => server.listen(port, host, resolve));
  const addr = server.address() as any;
  const actualPort = addr?.port ?? port;

  return {
    port: actualPort,
    url: `http://${host}:${actualPort}${basePath}`,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}
```

- [ ] **Step 3: Update barrel export**

Add to `packages/wunderland/src/voice/index.ts`:

```typescript
export { startTelephonyWebhookServer } from './telephony-webhook-server.js';
export type { TelephonyWebhookServerOptions } from './telephony-webhook-server.js';
```

- [ ] **Step 4: Add CLI flags to chat.ts and completions.ts**

Read `packages/wunderland/src/cli/commands/chat.ts` to find where voice flags are parsed. Add:

```typescript
const voiceProvider = extractFlagValue(argv, '--voice-provider');
const voicePhoneFrom = extractFlagValue(argv, '--voice-phone-from');
const voicePhoneTo = extractFlagValue(argv, '--voice-phone-to');
const voiceCallMode = extractFlagValue(argv, '--voice-call-mode');
const voiceInboundPolicy = extractFlagValue(argv, '--voice-inbound-policy');
const voiceWebhookPort = extractFlagValue(argv, '--voice-webhook-port');
```

Add flags to `completions.ts` `GLOBAL_FLAGS` array.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(wunderland): add telephony webhook server and CLI flags"
```

---

## Task 13: Integration Test

**Files:**

- Create: `packages/agentos/src/voice/__tests__/telephony-integration.spec.ts`

- [ ] **Step 1: Write integration test**

Full flow test with mocks:

1. Create TwilioMediaStreamParser
2. Create mock WebSocket
3. Create TelephonyStreamTransport with parser + mock WS
4. Verify: send Twilio 'start' message → state becomes 'open'
5. Send Twilio 'media' message with base64 mu-law → transport emits 'audio' with AudioFrame
6. Send Twilio 'dtmf' message → transport emits 'dtmf'
7. Call transport.sendAudio() with EncodedAudioChunk → parser.formatOutgoing called → ws.send called
8. Send Twilio 'stop' message → transport emits 'close', state 'closed'

Also test:

- CallManager + TwilioVoiceProvider: create call record, process webhook events, verify state transitions
- TwiML generation round-trip: generate XML, verify it's valid XML

- [ ] **Step 2: Run test, commit**

```bash
git commit -m "test(voice): add telephony integration test with full Twilio media stream flow"
```

---

## Task 14: Documentation

**Files:**

- Create: `packages/agentos/docs/TELEPHONY_PROVIDERS.md`

- [ ] **Step 1: Write telephony provider docs**

Cover:

- Overview of the telephony system
- Provider setup for each (Twilio, Telnyx, Plivo): env vars, account setup
- Call modes: conversation vs notify
- Webhook configuration guide
- DTMF handling: how digits reach the LLM
- Media stream flow: phone → mu-law → PCM → pipeline
- agent.config.json telephony section
- CLI flags reference

- [ ] **Step 2: Commit**

```bash
git commit -m "docs: add telephony provider setup and configuration guide"
```
