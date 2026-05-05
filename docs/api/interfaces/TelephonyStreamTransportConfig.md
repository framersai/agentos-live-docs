# Interface: TelephonyStreamTransportConfig

Defined in: [packages/agentos/src/channels/telephony/TelephonyStreamTransport.ts:82](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/channels/telephony/TelephonyStreamTransport.ts#L82)

Optional construction-time configuration for [TelephonyStreamTransport](../classes/TelephonyStreamTransport.md).

## Properties

### outputSampleRate?

> `optional` **outputSampleRate**: `number`

Defined in: [packages/agentos/src/channels/telephony/TelephonyStreamTransport.ts:88](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/channels/telephony/TelephonyStreamTransport.ts#L88)

Sample rate the pipeline expects for inbound `AudioFrame` events.
Incoming 8 kHz telephony audio is upsampled to this rate.

#### Default Value

```ts
16000
```
