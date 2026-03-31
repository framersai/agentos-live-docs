# Interface: EncodingConfig

Defined in: [packages/agentos/src/memory/core/config.ts:41](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L41)

## Properties

### baseStabilityMs

> **baseStabilityMs**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:51](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L51)

Base stability in ms (how long before strength halves).

#### Default

```ts
3_600_000 (1 hour)
```

***

### baseStrength

> **baseStrength**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:43](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L43)

Base encoding strength before personality modulation.

#### Default

```ts
0.5
```

***

### flashbulbStabilityMultiplier

> **flashbulbStabilityMultiplier**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:49](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L49)

Stability multiplier for flashbulb memories.

#### Default

```ts
5.0
```

***

### flashbulbStrengthMultiplier

> **flashbulbStrengthMultiplier**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:47](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L47)

Strength multiplier for flashbulb memories.

#### Default

```ts
2.0
```

***

### flashbulbThreshold

> **flashbulbThreshold**: `number`

Defined in: [packages/agentos/src/memory/core/config.ts:45](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/core/config.ts#L45)

Emotional intensity threshold for flashbulb memory.

#### Default

```ts
0.8
```
