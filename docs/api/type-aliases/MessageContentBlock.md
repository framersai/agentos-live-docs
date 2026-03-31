# Type Alias: MessageContentBlock

> **MessageContentBlock** = \{ `text`: `string`; `type`: `"text"`; \} \| \{ `caption?`: `string`; `mimeType?`: `string`; `type`: `"image"`; `url`: `string`; \} \| \{ `caption?`: `string`; `mimeType?`: `string`; `type`: `"video"`; `url`: `string`; \} \| \{ `duration?`: `number`; `mimeType?`: `string`; `type`: `"audio"`; `url`: `string`; \} \| \{ `filename`: `string`; `mimeType?`: `string`; `type`: `"document"`; `url`: `string`; \} \| \{ `stickerId`: `string`; `type`: `"sticker"`; `url?`: `string`; \} \| \{ `latitude`: `number`; `longitude`: `number`; `name?`: `string`; `type`: `"location"`; \} \| \{ `buttons`: [`MessageButton`](../interfaces/MessageButton.md)[]; `type`: `"button_group"`; \} \| \{ `color?`: `string`; `description?`: `string`; `fields?`: `object`[]; `title`: `string`; `type`: `"embed"`; `url?`: `string`; \} \| \{ `durationHours?`: `number`; `options`: `string`[]; `question`: `string`; `type`: `"poll"`; \} \| \{ `caption?`: `string`; `mediaUrl`: `string`; `stickers?`: `string`[]; `type`: `"story"`; \} \| \{ `audio?`: `string`; `caption?`: `string`; `hashtags?`: `string`[]; `type`: `"reel"`; `videoUrl`: `string`; \} \| \{ `items`: `object`[]; `type`: `"carousel"`; \}

Defined in: [packages/agentos/src/channels/types.ts:152](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/types.ts#L152)

Content block within a message. A single message can contain multiple
content blocks (e.g., text + image attachment).
