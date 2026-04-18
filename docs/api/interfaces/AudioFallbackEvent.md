# Interface: AudioFallbackEvent

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:61](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/FallbackAudioProxy.ts#L61)

Payload emitted on the `audio:generate:fallback` event when a provider in
the chain fails and the proxy advances to the next candidate.

## Example

```ts
emitter.on('audio:generate:fallback', (evt: AudioFallbackEvent) => {
  console.warn(`${evt.from} -> ${evt.to}: ${evt.reason}`);
});
```

## Properties

### from

> **from**: `string`

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:65](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/FallbackAudioProxy.ts#L65)

Identifier of the provider that failed.

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:69](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/FallbackAudioProxy.ts#L69)

Human-readable reason for the fallback (error message or "not supported").

***

### to

> **to**: `string`

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:67](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/FallbackAudioProxy.ts#L67)

Identifier of the provider that will be tried next.

***

### type

> **type**: `"audio:generate:fallback"`

Defined in: [packages/agentos/src/media/audio/FallbackAudioProxy.ts:63](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/media/audio/FallbackAudioProxy.ts#L63)

The event discriminator. Always `'audio:generate:fallback'`.
