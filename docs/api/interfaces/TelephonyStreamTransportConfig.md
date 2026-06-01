# Interface: TelephonyStreamTransportConfig

Defined in: [packages/agentos/src/io/channels/telephony/TelephonyStreamTransport.ts:82](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/TelephonyStreamTransport.ts#L82)

Optional construction-time configuration for [TelephonyStreamTransport](../classes/TelephonyStreamTransport.md).

## Properties

### outputSampleRate?

> `optional` **outputSampleRate**: `number`

Defined in: [packages/agentos/src/io/channels/telephony/TelephonyStreamTransport.ts:88](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/telephony/TelephonyStreamTransport.ts#L88)

Sample rate the pipeline expects for inbound `AudioFrame` events.
Incoming 8 kHz telephony audio is upsampled to this rate.

#### Default Value

```ts
16000
```
