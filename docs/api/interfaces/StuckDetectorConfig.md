# Interface: StuckDetectorConfig

Defined in: [packages/agentos/src/safety/runtime/StuckDetector.ts:8](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/StuckDetector.ts#L8)

## File

StuckDetector.ts

## Description

Detects when an agent is making no progress by tracking output hashes
and error patterns. If the same output or error repeats N times within a window,
the agent is flagged as stuck.

## Properties

### errorRepetitionThreshold

> **errorRepetitionThreshold**: `number`

Defined in: [packages/agentos/src/safety/runtime/StuckDetector.ts:12](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/StuckDetector.ts#L12)

Number of identical errors before declaring stuck.

#### Default

```ts
3
```

***

### maxHistoryPerAgent

> **maxHistoryPerAgent**: `number`

Defined in: [packages/agentos/src/safety/runtime/StuckDetector.ts:16](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/StuckDetector.ts#L16)

Maximum entries to track per agent.

#### Default

```ts
50
```

***

### repetitionThreshold

> **repetitionThreshold**: `number`

Defined in: [packages/agentos/src/safety/runtime/StuckDetector.ts:10](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/StuckDetector.ts#L10)

Number of identical outputs before declaring stuck.

#### Default

```ts
3
```

***

### windowMs

> **windowMs**: `number`

Defined in: [packages/agentos/src/safety/runtime/StuckDetector.ts:14](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/safety/runtime/StuckDetector.ts#L14)

Time window in ms for detecting repetition.

#### Default

```ts
300000 (5 min)
```
