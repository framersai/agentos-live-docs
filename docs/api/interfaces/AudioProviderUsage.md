# Interface: AudioProviderUsage

Defined in: [packages/agentos/src/media/audio/types.ts:50](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/audio/types.ts#L50)

Aggregated usage / billing counters for an audio generation session.

Providers that report cost or timing information populate the optional
fields; the minimum required field is [totalAudioClips](#totalaudioclips).

## Properties

### processingTimeMs?

> `optional` **processingTimeMs**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:58](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/audio/types.ts#L58)

Total processing time in milliseconds.

***

### totalAudioClips

> **totalAudioClips**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:52](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/audio/types.ts#L52)

Number of audio clips generated in this session.

***

### totalCostUSD?

> `optional` **totalCostUSD**: `number`

Defined in: [packages/agentos/src/media/audio/types.ts:55](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/audio/types.ts#L55)

Total cost in USD, if the provider reports it.
