# Type Alias: ChannelPlatform

> **ChannelPlatform** = `"telegram"` \| `"whatsapp"` \| `"discord"` \| `"slack"` \| `"webchat"` \| `"signal"` \| `"imessage"` \| `"google-chat"` \| `"teams"` \| `"matrix"` \| `"zalo"` \| `"email"` \| `"sms"` \| `"nostr"` \| `"twitch"` \| `"line"` \| `"feishu"` \| `"mattermost"` \| `"nextcloud-talk"` \| `"tlon"` \| `"irc"` \| `"zalouser"` \| `"twitter"` \| `"instagram"` \| `"reddit"` \| `"pinterest"` \| `"tiktok"` \| `"youtube"` \| `"linkedin"` \| `"facebook"` \| `"threads"` \| `"bluesky"` \| `"mastodon"` \| `"devto"` \| `"hashnode"` \| `"medium"` \| `"wordpress"` \| `"farcaster"` \| `"lemmy"` \| `"google-business"` \| `string` & `object`

Defined in: [packages/agentos/src/channels/types.ts:21](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/types.ts#L21)

Supported messaging platforms. Extensible via string literal union —
concrete adapters can use any string, but well-known platforms get
first-class type support.
