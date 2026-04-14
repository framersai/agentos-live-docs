# Type Alias: VideoResolution

> **VideoResolution** = `"480p"` \| `"720p"` \| `"1080p"`

Defined in: [packages/agentos/src/media/video/types.ts:239](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/video/types.ts#L239)

Output resolution for generated or analyzed video.

Higher resolutions increase generation time and cost but produce
sharper output. Not all providers support all resolutions — the
adapter will fall back to the closest supported resolution.
