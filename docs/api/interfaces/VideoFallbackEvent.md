# Interface: VideoFallbackEvent

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:60](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/video/FallbackVideoProxy.ts#L60)

Payload emitted on the `video:generate:fallback` event when a provider in
the chain fails and the proxy advances to the next candidate.

## Example

```ts
emitter.on('video:generate:fallback', (evt: VideoFallbackEvent) => {
  console.warn(`${evt.from} -> ${evt.to}: ${evt.reason}`);
});
```

## Properties

### from

> **from**: `string`

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:64](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/video/FallbackVideoProxy.ts#L64)

Identifier of the provider that failed.

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:68](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/video/FallbackVideoProxy.ts#L68)

Human-readable reason for the fallback (error message or "not supported").

***

### to

> **to**: `string`

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:66](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/video/FallbackVideoProxy.ts#L66)

Identifier of the provider that will be tried next.

***

### type

> **type**: `"video:generate:fallback"`

Defined in: [packages/agentos/src/media/video/FallbackVideoProxy.ts:62](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/media/video/FallbackVideoProxy.ts#L62)

The event discriminator. Always `'video:generate:fallback'`.
