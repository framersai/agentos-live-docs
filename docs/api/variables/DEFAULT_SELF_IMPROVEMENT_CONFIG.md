# Variable: DEFAULT\_SELF\_IMPROVEMENT\_CONFIG

> `const` **DEFAULT\_SELF\_IMPROVEMENT\_CONFIG**: `Readonly`\<[`SelfImprovementConfig`](../interfaces/SelfImprovementConfig.md)\>

Defined in: [packages/agentos/src/emergent/SelfImprovementConfig.ts:197](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/emergent/SelfImprovementConfig.ts#L197)

Sensible defaults for self-improvement configuration.

Self-improvement is **disabled** by default (`enabled: false`). When opted
in, all skills are available, workflows are bounded to 10 steps, and
personality mutations decay at 5% per consolidation cycle.
