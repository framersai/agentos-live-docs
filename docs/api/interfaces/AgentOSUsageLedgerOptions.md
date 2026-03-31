# Interface: AgentOSUsageLedgerOptions

Defined in: [packages/agentos/src/api/runtime/usageLedger.ts:15](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/usageLedger.ts#L15)

## Properties

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/agentos/src/api/runtime/usageLedger.ts:17](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/usageLedger.ts#L17)

Enable persistence using the shared default path under `~/.framers/usage-ledger.jsonl`.

***

### path?

> `optional` **path**: `string`

Defined in: [packages/agentos/src/api/runtime/usageLedger.ts:19](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/usageLedger.ts#L19)

Explicit path to the append-only JSONL ledger file.

***

### personaId?

> `optional` **personaId**: `string`

Defined in: [packages/agentos/src/api/runtime/usageLedger.ts:23](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/usageLedger.ts#L23)

Optional persona identifier for callers layering persona-specific usage views.

***

### sessionId?

> `optional` **sessionId**: `string`

Defined in: [packages/agentos/src/api/runtime/usageLedger.ts:21](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/usageLedger.ts#L21)

Session identifier used to group related helper calls. Defaults to `"global"`.

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/api/runtime/usageLedger.ts:25](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/usageLedger.ts#L25)

Optional source label such as `"generateText"` or `"agent.session.stream"`.
