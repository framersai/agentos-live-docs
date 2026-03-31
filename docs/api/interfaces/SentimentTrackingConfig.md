# Interface: SentimentTrackingConfig

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:240](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L240)

Configuration for sentiment-aware metaprompt tracking.
Controls whether the GMI analyzes user sentiment and triggers
event-based metaprompts in response to detected emotional states.

## Interface

SentimentTrackingConfig

## Examples

```ts
// Minimal: enable with defaults
sentimentTracking: { enabled: true }
```

```ts
// Full: LLM-based analysis with custom thresholds
sentimentTracking: {
  enabled: true,
  method: 'llm',
  historyWindow: 10,
  frustrationThreshold: -0.3,
  satisfactionThreshold: 0.3,
  consecutiveTurnsForTrigger: 2,
  presets: ['frustration_recovery', 'confusion_clarification'],
}
```

## Properties

### consecutiveTurnsForTrigger?

> `optional` **consecutiveTurnsForTrigger**: `number`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:295](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L295)

Number of consecutive turns with same sentiment pattern before triggering event.
Prevents over-triggering on single outlier messages.

#### Default

```ts
2
```

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:247](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L247)

Master switch: enables/disables sentiment analysis on user input.
When false (default), no sentiment analysis runs and no events are emitted.
Turn_interval metaprompts (like gmi_self_trait_adjustment) still work regardless.

#### Default

```ts
false
```

***

### frustrationThreshold?

> `optional` **frustrationThreshold**: `number`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:282](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L282)

Sentiment score threshold below which frustration is detected.
Score range: -1 (very negative) to 1 (very positive).

#### Default

```ts
-0.3
```

***

### historyWindow?

> `optional` **historyWindow**: `number`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:275](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L275)

Number of recent turns to keep in sentiment history (sliding window).
Higher = better pattern detection, slightly more memory.

#### Default

```ts
10
```

***

### method?

> `optional` **method**: `"llm"` \| `"lexicon_based"` \| `"trained_classifier"`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:256](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L256)

Sentiment analysis method.
- 'lexicon_based': Fast (~10-50ms), no LLM cost, basic accuracy (VADER-style)
- 'llm': Uses LLM call, higher accuracy, ~500-1000ms latency, costs tokens
- 'trained_classifier': Uses trained ML model (if available)

#### Default

```ts
'lexicon_based'
```

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:262](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L262)

Model ID for LLM-based or trained_classifier methods.
Falls back to persona defaultModelId if not specified.

***

### presets?

> `optional` **presets**: (`"all"` \| `"frustration_recovery"` \| `"confusion_clarification"` \| `"satisfaction_reinforcement"` \| `"error_recovery"` \| `"engagement_boost"`)[]

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:309](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L309)

Which preset metaprompts to enable. Options:
- 'frustration_recovery': Responds to user frustration
- 'confusion_clarification': Responds to user confusion
- 'satisfaction_reinforcement': Responds to user satisfaction
- 'error_recovery': Responds to error accumulation
- 'engagement_boost': Responds to low engagement
- 'all': Enables all presets

Only listed presets will be merged. Omit to enable none (use custom metaPrompts instead).

#### Default

```ts
[] (no presets auto-merged)
```

***

### providerId?

> `optional` **providerId**: `string`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:268](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L268)

Provider ID for LLM-based methods.
Falls back to persona defaultProviderId if not specified.

***

### satisfactionThreshold?

> `optional` **satisfactionThreshold**: `number`

Defined in: [packages/agentos/src/cognitive\_substrate/personas/IPersonaDefinition.ts:288](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/cognitive_substrate/personas/IPersonaDefinition.ts#L288)

Sentiment score threshold above which satisfaction is detected.

#### Default

```ts
0.3
```
