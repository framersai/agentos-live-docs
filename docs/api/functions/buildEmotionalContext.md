# Function: buildEmotionalContext()

> **buildEmotionalContext**(`currentMood`, `gmiMood`, `contentSentiment?`): [`EmotionalContext`](../interfaces/EmotionalContext.md)

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:145](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/encoding/EncodingModel.ts#L145)

Create the EmotionalContext snapshot for a memory trace.
Blends content sentiment with current mood (70/30 split).

## Parameters

### currentMood

[`PADState`](../interfaces/PADState.md)

Current PAD state from MoodEngine.

### gmiMood

`string`

Current GMI mood enum string.

### contentSentiment?

`number` = `0`

Estimated sentiment of the content (-1..1). Defaults to 0.

## Returns

[`EmotionalContext`](../interfaces/EmotionalContext.md)
