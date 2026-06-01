# Type Alias: VideoResolution

> **VideoResolution** = `"480p"` \| `"720p"` \| `"1080p"`

Defined in: [packages/agentos/src/io/media/video/types.ts:239](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/media/video/types.ts#L239)

Output resolution for generated or analyzed video.

Higher resolutions increase generation time and cost but produce
sharper output. Not all providers support all resolutions — the
adapter will fall back to the closest supported resolution.
