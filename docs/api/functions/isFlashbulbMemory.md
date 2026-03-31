# Function: isFlashbulbMemory()

> **isFlashbulbMemory**(`emotionalIntensity`, `threshold?`): `boolean`

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:126](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/core/encoding/EncodingModel.ts#L126)

Determine whether this memory qualifies as a flashbulb memory.
Flashbulb criteria: emotional intensity > threshold.

## Parameters

### emotionalIntensity

`number`

### threshold?

`number` = `DEFAULT_ENCODING_CONFIG.flashbulbThreshold`

## Returns

`boolean`
