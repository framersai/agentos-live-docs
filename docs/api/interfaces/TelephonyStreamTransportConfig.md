# Interface: TelephonyStreamTransportConfig

Defined in: [packages/agentos/src/channels/telephony/TelephonyStreamTransport.ts:82](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/TelephonyStreamTransport.ts#L82)

Optional construction-time configuration for [TelephonyStreamTransport](../classes/TelephonyStreamTransport.md).

## Properties

### outputSampleRate?

> `optional` **outputSampleRate**: `number`

Defined in: [packages/agentos/src/channels/telephony/TelephonyStreamTransport.ts:88](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/telephony/TelephonyStreamTransport.ts#L88)

Sample rate the pipeline expects for inbound `AudioFrame` events.
Incoming 8 kHz telephony audio is upsampled to this rate.

#### Default Value

```ts
16000
```
