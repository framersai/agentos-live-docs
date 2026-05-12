# Class: CitationVerifier

Defined in: [packages/agentos/src/rag/citation/CitationVerifier.ts:27](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/CitationVerifier.ts#L27)

Core citation verification engine.

## Constructors

### Constructor

> **new CitationVerifier**(`config`): `CitationVerifier`

Defined in: [packages/agentos/src/rag/citation/CitationVerifier.ts:34](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/CitationVerifier.ts#L34)

#### Parameters

##### config

[`CitationVerifierConfig`](../interfaces/CitationVerifierConfig.md)

#### Returns

`CitationVerifier`

## Methods

### verify()

> **verify**(`text`, `sources`): `Promise`\<[`VerifiedResponse`](../interfaces/VerifiedResponse.md)\>

Defined in: [packages/agentos/src/rag/citation/CitationVerifier.ts:43](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/rag/citation/CitationVerifier.ts#L43)

Verify claims in text against provided sources.

#### Parameters

##### text

`string`

##### sources

[`VerificationSource`](../interfaces/VerificationSource.md)[]

#### Returns

`Promise`\<[`VerifiedResponse`](../interfaces/VerifiedResponse.md)\>
