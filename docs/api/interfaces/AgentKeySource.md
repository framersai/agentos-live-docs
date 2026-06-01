# Interface: AgentKeySource

Defined in: [packages/agentos/src/safety/provenance/types.ts:42](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/provenance/types.ts#L42)

## Properties

### keyStorePath?

> `optional` **keyStorePath**: `string`

Defined in: [packages/agentos/src/safety/provenance/types.ts:50](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/provenance/types.ts#L50)

Optional filesystem path for persisting generated keys.

***

### privateKeyBase64?

> `optional` **privateKeyBase64**: `string`

Defined in: [packages/agentos/src/safety/provenance/types.ts:46](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/provenance/types.ts#L46)

For 'import': base64-encoded Ed25519 private key.

***

### publicKeyBase64?

> `optional` **publicKeyBase64**: `string`

Defined in: [packages/agentos/src/safety/provenance/types.ts:48](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/provenance/types.ts#L48)

For 'import': base64-encoded Ed25519 public key.

***

### type

> **type**: `"generate"` \| `"import"`

Defined in: [packages/agentos/src/safety/provenance/types.ts:44](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/provenance/types.ts#L44)

'generate' creates a new keypair; 'import' uses provided keys.
