# Function: telnyxStreamXml()

> **telnyxStreamXml**(`streamUrl`): `string`

Defined in: [packages/agentos/src/channels/telephony/twiml.ts:107](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/twiml.ts#L107)

Generate a Telnyx streaming XML response.

Telnyx primarily uses a REST API for call control, but this helper produces
an XML acknowledgment document wrapping the stream URL for webhook responses
that require XML.

## Parameters

### streamUrl

`string`

WebSocket URL Telnyx should stream audio to.

## Returns

`string`

A complete XML document string.

## Example

```typescript
telnyxStreamXml('wss://api.example.com/telnyx-stream');
// => '<?xml version="1.0" encoding="UTF-8"?>\n<Response><Stream url="wss://api.example.com/telnyx-stream" /></Response>'
```
