# Function: isFlashbulbMemory()

> **isFlashbulbMemory**(`emotionalIntensity`, `threshold?`): `boolean`

Defined in: [packages/agentos/src/memory/core/encoding/EncodingModel.ts:126](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/encoding/EncodingModel.ts#L126)

Determine whether this memory qualifies as a flashbulb memory.
Flashbulb criteria: emotional intensity > threshold.

## Parameters

### emotionalIntensity

`number`

### threshold?

`number` = `DEFAULT_ENCODING_CONFIG.flashbulbThreshold`

## Returns

`boolean`
