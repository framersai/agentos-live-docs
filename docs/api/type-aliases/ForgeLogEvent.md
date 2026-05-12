# Type Alias: ForgeLogEvent

> **ForgeLogEvent** = \{ `kind`: `"start"`; `mode`: `string`; `scope?`: `string`; `toolName`: `string`; \} \| \{ `confidence`: `number`; `kind`: `"approved"`; `scope?`: `string`; `toolName`: `string`; \} \| \{ `kind`: `"rejected"`; `reason`: `string`; `scope?`: `string`; `toolName`: `string`; \} \| \{ `error`: `string`; `kind`: `"error"`; `scope?`: `string`; `toolName`: `string`; \}

Defined in: [packages/agentos/src/emergent/wrapForgeTool.ts:63](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/wrapForgeTool.ts#L63)

Structured log event emitted at each forge lifecycle step. Consumers
who care about stdout visibility can pass a `log` callback that
renders this into console.log / pm2 / whatever. AgentOS emits
nothing by default so the wrapper is safe to use in quiet contexts.
