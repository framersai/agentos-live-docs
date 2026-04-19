# Interface: AuditEntry

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:97](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentToolRegistry.ts#L97)

A single entry in the emergent tool audit trail.

Audit entries record every significant state change: registration, promotion,
demotion, usage recording, and session cleanup. They are stored both in-memory
and (when a storage adapter is provided) in the `agentos_emergent_audit_log`
SQLite table.

## Properties

### data?

> `optional` **data**: `unknown`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:105](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentToolRegistry.ts#L105)

Optional structured data associated with the event.

***

### eventType

> **eventType**: `string`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:103](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentToolRegistry.ts#L103)

Machine-readable event type (e.g., `'register'`, `'promote'`, `'demote'`).

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:99](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentToolRegistry.ts#L99)

Unique identifier for this audit entry.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:107](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentToolRegistry.ts#L107)

Unix epoch millisecond timestamp of when the event occurred.

***

### toolId

> **toolId**: `string`

Defined in: [packages/agentos/src/emergent/EmergentToolRegistry.ts:101](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/emergent/EmergentToolRegistry.ts#L101)

The tool ID this event pertains to.
