# Type Alias: MessagingChannelDescriptor

> **MessagingChannelDescriptor** = [`ExtensionDescriptor`](../interfaces/ExtensionDescriptor.md)\<[`MessagingChannelPayload`](../interfaces/MessagingChannelPayload.md)\> & `object`

Defined in: [packages/agentos/src/extensions/types.ts:225](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/extensions/types.ts#L225)

Messaging channel extension descriptor — wraps an IChannelAdapter for
external human-facing messaging platforms (Telegram, WhatsApp, Discord, etc.).

## Type Declaration

### kind

> **kind**: *typeof* [`EXTENSION_KIND_MESSAGING_CHANNEL`](../variables/EXTENSION_KIND_MESSAGING_CHANNEL.md)
