# Class: BuiltInAdaptiveVadProvider

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:92](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L92)

Built-in voice activity detection (VAD) provider backed by the
`AdaptiveVAD` engine and `EnvironmentalCalibrator`.

This is the default VAD provider in AgentOS and requires no external
dependencies or API keys. It operates entirely locally on raw audio frames.

## How It Works

1. The `EnvironmentalCalibrator` continuously estimates the ambient
   noise floor and spectral profile from incoming audio frames.
2. The `AdaptiveVAD` uses the calibrator's noise profile to set
   dynamic thresholds for speech detection — louder environments get
   higher thresholds to avoid false positives.
3. Each `processFrame()` call returns a [SpeechVadDecision](../interfaces/SpeechVadDecision.md) with
   `isSpeech`, `confidence`, the raw VAD result, and the current noise profile.

## Configuration Defaults

- Sample rate: 16 kHz (standard for voice pipelines)
- Frame duration: 20ms (320 samples per frame)
- VAD and calibration: Use sensible defaults from the underlying engines

## See

[BuiltInAdaptiveVadProviderConfig](../interfaces/BuiltInAdaptiveVadProviderConfig.md) for configuration options
See `AdaptiveVAD` for the underlying VAD algorithm.
See `EnvironmentalCalibrator` for the noise profiling engine.

## Example

```ts
const vad = new BuiltInAdaptiveVadProvider({
  sampleRate: 16_000,
  frameDurationMs: 20,
  vad: { minSpeechDurationMs: 100 },
});

const frame = new Float32Array(320); // 20ms at 16kHz
// ... fill frame with audio samples ...
const decision = vad.processFrame(frame);
if (decision.isSpeech) {
  console.log(`Speech detected (confidence: ${decision.confidence})`);
}
```

## Implements

- [`SpeechVadProvider`](../interfaces/SpeechVadProvider.md)

## Constructors

### Constructor

> **new BuiltInAdaptiveVadProvider**(`config?`): `BuiltInAdaptiveVadProvider`

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:133](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L133)

Creates a new BuiltInAdaptiveVadProvider.

Initializes both the environmental calibrator and the adaptive VAD
engine with the provided or default configuration.

#### Parameters

##### config?

[`BuiltInAdaptiveVadProviderConfig`](../interfaces/BuiltInAdaptiveVadProviderConfig.md) = `{}`

Optional VAD configuration. All fields default to
  standard values suitable for 16kHz mono voice audio.

#### Returns

`BuiltInAdaptiveVadProvider`

#### Example

```ts
// Default configuration (16kHz, 20ms frames)
const vad = new BuiltInAdaptiveVadProvider();

// Custom configuration
const vad = new BuiltInAdaptiveVadProvider({
  sampleRate: 48_000,
  frameDurationMs: 10,
  vad: { minSpeechDurationMs: 200 },
});
```

## Properties

### displayName

> `readonly` **displayName**: `"AgentOS Adaptive VAD"` = `'AgentOS Adaptive VAD'`

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:97](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L97)

Human-readable display name for UI and logging.

#### Implementation of

[`SpeechVadProvider`](../interfaces/SpeechVadProvider.md).[`displayName`](../interfaces/SpeechVadProvider.md#displayname)

***

### id

> `readonly` **id**: `"agentos-adaptive-vad"` = `'agentos-adaptive-vad'`

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:94](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L94)

Unique provider identifier used for registration and resolution.

#### Implementation of

[`SpeechVadProvider`](../interfaces/SpeechVadProvider.md).[`id`](../interfaces/SpeechVadProvider.md#id)

## Methods

### getNoiseProfile()

> **getNoiseProfile**(): [`NoiseProfile`](../interfaces/NoiseProfile.md) \| `null`

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:207](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L207)

Returns the current environmental noise profile estimated by the calibrator.

The noise profile includes the estimated noise floor RMS, spectral shape,
and confidence metrics. Returns `null` if insufficient audio has been
processed for a reliable estimate.

#### Returns

[`NoiseProfile`](../interfaces/NoiseProfile.md) \| `null`

The current noise profile, or `null` if not yet calibrated.

#### Example

```ts
const profile = vad.getNoiseProfile();
if (profile) {
  console.log(`Noise floor: ${profile.noiseFloorRms}`);
}
```

#### Implementation of

[`SpeechVadProvider`](../interfaces/SpeechVadProvider.md).[`getNoiseProfile`](../interfaces/SpeechVadProvider.md#getnoiseprofile)

***

### processFrame()

> **processFrame**(`frame`): [`SpeechVadDecision`](../interfaces/SpeechVadDecision.md)

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:162](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L162)

Process a single audio frame and return a speech/non-speech decision.

This method must be called sequentially with consecutive audio frames.
The VAD maintains internal state (speech onset tracking, hangover counters)
that depends on temporal continuity between frames.

#### Parameters

##### frame

`Float32Array`

A Float32Array of audio samples for one frame. The expected
  length is `sampleRate * frameDurationMs / 1000` (e.g. 320 for 16kHz/20ms).
  Samples should be normalized to the range [-1.0, 1.0].

#### Returns

[`SpeechVadDecision`](../interfaces/SpeechVadDecision.md)

A decision object with `isSpeech`, `confidence`, the raw VAD result,
  and the current environmental noise profile.

#### Example

```ts
const frame = new Float32Array(320);
// ... fill with audio samples ...
const decision = vad.processFrame(frame);
console.log(decision.isSpeech, decision.confidence);
```

#### Implementation of

[`SpeechVadProvider`](../interfaces/SpeechVadProvider.md).[`processFrame`](../interfaces/SpeechVadProvider.md#processframe)

***

### reset()

> **reset**(): `void`

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:186](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L186)

Reset the VAD state for a new audio session.

Clears internal counters (speech onset tracking, hangover timers) so the
VAD starts fresh. Should be called when starting a new conversation turn
or after a significant audio gap. Does NOT reset the environmental
calibrator — the noise profile persists across resets.

#### Returns

`void`

#### Example

```ts
// Start a new conversation turn
vad.reset();
```

#### Implementation of

[`SpeechVadProvider`](../interfaces/SpeechVadProvider.md).[`reset`](../interfaces/SpeechVadProvider.md#reset)
