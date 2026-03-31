# Interface: VADResult

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:17](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/hearing/AdaptiveVAD.ts#L17)

Represents the result of VAD processing for an audio frame.

## Properties

### confidence?

> `optional` **confidence**: `number`

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:27](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/hearing/AdaptiveVAD.ts#L27)

Confidence score (0-1) in the `isSpeech` detection. Can be basic for now.

***

### currentSilenceThreshold

> **currentSilenceThreshold**: `number`

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:25](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/hearing/AdaptiveVAD.ts#L25)

The silence detection threshold used for this frame.

***

### currentSpeechThreshold

> **currentSpeechThreshold**: `number`

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:23](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/hearing/AdaptiveVAD.ts#L23)

The speech detection threshold used for this frame, adapted from the noise profile.

***

### frameEnergy

> **frameEnergy**: `number`

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:21](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/hearing/AdaptiveVAD.ts#L21)

The calculated energy (RMS) of the current audio frame.

***

### isSpeech

> **isSpeech**: `boolean`

Defined in: [packages/agentos/src/hearing/AdaptiveVAD.ts:19](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/hearing/AdaptiveVAD.ts#L19)

Indicates whether speech is currently detected in the frame.
