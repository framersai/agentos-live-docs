# Interface: BuiltInAdaptiveVadProviderConfig

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:17](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L17)

Configuration for the [BuiltInAdaptiveVadProvider](../classes/BuiltInAdaptiveVadProvider.md).

All fields are optional — sensible defaults are applied for 16kHz mono
audio with 20ms frames (the standard voice pipeline configuration).

## See

[BuiltInAdaptiveVadProvider](../classes/BuiltInAdaptiveVadProvider.md) for usage examples
See `AdaptiveVADConfig` for detailed VAD tuning parameters.
See `CalibrationConfig` for environmental calibration settings.

## Properties

### calibration?

> `optional` **calibration**: [`CalibrationConfig`](CalibrationConfig.md)

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:38](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L38)

Environmental calibration settings. Controls how the noise floor and
spectral profile are estimated from ambient audio.

See `CalibrationConfig` for available options.

***

### frameDurationMs?

> `optional` **frameDurationMs**: `number`

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:30](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L30)

Duration of each audio frame in milliseconds. Determines the number
of samples expected in each `processFrame()` call.
At 16kHz with 20ms frames, each frame is 320 samples.

#### Default

```ts
20
```

***

### sampleRate?

> `optional` **sampleRate**: `number`

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:22](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L22)

Audio sample rate in Hz. Must match the actual audio stream.

#### Default

```ts
16_000 (16 kHz, standard for voice processing)
```

***

### vad?

> `optional` **vad**: [`AdaptiveVADConfig`](AdaptiveVADConfig.md)

Defined in: [packages/agentos/src/hearing/providers/BuiltInAdaptiveVadProvider.ts:46](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/hearing/providers/BuiltInAdaptiveVadProvider.ts#L46)

VAD algorithm configuration. Controls speech detection thresholds,
minimum speech duration, hangover period, etc.

See `AdaptiveVADConfig` for available options.
