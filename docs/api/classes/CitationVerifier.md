# Class: CitationVerifier

Defined in: [packages/agentos/src/cognition/rag/citation/CitationVerifier.ts:27](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/CitationVerifier.ts#L27)

Core citation verification engine.

## Constructors

### Constructor

> **new CitationVerifier**(`config`): `CitationVerifier`

Defined in: [packages/agentos/src/cognition/rag/citation/CitationVerifier.ts:34](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/CitationVerifier.ts#L34)

#### Parameters

##### config

[`CitationVerifierConfig`](../interfaces/CitationVerifierConfig.md)

#### Returns

`CitationVerifier`

## Methods

### extractClaims()

> **extractClaims**(`text`): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/cognition/rag/citation/CitationVerifier.ts:142](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/CitationVerifier.ts#L142)

Decompose raw text into atomic claims using the same logic
`verify(text, sources)` uses internally.

Uses the constructor's `extractClaims` callback when provided,
otherwise falls back to the built-in sentence splitter. Exposed
publicly so callers who want to **inspect or filter** the claim
list before verification can do so, then hand it back to
`verify(claims[], sources)`:

```ts
const claims = await verifier.extractClaims(llmText);
const filtered = claims.filter((c) => !c.startsWith('I think'));
const result = await verifier.verify(filtered, sources);
```

#### Parameters

##### text

`string`

#### Returns

`Promise`\<`string`[]\>

***

### verify()

> **verify**(`input`, `sources`): `Promise`\<[`VerifiedResponse`](../interfaces/VerifiedResponse.md)\>

Defined in: [packages/agentos/src/cognition/rag/citation/CitationVerifier.ts:66](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/citation/CitationVerifier.ts#L66)

Verify claims against provided sources.

Accepts the input in two shapes:

- **`string`** — the raw text the verifier should decompose into atomic
  claims before scoring. Uses the configured `extractClaims` callback
  (e.g. an LLM-driven decomposer) or the built-in sentence splitter.
  Best when the input is one block of LLM-generated prose and you want
  the verifier to handle decomposition.

- **`string[]`** — a list of pre-decomposed atomic claims, used as-is
  without any further extraction. Best when you already broke the prose
  into structured claims yourself, when you're verifying claims that
  came from a parser other than English sentence splitting, or when
  you want to scope verification to a specific subset of claims.

Both paths score each claim against each source via cosine similarity
and (optionally) NLI contradiction detection, then return a single
[VerifiedResponse](../interfaces/VerifiedResponse.md) with per-claim verdicts.

#### Parameters

##### input

Either the raw text or a pre-decomposed claim list.

`string` | `string`[]

##### sources

[`VerificationSource`](../interfaces/VerificationSource.md)[]

Sources to score every claim against.

#### Returns

`Promise`\<[`VerifiedResponse`](../interfaces/VerifiedResponse.md)\>
