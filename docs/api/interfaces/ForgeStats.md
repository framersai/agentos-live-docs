# Interface: ForgeStats

Defined in: [packages/agentos/src/cognition/emergent/ForgeStatsAggregator.ts:19](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/ForgeStatsAggregator.ts#L19)

Per-run forge reliability rollup snapshot.

## Properties

### approved

> **approved**: `number`

Defined in: [packages/agentos/src/cognition/emergent/ForgeStatsAggregator.ts:23](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/ForgeStatsAggregator.ts#L23)

Attempts the judge approved.

***

### approvedConfidenceSum

> **approvedConfidenceSum**: `number`

Defined in: [packages/agentos/src/cognition/emergent/ForgeStatsAggregator.ts:27](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/ForgeStatsAggregator.ts#L27)

Sum of confidence across approved attempts. Divide by `approved` for avg.

***

### attempts

> **attempts**: `number`

Defined in: [packages/agentos/src/cognition/emergent/ForgeStatsAggregator.ts:21](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/ForgeStatsAggregator.ts#L21)

Total forge attempts (approved + rejected combined).

***

### rejected

> **rejected**: `number`

Defined in: [packages/agentos/src/cognition/emergent/ForgeStatsAggregator.ts:25](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/ForgeStatsAggregator.ts#L25)

Attempts the judge or shape validator rejected.

***

### rejectionReasons

> **rejectionReasons**: `Record`\<[`ForgeRejectionCategory`](../type-aliases/ForgeRejectionCategory.md), `number`\>

Defined in: [packages/agentos/src/cognition/emergent/ForgeStatsAggregator.ts:45](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/ForgeStatsAggregator.ts#L45)

Histogram of rejection reasons, classified via
[classifyForgeRejection](../functions/classifyForgeRejection.md). Keys match [ForgeRejectionCategory](../type-aliases/ForgeRejectionCategory.md).

***

### uniqueApproved

> **uniqueApproved**: `number`

Defined in: [packages/agentos/src/cognition/emergent/ForgeStatsAggregator.ts:34](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/ForgeStatsAggregator.ts#L34)

Count of unique tool names that landed approved at least once this run.

***

### uniqueNames

> **uniqueNames**: `number`

Defined in: [packages/agentos/src/cognition/emergent/ForgeStatsAggregator.ts:32](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/ForgeStatsAggregator.ts#L32)

Count of unique tool names seen this run (union of approved + rejected).
A tool rejected then re-forged under the same name counts once.

***

### uniqueTerminalRejections

> **uniqueTerminalRejections**: `number`

Defined in: [packages/agentos/src/cognition/emergent/ForgeStatsAggregator.ts:40](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/emergent/ForgeStatsAggregator.ts#L40)

Count of unique tool names that were ONLY rejected (never approved)
this run. The retry loop did not recover these. Actionable signal
for "real quality failures" vs retry churn.
