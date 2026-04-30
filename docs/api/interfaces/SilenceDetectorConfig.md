# Interface: SilenceDetectorConfig

Defined in: [packages/agentos/src/hearing/SilenceDetector.ts:16](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/SilenceDetector.ts#L16)

Configuration for the SilenceDetector.

## Properties

### minSilenceTimeToConsiderAfterSpeech?

> `optional` **minSilenceTimeToConsiderAfterSpeech**: `number`

Defined in: [packages/agentos/src/hearing/SilenceDetector.ts:40](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/SilenceDetector.ts#L40)

After VAD signals `speech_start`, how long (ms) must silence persist
before it's considered for `significant_pause` or `utterance_end`.
This prevents cutting off very short speech segments immediately if followed by silence.
Should be less than `significantPauseThresholdMs`.

#### Default

```ts
500 ms
```

***

### significantPauseThresholdMs?

> `optional` **significantPauseThresholdMs**: `number`

Defined in: [packages/agentos/src/hearing/SilenceDetector.ts:23](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/SilenceDetector.ts#L23)

Minimum duration of continuous silence (ms) after speech has ended
to be considered a "significant pause". This might indicate the user is thinking
or expecting a response.

#### Default

```ts
1500 ms
```

***

### silenceCheckIntervalMs?

> `optional` **silenceCheckIntervalMs**: `number`

Defined in: [packages/agentos/src/hearing/SilenceDetector.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/SilenceDetector.ts#L47)

Polling interval in milliseconds to check silence duration if no new VAD events occur.
This ensures long silences are detected even if VAD remains in a 'no_voice_activity' state.

#### Default

```ts
250 ms
```

***

### utteranceEndThresholdMs?

> `optional` **utteranceEndThresholdMs**: `number`

Defined in: [packages/agentos/src/hearing/SilenceDetector.ts:31](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/hearing/SilenceDetector.ts#L31)

Maximum duration of continuous silence (ms) after speech has ended
before considering the user's utterance fully complete.
This should typically be longer than `significantPauseThresholdMs`.

#### Default

```ts
3000 ms
```
