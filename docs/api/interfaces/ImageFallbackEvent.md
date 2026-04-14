# Interface: ImageFallbackEvent

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:76](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/FallbackImageProxy.ts#L76)

Payload emitted on the `image:fallback` event when a provider in the
chain fails and the proxy advances to the next candidate.

## Example

```ts
emitter.on('image:fallback', (evt: ImageFallbackEvent) => {
  console.warn(`${evt.from} -> ${evt.to}: ${evt.reason}`);
});
```

## Properties

### from

> **from**: `string`

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:80](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/FallbackImageProxy.ts#L80)

Identifier of the provider that failed.

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:84](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/FallbackImageProxy.ts#L84)

Human-readable reason for the fallback (error message or "not supported").

***

### to

> **to**: `string`

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:82](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/FallbackImageProxy.ts#L82)

Identifier of the provider that will be tried next.

***

### type

> **type**: `"image:fallback"`

Defined in: [packages/agentos/src/media/images/FallbackImageProxy.ts:78](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/media/images/FallbackImageProxy.ts#L78)

The event discriminator. Always `'image:fallback'`.
