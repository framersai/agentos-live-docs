# Interface: NoiseProfile

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:18](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/EnvironmentalCalibrator.ts#L18)

Represents the acoustic profile of the environment.
This profile is used by other audio components (like VAD) to adjust their sensitivity.

## Properties

### baselineRMS

> **baselineRMS**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:20](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/EnvironmentalCalibrator.ts#L20)

Root Mean Square of the baseline ambient noise, calculated using a percentile.

***

### confidenceScore

> **confidenceScore**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:33](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/EnvironmentalCalibrator.ts#L33)

Confidence in the profile (0-1), based on data quantity and stability.

***

### environmentType

> **environmentType**: `"normal"` \| `"quiet"` \| `"noisy"` \| `"very_noisy"`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:31](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/EnvironmentalCalibrator.ts#L31)

Classified type of the acoustic environment.

***

### framesAnalyzedCount

> **framesAnalyzedCount**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:41](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/EnvironmentalCalibrator.ts#L41)

Number of audio frames/buffers analyzed to generate or update this profile.

***

### frequencyProfile?

> `optional` **frequencyProfile**: `Float32Array`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:29](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/EnvironmentalCalibrator.ts#L29)

Optional frequency spectrum analysis (e.g., 32 bands).
Populated if `enableFrequencyAnalysis` is true.

***

### noiseStdDev

> **noiseStdDev**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:24](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/EnvironmentalCalibrator.ts#L24)

Standard deviation of RMS values, indicating noise floor stability.

***

### peakRMS

> **peakRMS**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:22](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/EnvironmentalCalibrator.ts#L22)

Peak Root Mean Square detected during an observation window.

***

### suggestedSilenceThreshold

> **suggestedSilenceThreshold**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:39](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/EnvironmentalCalibrator.ts#L39)

Suggested silence detection threshold (RMS value) based on this profile.

***

### suggestedSpeechThreshold

> **suggestedSpeechThreshold**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:37](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/EnvironmentalCalibrator.ts#L37)

Suggested speech detection threshold (RMS value) based on this profile.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:35](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/EnvironmentalCalibrator.ts#L35)

Timestamp (Unix epoch ms) of when this profile was last calculated.
