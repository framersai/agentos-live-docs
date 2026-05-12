# Interface: PersonaDriftConfig

Defined in: [packages/agentos/src/memory/mechanisms/PersonaDriftMechanism.ts:25](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/mechanisms/PersonaDriftMechanism.ts#L25)

## Properties

### analysisInterval

> **analysisInterval**: `number`

Defined in: [packages/agentos/src/memory/mechanisms/PersonaDriftMechanism.ts:28](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/mechanisms/PersonaDriftMechanism.ts#L28)

Consolidation cycles between drift analyses (default: 5).

***

### emotionalWeighting

> **emotionalWeighting**: `boolean`

Defined in: [packages/agentos/src/memory/mechanisms/PersonaDriftMechanism.ts:34](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/mechanisms/PersonaDriftMechanism.ts#L34)

Weight high-arousal memories more heavily in pattern detection.

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/memory/mechanisms/PersonaDriftMechanism.ts:26](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/mechanisms/PersonaDriftMechanism.ts#L26)

***

### maxDeltaPerCycle

> **maxDeltaPerCycle**: `number`

Defined in: [packages/agentos/src/memory/mechanisms/PersonaDriftMechanism.ts:32](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/mechanisms/PersonaDriftMechanism.ts#L32)

Maximum absolute trait change per analysis cycle (default: 0.05).

***

### minTracesForAnalysis

> **minTracesForAnalysis**: `number`

Defined in: [packages/agentos/src/memory/mechanisms/PersonaDriftMechanism.ts:30](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/mechanisms/PersonaDriftMechanism.ts#L30)

Minimum episodic traces since last analysis to trigger (default: 10).
