---
title: "mission() API"
sidebar_position: 3
---

`mission()` is the goal-first authoring API in the Unified Orchestration Layer. Instead of declaring nodes and edges directly, you describe the mission intent and let the compiler build the execution graph.

Current status: `mission()` compiles to a fixed phase-ordered stub graph (`gather` -> `process` -> `deliver`) with anchors and mission-level policies applied on top. Planner config is accepted and preserved, but it does not yet change graph shape at runtime.

See `/architecture/runtime-status-matrix` for the broader shipped vs partial status across orchestration, retrieval, extension loading, and backend runtime surfaces.

Use `mission()` when you want a goal-centric builder API today, when you're prototyping around anchors and policies, or when you want a forward-compatible path to richer planner-backed compilation later. When the steps stabilise, call `.toWorkflow()` to export a fixed `CompiledExecutionGraph` and switch to [workflow()](/features/workflow-dsl) or [AgentGraph](/features/agent-graph) for production.

## Quick Start

```typescript
import { mission } from '@framers/agentos/orchestration';
import { z } from 'zod';

const research = mission('deep-research')
  .input(z.object({ topic: z.string() }))
  .goal('Research {{topic}} and produce a structured report with sources')
  .returns(z.object({ report: z.string(), sources: z.array(z.string()) }))
  .planner({ strategy: 'linear', maxSteps: 8 })
  .compile();

const result = await research.invoke({ topic: 'quantum computing' });
```

## Factory Function

```typescript
mission(name: string): MissionBuilder
```

Returns a new `MissionBuilder`. The name is used as the graph's display name and as a prefix for run ids and checkpoint keys.

## Builder API

All methods return `this` for chaining. `.compile()` throws if `input`, `goal`, `returns`, or `planner` are missing.

### .input(schema)

Declares the input schema. Accepts a Zod schema or a plain JSON Schema object.

```typescript
.input(
  z.object({
    topic: z.string(),
    depth: z.enum(['brief', 'detailed']).default('detailed'),
  })
)
```

Variables declared in the input schema can be referenced in the goal template via `{{variable}}` syntax. The current stub compiler preserves that template verbatim in generated node instructions rather than interpolating it from runtime input.

### .goal(template)

Sets the goal template. The template is a free-form string with optional `{{variable}}` placeholders.

```typescript
.goal('Research {{topic}} at {{depth}} depth and produce a structured report')
```

The goal template is the primary authoring input for `mission()`. In the current implementation it is passed through into the generated reasoning nodes; future planner-backed compilation can use the same template for dynamic decomposition.

### .returns(schema)

Declares the output schema. Accepts a Zod schema or a plain JSON Schema object.

```typescript
.returns(
  z.object({
    report: z.string(),
    sources: z.array(z.string()),
    confidence: z.number(),
  })
)
```

### .planner(config)

Configures planner hints for the mission.

```typescript
.planner({
  strategy: 'linear',
  maxSteps: 8,
})
```

| Strategy | Description |
| --- | --- |
| `linear` | Accepted planner hint. The current compiler still emits the same fixed stub graph. |
| `tree` | Accepted planner hint for future branching planners. No graph-shape change today. |
| `adaptive` | Accepted planner hint for future replanning support. No runtime replanning today. |
| `critic` | Accepted planner hint for future critique/refinement passes. |
| `hierarchical` | Accepted planner hint for future sub-goal decomposition. |
| `react` | Accepted planner hint for future stepwise planning loops. |

### .policy(config)

Applies mission-level policy overrides to all compiled nodes. Node-level policies take precedence over mission-level policies.

```typescript
.policy({
  guardrails: ['content-safety', 'pii-redaction'],
  memory: {
    consistency: 'snapshot',
    write: { autoEncode: true, type: 'episodic', scope: 'session' },
  },
  onViolation: 'block',
})
```

### .anchor(id, node, constraints)

Splices a pre-built `GraphNode` into the execution order at a precise position. Anchors let you inject validation steps, human checkpoints, or specialised tool calls without modifying the planner output.

```typescript
import { humanNode, toolNode } from '@framers/agentos/orchestration';

mission('research')
  .anchor('source-verify', toolNode('citation_checker', {}, { effectClass: 'read' }), {
    phase: 'gather',
    after: 'search',
    before: 'summarize',
  })
  .anchor('human-review', humanNode({ prompt: 'Review the draft before publishing.' }), {
    phase: 'deliver',
    after: 'draft',
  });
```

| Field | Description |
| --- | --- |
| `phase` | The current compiler supports `gather`, `process`, `validate`, and `deliver` |
| `after` | Node id this anchor must run after |
| `before` | Node id this anchor must run before |

## Compilation

```typescript
const compiled = mission(...).compile({
  checkpointStore: new SqliteCheckpointStore('./missions.db'),
});
```

`compile()` validates that all required fields are present and returns a `CompiledMission`. The IR is compiled lazily on each invocation from the current builder config; today that means the same stub graph shape is regenerated each time with anchors and policies applied.

## Execution

```typescript
const result = await compiled.invoke({ topic: 'quantum computing' });

for await (const event of compiled.stream({ topic: 'quantum computing' })) {
  console.log(event.type, event.nodeId);
}

const resumed = await compiled.resume(checkpointId);
```

## Introspection

### explain()

Returns the compiled mission steps without running the mission. Useful for debugging, testing, and "what will happen" previews in UIs.

```typescript
const { ir, steps } = await compiled.explain({ topic: 'quantum computing' });
console.log(steps);
```

### toWorkflow() / toIR()

Exports the compiled mission as a static `CompiledExecutionGraph`. Use this when you want to inspect or reuse the generated IR directly.

```typescript
const ir = compiled.toWorkflow();
```
