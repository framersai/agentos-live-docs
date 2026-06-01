# Function: plivoStreamXml()

> **plivoStreamXml**(`streamUrl`): `string`

Defined in: [packages/agentos/src/io/channels/telephony/twiml.ts:131](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/twiml.ts#L131)

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
