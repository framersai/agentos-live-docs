# Interface: AnchorProviderResult

Defined in: [packages/agentos/src/provenance/types.ts:85](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L85)

Result returned by an AnchorProvider after external publishing.

## Properties

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:95](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L95)

Error message if success is false.

***

### externalRef?

> `optional` **externalRef**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:91](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L91)

External reference string (CID, UUID, tx hash, URL, etc.).

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/provenance/types.ts:93](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L93)

Provider-specific metadata (e.g., block number, log index).

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:87](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L87)

Provider identifier (e.g., 'rekor', 'worm-snapshot').

***

### publishedAt?

> `optional` **publishedAt**: `string`

Defined in: [packages/agentos/src/provenance/types.ts:97](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L97)

ISO 8601 timestamp of when the external publish completed.

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/provenance/types.ts:89](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/provenance/types.ts#L89)

Whether the external publishing succeeded.
