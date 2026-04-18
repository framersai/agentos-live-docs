# Interface: ProviderFallbackEvent

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:32](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/FallbackProxy.ts#L32)

Payload emitted on the `provider_fallback` event when a provider in the
chain fails and the proxy advances to the next candidate.

This event is emitted on the `EventEmitter` passed to the proxy
constructor — typically the `SpeechProviderResolver` instance — so
that callers can observe and log the fallback path without coupling to
the proxy internals.

## See

 - [FallbackSTTProxy](../classes/FallbackSTTProxy.md) for STT fallback chain usage
 - [FallbackTTSProxy](../classes/FallbackTTSProxy.md) for TTS fallback chain usage

## Example

```ts
resolver.on('provider_fallback', (event: ProviderFallbackEvent) => {
  console.warn(`${event.kind} fallback: ${event.from} -> ${event.to}`, event.error);
});
```

## Properties

### error

> **error**: `unknown`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:44](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/FallbackProxy.ts#L44)

The error thrown by the failing provider. Typed as `unknown` because
providers may throw non-Error values (e.g. string messages, API response
objects). Callers should use `instanceof Error` before accessing `.message`.

***

### from

> **from**: `string`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:34](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/FallbackProxy.ts#L34)

Unique identifier of the provider that failed.

***

### kind

> **kind**: `"stt"` \| `"tts"`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:38](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/FallbackProxy.ts#L38)

Whether this is an STT or TTS fallback chain.

***

### to

> **to**: `string`

Defined in: [packages/agentos/src/speech/FallbackProxy.ts:36](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/speech/FallbackProxy.ts#L36)

Unique identifier of the provider that will be tried next.
