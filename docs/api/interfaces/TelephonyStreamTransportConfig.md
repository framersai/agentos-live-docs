# Interface: TelephonyStreamTransportConfig

Defined in: [packages/agentos/src/channels/telephony/TelephonyStreamTransport.ts:82](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/TelephonyStreamTransport.ts#L82)

Optional construction-time configuration for [TelephonyStreamTransport](../classes/TelephonyStreamTransport.md).

## Properties

### outputSampleRate?

> `optional` **outputSampleRate**: `number`

Defined in: [packages/agentos/src/channels/telephony/TelephonyStreamTransport.ts:88](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/TelephonyStreamTransport.ts#L88)

Sample rate the pipeline expects for inbound `AudioFrame` events.
Incoming 8 kHz telephony audio is upsampled to this rate.

#### Default Value

```ts
16000
```
