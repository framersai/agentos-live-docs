# Function: plivoNotifyXml()

> **plivoNotifyXml**(`text`, `voice?`): `string`

Defined in: [packages/agentos/src/channels/telephony/twiml.ts:155](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/telephony/twiml.ts#L155)

Generate Plivo speak + hangup XML.

Synthesises `text` to the caller using Plivo's TTS engine and immediately
hangs up after playback completes. Equivalent to Twilio's `<Say>...<Hangup/>`
but uses Plivo's `<Speak>` element name.

## Parameters

### text

`string`

The message to speak to the caller. XML-escaped automatically.

### voice?

`string`

Optional Plivo voice name (e.g. `'WOMAN'`, `'Polly.Joanna'`).

## Returns

`string`

A complete Plivo XML document string.

## Example

```typescript
plivoNotifyXml('Your order has shipped.');
// => '<?xml version="1.0" encoding="UTF-8"?>\n<Response><Speak>Your order has shipped.</Speak><Hangup/></Response>'

plivoNotifyXml('Hello', 'WOMAN');
// => '...><Speak voice="WOMAN">Hello</Speak><Hangup/></Response>'
```
