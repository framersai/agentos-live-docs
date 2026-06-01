# Type Alias: ChannelCapability

> **ChannelCapability** = `"text"` \| `"rich_text"` \| `"images"` \| `"video"` \| `"audio"` \| `"voice_notes"` \| `"documents"` \| `"stickers"` \| `"reactions"` \| `"threads"` \| `"typing_indicator"` \| `"read_receipts"` \| `"group_chat"` \| `"channels"` \| `"buttons"` \| `"inline_keyboard"` \| `"embeds"` \| `"mentions"` \| `"editing"` \| `"deletion"` \| `"stories"` \| `"reels"` \| `"hashtags"` \| `"polls"` \| `"carousel"` \| `"engagement_metrics"` \| `"scheduling"` \| `"dm_automation"` \| `"content_discovery"` \| `string` & `object`

Defined in: [packages/agentos/src/io/channels/types.ts:72](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/types.ts#L72)

Capabilities that a channel adapter can declare. Consumers can check
capabilities before attempting actions that not all platforms support.
