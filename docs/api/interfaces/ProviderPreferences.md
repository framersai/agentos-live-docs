# Interface: ProviderPreferences

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:85](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/ProviderPreferences.ts#L85)

Top-level provider preferences grouped by media modality.

Each modality can have its own independent preference configuration.
Audio is further split into `music` and `sfx` sub-modalities since
music generation and sound-effect generation often use different
provider backends.

## Properties

### audio?

> `optional` **audio**: `object`

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:91](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/ProviderPreferences.ts#L91)

Audio generation provider preferences, split by sub-modality.

#### music?

> `optional` **music**: [`MediaProviderPreference`](MediaProviderPreference.md)

Music generation provider preferences.

#### sfx?

> `optional` **sfx**: [`MediaProviderPreference`](MediaProviderPreference.md)

Sound-effect generation provider preferences.

***

### image?

> `optional` **image**: [`MediaProviderPreference`](MediaProviderPreference.md)

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:87](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/ProviderPreferences.ts#L87)

Image generation provider preferences.

***

### video?

> `optional` **video**: [`MediaProviderPreference`](MediaProviderPreference.md)

Defined in: [packages/agentos/src/media/ProviderPreferences.ts:89](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/media/ProviderPreferences.ts#L89)

Video generation provider preferences.
