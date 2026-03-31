# Function: plivoStreamXml()

> **plivoStreamXml**(`streamUrl`): `string`

Defined in: [packages/agentos/src/channels/telephony/twiml.ts:131](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/twiml.ts#L131)

Generate Plivo bidirectional streaming XML.

Instructs Plivo to open a bidirectional WebSocket stream and keep the call
alive for the duration of the stream session. The stream URL is placed as
element text content (not an attribute) per the Plivo XML spec.

## Parameters

### streamUrl

`string`

WebSocket URL Plivo should connect to.

## Returns

`string`

A complete Plivo XML document string.

## Example

```typescript
plivoStreamXml('wss://api.example.com/plivo-stream');
// => '<?xml version="1.0" encoding="UTF-8"?>\n<Response><Stream bidirectional="true" keepCallAlive="true">wss://api.example.com/plivo-stream</Stream></Response>'
```
