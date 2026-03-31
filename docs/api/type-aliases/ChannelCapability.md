# Type Alias: ChannelCapability

> **ChannelCapability** = `"text"` \| `"rich_text"` \| `"images"` \| `"video"` \| `"audio"` \| `"voice_notes"` \| `"documents"` \| `"stickers"` \| `"reactions"` \| `"threads"` \| `"typing_indicator"` \| `"read_receipts"` \| `"group_chat"` \| `"channels"` \| `"buttons"` \| `"inline_keyboard"` \| `"embeds"` \| `"mentions"` \| `"editing"` \| `"deletion"` \| `"stories"` \| `"reels"` \| `"hashtags"` \| `"polls"` \| `"carousel"` \| `"engagement_metrics"` \| `"scheduling"` \| `"dm_automation"` \| `"content_discovery"` \| `string` & `object`

Defined in: [packages/agentos/src/channels/types.ts:72](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L72)

Capabilities that a channel adapter can declare. Consumers can check
capabilities before attempting actions that not all platforms support.
