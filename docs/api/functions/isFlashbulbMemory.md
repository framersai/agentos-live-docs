# Function: isFlashbulbMemory()

> **isFlashbulbMemory**(`emotionalIntensity`, `threshold?`): `boolean`

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:126](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/encoding/EncodingModel.ts#L126)

Determine whether this memory qualifies as a flashbulb memory.
Flashbulb criteria: emotional intensity > threshold.

## Parameters

### emotionalIntensity

`number`

### threshold?

`number` = `DEFAULT_ENCODING_CONFIG.flashbulbThreshold`

## Returns

`boolean`
