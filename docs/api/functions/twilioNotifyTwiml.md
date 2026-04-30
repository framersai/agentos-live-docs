# Function: twilioNotifyTwiml()

> **twilioNotifyTwiml**(`text`, `voice?`): `string`

Defined in: [packages/agentos/src/channels/telephony/twiml.ts:82](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/telephony/twiml.ts#L82)

Generate TwiML for Twilio notify mode -- synthesise `text` over the call then hang up.

Useful for delivering one-shot announcements (e.g. voicemail greetings, error
messages, appointment reminders) without establishing a full media stream.

## Parameters

### text

`string`

The message to speak to the caller. XML-escaped automatically.

### voice?

`string`

Optional Twilio voice name (e.g. `'Polly.Joanna'`, `'alice'`).

## Returns

`string`

A complete TwiML XML document string.

## Example

```typescript
twilioNotifyTwiml('Your appointment is confirmed.');
// => '<?xml version="1.0" encoding="UTF-8"?>\n<Response><Say>Your appointment is confirmed.</Say><Hangup/></Response>'

twilioNotifyTwiml('Hello', 'Polly.Joanna');
// => '...><Say voice="Polly.Joanna">Hello</Say><Hangup/></Response>'
```
