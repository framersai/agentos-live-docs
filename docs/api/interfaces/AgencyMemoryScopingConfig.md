# Interface: AgencyMemoryScopingConfig

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:114](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/agents/agency/AgencyTypes.ts#L114)

Controls how GMIs scope their RAG queries within an agency.

## Properties

### allowCrossGMIQueries?

> `optional` **allowCrossGMIQueries**: `boolean`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:125](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/agents/agency/AgencyTypes.ts#L125)

Include other GMIs' personal memory in queries (with permission).

#### Default

```ts
false
```

***

### includeSharedInQueries?

> `optional` **includeSharedInQueries**: `boolean`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:119](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/agents/agency/AgencyTypes.ts#L119)

Include agency shared memory in GMI RAG queries.

#### Default

```ts
true when agency memory is enabled
```

***

### sharedMemoryWeight?

> `optional` **sharedMemoryWeight**: `number`

Defined in: [packages/agentos/src/agents/agency/AgencyTypes.ts:132](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/agents/agency/AgencyTypes.ts#L132)

Priority weight for shared memory vs personal memory in results.
0 = personal only, 1 = shared only, 0.5 = equal weight.

#### Default

```ts
0.3
```
