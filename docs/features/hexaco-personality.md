---
title: "HEXACO Personality"
sidebar_position: 3
---

Every AgentOS agent has a HEXACO personality profile: six continuous traits in the [0, 1] range that influence memory retrieval, response style, decision-making, and mood adaptation. The model comes from personality psychology research (Ashton & Lee, 2007) and provides a richer behavioral basis than Big Five by adding the Honesty-Humility dimension.

## The Six Traits

| Trait | Low (0.0) | High (1.0) | Agent behavior |
|-------|-----------|------------|----------------|
| **Honesty-Humility** (H) | Self-interested, status-seeking | Sincere, fair, modest | Influences transparency in responses, willingness to admit uncertainty |
| **Emotionality** (E) | Detached, stoic | Empathetic, anxious | Modulates emotional memory encoding strength, mood sensitivity |
| **Extraversion** (X) | Reserved, quiet | Sociable, assertive | Affects response verbosity, initiative in conversation |
| **Agreeableness** (A) | Critical, confrontational | Patient, cooperative | Influences conflict handling, tone in disagreements |
| **Conscientiousness** (C) | Flexible, spontaneous | Disciplined, thorough | Affects planning depth, tool usage frequency, verification behavior |
| **Openness** (O) | Conventional, practical | Creative, curious | Influences willingness to use emergent tools, explore novel approaches |

## Configuration

### Via `agent()` helper

```typescript
import { agent } from '@framers/agentos';

const bot = agent({
  provider: 'anthropic',
  instructions: 'You are a research assistant.',
  personality: {
    openness: 0.9,
    conscientiousness: 0.95,
    emotionality: 0.4,
    extraversion: 0.6,
    agreeableness: 0.7,
    honesty: 0.85,
  },
});
```

### Via full persona definition

```typescript
const persona: IPersonaDefinition = {
  id: 'research-analyst',
  name: 'Research Analyst',
  personalityTraits: {
    openness: 0.85,
    conscientiousness: 0.9,
    emotionality: 0.3,
    extraversion: 0.4,
    agreeableness: 0.65,
    honestyHumility: 0.9,
  },
  systemPrompt: 'You are a meticulous research analyst.',
  moodAdaptation: {
    enabled: true,
    defaultMood: 'analytical',
    sensitivityFactor: 0.7,
  },
};
```

## How Traits Influence Behavior

### Memory Retrieval Bias

Personality traits modulate which memories surface during retrieval:

- High **emotionality** amplifies emotional memory encoding, making emotionally charged memories more accessible.
- High **openness** broadens retrieval scope, surfacing more diverse associations.
- High **conscientiousness** favors structured, task-relevant memories.

### Response Style

The prompt engine uses trait values to shape response characteristics:

- **Extraversion** correlates with response length and conversational initiative.
- **Agreeableness** shapes tone during disagreements or corrections.
- **Openness** increases willingness to suggest creative or unconventional solutions.

### Mood Adaptation

When `moodAdaptation.enabled` is true, the agent's mood shifts based on interaction context. The `sensitivityFactor` (0 to 1) controls how quickly mood changes, and personality traits gate which moods are reachable:

- High emotionality agents shift moods more readily.
- High conscientiousness agents tend toward `focused` and `analytical` moods.
- High extraversion agents tend toward `curious` and `creative` moods.

Available moods: `neutral`, `focused`, `empathetic`, `curious`, `assertive`, `analytical`, `frustrated`, `creative`.

## Runtime Personality Mutation

Agents with self-improvement enabled can modify their own traits at runtime via the [`adapt_personality`](/features/emergent-capabilities#adapt_personality--hexaco-trait-mutation) tool. Mutations are:

- Bounded by per-session budgets (`maxDeltaPerSession`, default 0.15)
- Clamped to [0, 1]
- Persisted in the `PersonalityMutationStore` with Ebbinghaus-style decay
- Require reasoning strings for audit trails

Over time, mutations decay toward baseline at the configured `decayRate` (default 5% per consolidation cycle). This prevents permanent personality drift from accumulating.

## Persona Overlays

The `PersonaOverlayManager` applies runtime patches to a persona's base definition based on evolution rules. This is used in multi-agent workflows where an agent's personality should shift based on its role or context.

```typescript
import { PersonaOverlayManager } from '@framers/agentos';

const manager = new PersonaOverlayManager();
const overlay = manager.applyRules({
  persona: basePersona,
  rules: [
    {
      id: 'increase-assertiveness-for-negotiation',
      condition: { roleId: 'negotiator' },
      patch: {
        personaTraits: { extraversion: 0.9, agreeableness: 0.3 },
        mood: 'assertive',
      },
    },
  ],
  context: { workflowId: 'deal-review', roleId: 'negotiator' },
});

// overlay.patchedDefinition contains the modified traits
```

Rules can patch `personaTraits`, `mood`, and `metadata`. Previously applied rules accumulate in `overlay.appliedRules` for audit.

## Built-in Persona Definitions

AgentOS ships with several preset persona definitions:

| Persona | Profile |
|---------|---------|
| Default Assistant | Balanced traits, general-purpose |
| Atlas Systems Architect | High conscientiousness and openness, analytical focus |
| V Researcher | High openness and conscientiousness, research-oriented |
| Default Free Assistant | Relaxed constraints, higher creativity |

Custom personas are defined as JSON files in `cognitive_substrate/personas/definitions/` and loaded by the `PersonaLoader`.

## Related

- [Cognitive Mechanisms](/features/cognitive-mechanisms) -- how personality interacts with memory mechanisms
- [Emergent Capabilities](/features/emergent-capabilities#self-improvement-tools) -- runtime personality mutation via adapt_personality
- [Agency API](/features/agency-api) -- persona assignment in multi-agent teams
- **API Reference:** [`IPersonaDefinition`](/api/interfaces/IPersonaDefinition) | [`PersonaOverlayManager`](/api/classes/PersonaOverlayManager)
