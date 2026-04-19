# Interface: MigrationOptions

Defined in: [packages/agentos/src/rag/migration/types.ts:49](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/migration/types.ts#L49)

Options for a migration operation.

## Properties

### batchSize?

> `optional` **batchSize**: `number`

Defined in: [packages/agentos/src/rag/migration/types.ts:55](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/migration/types.ts#L55)

Rows per batch for streaming reads/writes.

#### Default

```ts
1000
```

***

### dryRun?

> `optional` **dryRun**: `boolean`

Defined in: [packages/agentos/src/rag/migration/types.ts:64](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/migration/types.ts#L64)

If true, counts rows but does not write to target.

#### Default

```ts
false
```

***

### from

> **from**: [`BackendConfig`](BackendConfig.md)

Defined in: [packages/agentos/src/rag/migration/types.ts:51](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/migration/types.ts#L51)

Source backend configuration.

***

### onProgress()?

> `optional` **onProgress**: (`done`, `total`, `table`) => `void`

Defined in: [packages/agentos/src/rag/migration/types.ts:62](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/migration/types.ts#L62)

Progress callback fired after each batch write.

#### Parameters

##### done

`number`

Number of rows written so far for the current table.

##### total

`number`

Total row count for the current table.

##### table

`string`

Name of the table currently being migrated.

#### Returns

`void`

***

### to

> **to**: [`BackendConfig`](BackendConfig.md)

Defined in: [packages/agentos/src/rag/migration/types.ts:53](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/migration/types.ts#L53)

Target backend configuration.
