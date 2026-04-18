# Class: BundleExporter

Defined in: [packages/agentos/src/provenance/verification/BundleExporter.ts:32](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/verification/BundleExporter.ts#L32)

## Constructors

### Constructor

> **new BundleExporter**(`ledger`, `keyManager`, `anchorStorage?`, `tablePrefix?`): `BundleExporter`

Defined in: [packages/agentos/src/provenance/verification/BundleExporter.ts:38](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/verification/BundleExporter.ts#L38)

#### Parameters

##### ledger

[`SignedEventLedger`](SignedEventLedger.md)

##### keyManager

[`AgentKeyManager`](AgentKeyManager.md)

##### anchorStorage?

`AnchorStorageAdapter` | `null`

##### tablePrefix?

`string` = `''`

#### Returns

`BundleExporter`

## Methods

### exportAsJSONL()

> **exportAsJSONL**(`fromSequence?`, `toSequence?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/provenance/verification/BundleExporter.ts:131](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/verification/BundleExporter.ts#L131)

Export a bundle as a JSONL string (one JSON object per line).
Format:
  Line 1: Bundle metadata (version, agentId, publicKey, exportedAt, bundleHash, bundleSignature)
  Lines 2-N: One event per line
  Lines N+1-M: One anchor per line (prefixed with type: 'anchor')

#### Parameters

##### fromSequence?

`number`

##### toSequence?

`number`

#### Returns

`Promise`\<`string`\>

***

### exportBundle()

> **exportBundle**(`fromSequence?`, `toSequence?`): `Promise`\<[`VerificationBundle`](../interfaces/VerificationBundle.md)\>

Defined in: [packages/agentos/src/provenance/verification/BundleExporter.ts:58](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/verification/BundleExporter.ts#L58)

Export a verification bundle containing all events, anchors, and public key.
The bundle is signed for tamper evidence.

#### Parameters

##### fromSequence?

`number`

Optional start sequence (inclusive). Defaults to 1.

##### toSequence?

`number`

Optional end sequence (inclusive). Defaults to latest.

#### Returns

`Promise`\<[`VerificationBundle`](../interfaces/VerificationBundle.md)\>

A self-contained verification bundle.

***

### importAndVerify()

> `static` **importAndVerify**(`bundle`): `Promise`\<[`VerificationResult`](../interfaces/VerificationResult.md)\>

Defined in: [packages/agentos/src/provenance/verification/BundleExporter.ts:170](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/verification/BundleExporter.ts#L170)

Import and verify a bundle. Works completely offline (no DB required).

#### Parameters

##### bundle

[`VerificationBundle`](../interfaces/VerificationBundle.md)

The verification bundle to verify.

#### Returns

`Promise`\<[`VerificationResult`](../interfaces/VerificationResult.md)\>

Verification result.

***

### parseJSONL()

> `static` **parseJSONL**(`jsonl`): [`VerificationBundle`](../interfaces/VerificationBundle.md)

Defined in: [packages/agentos/src/provenance/verification/BundleExporter.ts:275](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/provenance/verification/BundleExporter.ts#L275)

Parse a JSONL bundle string back into a VerificationBundle.

#### Parameters

##### jsonl

`string`

#### Returns

[`VerificationBundle`](../interfaces/VerificationBundle.md)
