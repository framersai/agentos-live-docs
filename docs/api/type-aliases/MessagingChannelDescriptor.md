# Type Alias: MessagingChannelDescriptor

> **MessagingChannelDescriptor** = [`ExtensionDescriptor`](../interfaces/ExtensionDescriptor.md)\<[`MessagingChannelPayload`](../interfaces/MessagingChannelPayload.md)\> & `object`

Defined in: [packages/agentos/src/extensions/types.ts:225](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/extensions/types.ts#L225)

Messaging channel extension descriptor — wraps an IChannelAdapter for
external human-facing messaging platforms (Telegram, WhatsApp, Discord, etc.).

## Type Declaration

### kind

> **kind**: *typeof* [`EXTENSION_KIND_MESSAGING_CHANNEL`](../variables/EXTENSION_KIND_MESSAGING_CHANNEL.md)
