# Type Alias: MessagingChannelDescriptor

> **MessagingChannelDescriptor** = [`ExtensionDescriptor`](../interfaces/ExtensionDescriptor.md)\<[`MessagingChannelPayload`](../interfaces/MessagingChannelPayload.md)\> & `object`

Defined in: [packages/agentos/src/extensions/types.ts:225](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L225)

Messaging channel extension descriptor — wraps an IChannelAdapter for
external human-facing messaging platforms (Telegram, WhatsApp, Discord, etc.).

## Type Declaration

### kind

> **kind**: *typeof* [`EXTENSION_KIND_MESSAGING_CHANNEL`](../variables/EXTENSION_KIND_MESSAGING_CHANNEL.md)
