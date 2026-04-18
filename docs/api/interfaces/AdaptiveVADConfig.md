# Interface: AdaptiveVADConfig

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/hearing/AdaptiveVAD.ts#L49)

Configuration options for the AdaptiveVAD.

## Properties

### energySmoothingFrames?

> `optional` **energySmoothingFrames**: `number`

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:74](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/hearing/AdaptiveVAD.ts#L74)

Number of past frames to consider for smoothing energy calculations (if smoothing is applied).

#### Default

```ts
5
```

***

### maxSilenceDurationMsInSpeech?

> `optional` **maxSilenceDurationMsInSpeech**: `number`

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:61](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/hearing/AdaptiveVAD.ts#L61)

Maximum duration of silence in milliseconds within a speech segment before it's considered ended.
e.g., a pause between words.

#### Default

```ts
500
```

***

### minSpeechDurationMs?

> `optional` **minSpeechDurationMs**: `number`

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:55](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/hearing/AdaptiveVAD.ts#L55)

Minimum duration in milliseconds that a sound segment must have to be considered speech.
Helps filter out very short, non-speech noises.

#### Default

```ts
150
```

***

### thresholdRatio?

> `optional` **thresholdRatio**: `number`

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:81](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/hearing/AdaptiveVAD.ts#L81)

Ratio of speech_threshold / silence_threshold.
Helps in creating a hysteresis effect.
speech_threshold = silence_threshold * thresholdRatio

#### Default

```ts
1.5
```

***

### vadSensitivityFactor?

> `optional` **vadSensitivityFactor**: `number`

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:69](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/hearing/AdaptiveVAD.ts#L69)

Sensitivity adjustment factor, further fine-tunes thresholds from EnvironmentalCalibrator.
Values > 1.0 make VAD less sensitive (require louder input for speech).
Values < 1.0 make VAD more sensitive.
This is applied ON TOP of the sensitivity factor in EnvironmentalCalibrator.

#### Default

```ts
1.0
```
