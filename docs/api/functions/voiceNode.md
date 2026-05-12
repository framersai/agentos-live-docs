# Function: voiceNode()

> **voiceNode**(`id`, `config`): [`VoiceNodeBuilder`](../classes/VoiceNodeBuilder.md)

Defined in: [packages/agentos/src/orchestration/builders/VoiceNodeBuilder.ts:72](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/builders/VoiceNodeBuilder.ts#L72)

Create a new [VoiceNodeBuilder](../classes/VoiceNodeBuilder.md) for a voice pipeline graph node.

This is the primary entry point for the voice node DSL. Use the returned
builder's `.on()` method to add exit-reason routes and `.build()` to
produce the `GraphNode` IR object.

## Parameters

### id

`string`

Unique node identifier within the parent graph. Must be
                unique across all nodes in the graph to avoid collision
                in the edge map and checkpoint scratch keys.

### config

[`VoiceNodeConfig`](../interfaces/VoiceNodeConfig.md)

Voice pipeline configuration for this node (mode, STT/TTS
                overrides, turn limits, exit conditions).

## Returns

[`VoiceNodeBuilder`](../classes/VoiceNodeBuilder.md)

A fluent builder; call `.on()` to add exit-reason routes and
         `.build()` to produce the `GraphNode` IR object.

## Example

```typescript
const node = voiceNode('greet', { mode: 'conversation' })
  .on('completed', 'process')
  .on('hangup', 'cleanup')
  .build();
```

## See

[VoiceNodeBuilder](../classes/VoiceNodeBuilder.md) -- the returned builder class.
