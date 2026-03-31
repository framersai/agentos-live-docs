# Function: twilioConversationTwiml()

> **twilioConversationTwiml**(`streamUrl`, `token?`): `string`

Defined in: [packages/agentos/src/channels/telephony/twiml.ts:58](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/telephony/twiml.ts#L58)

Generate TwiML for Twilio conversation mode using a bidirectional media stream.

The returned markup instructs Twilio to open a WebSocket to `streamUrl` and
stream audio in both directions for the duration of the call. Twilio will
send mu-law 8 kHz audio chunks as JSON `media` events on the WebSocket.

## Parameters

### streamUrl

`string`

WebSocket URL Twilio should connect to (e.g. `wss://api.example.com/stream`).

### token?

`string`

Optional bearer token appended as a `?token=` query parameter
  for authenticating the WebSocket connection.

## Returns

`string`

A complete TwiML XML document string.

## Example

```typescript
// Without auth token:
twilioConversationTwiml('wss://api.example.com/call');
// => '<?xml version="1.0" encoding="UTF-8"?>\n<Response><Connect><Stream url="wss://api.example.com/call" /></Connect></Response>'

// With auth token:
twilioConversationTwiml('wss://api.example.com/call', 'jwt-token-here');
// => '<?xml version="1.0" ...><Response><Connect><Stream url="wss://api.example.com/call?token=jwt-token-here" /></Connect></Response>'
```
