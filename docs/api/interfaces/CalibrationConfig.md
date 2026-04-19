# Interface: CalibrationConfig

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:47](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L47)

Configuration for environmental calibration using Web Audio APIs.

## Properties

### backoffMultiplier?

> `optional` **backoffMultiplier**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:75](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L75)

Multiplier for the exponential backoff strategy during continuous adaptation.

#### Default

```ts
1.5
```

***

### calibrationBufferSize?

> `optional` **calibrationBufferSize**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:58](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L58)

Buffer size for the ScriptProcessorNode used during initial calibration.
Affects how often audio data is analyzed during calibration.

#### Default

```ts
4096
```

***

### enableFrequencyAnalysis?

> `optional` **enableFrequencyAnalysis**: `boolean`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:100](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L100)

Enable frequency analysis using AnalyserNode during initial calibration.

#### Default

```ts
true
```

***

### fftSize?

> `optional` **fftSize**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:106](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L106)

FFT size for the AnalyserNode. Must be a power of 2.
`frequencyBinCount` will be `fftSize / 2`.

#### Default

```ts
256 (yields 128 frequency bins)
```

***

### initialCalibrationMs?

> `optional` **initialCalibrationMs**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:52](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L52)

Duration in milliseconds for the initial calibration phase via MediaStream.

#### Default

```ts
3000
```

***

### initialUpdateIntervalMs?

> `optional` **initialUpdateIntervalMs**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:70](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L70)

Initial interval in milliseconds for continuous adaptation checks if no voice activity.
This applies when `processAudioFrame` is used for continuous updates.

#### Default

```ts
1000
```

***

### maxBackoffIntervalMs?

> `optional` **maxBackoffIntervalMs**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:80](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L80)

Maximum interval in milliseconds for continuous adaptation checks.

#### Default

```ts
30000
```

***

### minBackoffIntervalMs?

> `optional` **minBackoffIntervalMs**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:85](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L85)

Minimum interval in milliseconds for continuous adaptation checks after activity or change.

#### Default

```ts
500
```

***

### minRmsSamplesForContinuousUpdate?

> `optional` **minRmsSamplesForContinuousUpdate**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:64](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L64)

Minimum number of RMS samples (from processed frames) required for a meaningful profile update
during continuous adaptation (when `processAudioFrame` is called).

#### Default

```ts
50
```

***

### rmsHistoryBufferSize?

> `optional` **rmsHistoryBufferSize**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:90](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L90)

Number of recent RMS values (from processed frames) to store in a buffer for continuous adaptation.

#### Default

```ts
50
```

***

### sampleRate?

> `optional` **sampleRate**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:112](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L112)

Sample rate of the audio. The calibrator will try to use this for its internal AudioContext.
If the input MediaStream has a different rate, resampling might occur or the stream's rate is used.

#### Default

```ts
16000
```

***

### thresholdSensitivityFactor?

> `optional` **thresholdSensitivityFactor**: `number`

Defined in: [packages/agentos/src/hearing/EnvironmentalCalibrator.ts:95](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/EnvironmentalCalibrator.ts#L95)

Sensitivity adjustment factor for calculating speech/silence thresholds.

#### Default

```ts
1.0
```
