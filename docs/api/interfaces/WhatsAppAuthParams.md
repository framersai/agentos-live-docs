# Interface: WhatsAppAuthParams

Defined in: [packages/agentos/src/channels/adapters/WhatsAppChannelAdapter.ts:65](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/WhatsAppChannelAdapter.ts#L65)

Platform-specific parameters for WhatsApp connections.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### accountSid?

> `optional` **accountSid**: `string`

Defined in: [packages/agentos/src/channels/adapters/WhatsAppChannelAdapter.ts:71](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/WhatsAppChannelAdapter.ts#L71)

Twilio Account SID.

***

### apiVersion?

> `optional` **apiVersion**: `string`

Defined in: [packages/agentos/src/channels/adapters/WhatsAppChannelAdapter.ts:83](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/WhatsAppChannelAdapter.ts#L83)

Graph API version (default: 'v21.0').

***

### authToken?

> `optional` **authToken**: `string`

Defined in: [packages/agentos/src/channels/adapters/WhatsAppChannelAdapter.ts:73](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/WhatsAppChannelAdapter.ts#L73)

Twilio Auth Token. If provided, overrides credential.

***

### businessApiToken?

> `optional` **businessApiToken**: `string`

Defined in: [packages/agentos/src/channels/adapters/WhatsAppChannelAdapter.ts:79](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/WhatsAppChannelAdapter.ts#L79)

WhatsApp Business API access token. If provided, overrides credential.

***

### phoneNumber?

> `optional` **phoneNumber**: `string`

Defined in: [packages/agentos/src/channels/adapters/WhatsAppChannelAdapter.ts:75](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/WhatsAppChannelAdapter.ts#L75)

Twilio WhatsApp-enabled phone number (e.g., 'whatsapp:+14155238886').

***

### phoneNumberId?

> `optional` **phoneNumberId**: `string`

Defined in: [packages/agentos/src/channels/adapters/WhatsAppChannelAdapter.ts:81](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/WhatsAppChannelAdapter.ts#L81)

Phone Number ID from the WhatsApp Business Platform.

***

### provider?

> `optional` **provider**: `string`

Defined in: [packages/agentos/src/channels/adapters/WhatsAppChannelAdapter.ts:67](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/WhatsAppChannelAdapter.ts#L67)

Provider backend: 'twilio' or 'cloud-api'. Defaults to 'twilio'.

***

### verifyToken?

> `optional` **verifyToken**: `string`

Defined in: [packages/agentos/src/channels/adapters/WhatsAppChannelAdapter.ts:85](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/WhatsAppChannelAdapter.ts#L85)

Verify token for webhook validation.
