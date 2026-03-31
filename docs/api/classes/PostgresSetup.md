# Class: PostgresSetup

Defined in: [packages/agentos/src/rag/setup/PostgresSetup.ts:25](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/setup/PostgresSetup.ts#L25)

## Constructors

### Constructor

> **new PostgresSetup**(): `PostgresSetup`

#### Returns

`PostgresSetup`

## Methods

### detect()

> `static` **detect**(`config?`): `Promise`\<[`BackendStatus`](../interfaces/BackendStatus.md)\>

Defined in: [packages/agentos/src/rag/setup/PostgresSetup.ts:32](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/setup/PostgresSetup.ts#L32)

Detect and optionally provision a Postgres + pgvector instance.

#### Parameters

##### config?

[`SetupConfig`](../interfaces/SetupConfig.md)

Optional setup overrides (port, image tag, URL).

#### Returns

`Promise`\<[`BackendStatus`](../interfaces/BackendStatus.md)\>

Backend status with connection string.
