# Interface: SceneDescription

Defined in: [packages/agentos/src/media/video/types.ts:338](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L338)

A single scene detected within a video, with timestamps,
description, and optional transcript.

Scenes are contiguous segments of video bounded by visual
discontinuities (hard cuts, dissolves, fades). The
SceneDetector identifies boundaries, and a vision LLM
describes the content of each scene.

This is a richer version of the base [VideoScene](VideoScene.md) type that
includes cut-type classification, confidence, transcript, and key
frame data.

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:385](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L385)

Confidence score (0-1) for the scene boundary detection.
Higher values indicate a more definitive visual discontinuity.

***

### cutType

> **cutType**: `"hard-cut"` \| `"dissolve"` \| `"fade"` \| `"wipe"` \| `"gradual"` \| `"start"`

Defined in: [packages/agentos/src/media/video/types.ts:361](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L361)

Type of visual transition that marks the beginning of this scene.

- `'hard-cut'`  — Abrupt frame-to-frame change
- `'dissolve'`  — Cross-dissolve / superimposition transition
- `'fade'`      — Fade from/to black or white
- `'wipe'`      — Directional wipe transition
- `'gradual'`   — Other gradual transition not fitting the above
- `'start'`     — First scene in the video (no preceding transition)

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:367](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L367)

Natural-language description of the scene content, generated
by a vision LLM from the key frame.

***

### durationSec

> **durationSec**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:349](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L349)

Duration of the scene in seconds (`endSec - startSec`).

***

### endSec

> **endSec**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:346](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L346)

End time of the scene in seconds from video start.

***

### index

> **index**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:340](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L340)

0-based scene index within the video.

***

### keyFrame?

> `optional` **keyFrame**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:379](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L379)

Base64-encoded key frame image (JPEG) representative of the scene.
Typically the frame closest to the scene midpoint.

***

### startSec

> **startSec**: `number`

Defined in: [packages/agentos/src/media/video/types.ts:343](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L343)

Start time of the scene in seconds from video start.

***

### transcript?

> `optional` **transcript**: `string`

Defined in: [packages/agentos/src/media/video/types.ts:373](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/media/video/types.ts#L373)

Transcript of speech/narration during this scene's time range.
Only populated when audio transcription is enabled.
